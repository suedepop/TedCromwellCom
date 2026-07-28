import { NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import { requireAdminFromRequest } from "@/lib/authServer";
import { containers } from "@/lib/cosmos";
import { isImageMime, processAndUploadImageWithBase } from "@/lib/upload";
import type { Coaster, Photo } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|heic|heif)$/i;

/**
 * Atomic per-photo append for coasters — mirrors the travel-entry
 * pattern. Called once per file (concurrency=1 on the client dropzone)
 * so a browser-close mid-batch preserves the already-uploaded photos.
 *
 * Response:
 *   { duplicate: false, photo }             new photo, coaster updated
 *   { duplicate: true, existingPhotoId }    same content already attached
 */
export async function POST(req: Request, { params }: { params: { slug: string } }) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "file field required" }, { status: 400 });
  }
  if (!isImageMime(file.type) && !IMAGE_EXT.test(file.name)) {
    return NextResponse.json(
      { error: `unsupported type ${file.type || "unknown"} (${file.name})` },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const hash = createHash("sha256").update(buffer).digest("hex");

  const { resource: coaster } = await containers.coasters
    .item(params.slug, params.slug)
    .read<Coaster>()
    .catch(() => ({ resource: null as Coaster | null }));
  if (!coaster) {
    return NextResponse.json({ error: "coaster not found" }, { status: 404 });
  }
  const existing = (coaster.photos ?? []).find((p) => p.hash === hash);
  if (existing) {
    return NextResponse.json({ duplicate: true, existingPhotoId: existing.id });
  }

  let uploaded;
  try {
    uploaded = await processAndUploadImageWithBase("coasters", buffer, hash);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }

  // Re-read to minimize the race window against a concurrent PUT.
  const { resource: current } = await containers.coasters
    .item(params.slug, params.slug)
    .read<Coaster>();
  if (!current) {
    return NextResponse.json({ error: "coaster vanished" }, { status: 409 });
  }
  const race = (current.photos ?? []).find((p) => p.hash === hash);
  if (race) {
    return NextResponse.json({ duplicate: true, existingPhotoId: race.id });
  }

  const newPhoto: Photo = {
    id: randomUUID(),
    blobUrl: uploaded.blobUrl,
    thumbnailUrl: uploaded.thumbnailUrl,
    uploadedAt: new Date().toISOString(),
    hash,
    filename: file.name.split(/[\\/]/).pop() || undefined,
  };
  const updated: Coaster = {
    ...current,
    photos: [...(current.photos ?? []), newPhoto],
    updatedAt: new Date().toISOString(),
  };
  await containers.coasters.item(params.slug, params.slug).replace(updated);

  return NextResponse.json({ duplicate: false, photo: newPhoto });
}
