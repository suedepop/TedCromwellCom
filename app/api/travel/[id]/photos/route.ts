import { NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import { requireAdminFromRequest } from "@/lib/authServer";
import { containers } from "@/lib/cosmos";
import { isImageMime, processAndUploadImageWithBase } from "@/lib/upload";
import type { Photo, TravelEntry } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Single photo upload + a couple of small Cosmos ops. Comfortably under 60s
// even for very large images that need HEIC decoding first.
export const maxDuration = 60;

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|heic|heif)$/i;

/**
 * Atomic per-photo append: upload → dedup-check → append. Called once per
 * file by the client, serially per entry, so the previous read-modify-write
 * of the whole entry-with-photos gets replaced with a per-photo cycle that
 * survives browser closes and other mid-batch interruptions.
 *
 * Response shape:
 *   { duplicate: false, photo }               new photo, entry updated
 *   { duplicate: true,  existingPhotoId }    same file already on this entry
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
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

  // Fetch the entry ONCE up-front to check for a hash-based duplicate before
  // paying for sharp + blob upload. If there is one, we can short-circuit
  // entirely — no blob writes, no Cosmos writes.
  const { resource: entry } = await containers.trips
    .item(params.id, params.id)
    .read<TravelEntry>()
    .catch(() => ({ resource: null as TravelEntry | null }));
  if (!entry) {
    return NextResponse.json({ error: "travel entry not found" }, { status: 404 });
  }
  const existing = (entry.photos ?? []).find((p) => p.hash === hash);
  if (existing) {
    return NextResponse.json({ duplicate: true, existingPhotoId: existing.id });
  }

  // Upload with a hash-based blob name so re-uploads of the same file
  // overwrite the same blob rather than accumulating orphans. If the entry
  // append below fails, this blob is at worst a re-storable near-idempotent
  // copy of a real photo.
  let uploaded;
  try {
    uploaded = await processAndUploadImageWithBase("photos", buffer, hash);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }

  // Re-read the entry immediately before appending so we minimize the race
  // window against a concurrent PUT that also carries photos. Serial-client
  // uploads (see UploadDropzone concurrency=1 for photo endpoints) mean this
  // is normally uncontended.
  const { resource: current } = await containers.trips
    .item(params.id, params.id)
    .read<TravelEntry>();
  if (!current) {
    return NextResponse.json({ error: "travel entry vanished" }, { status: 409 });
  }
  // Re-check duplicates against the freshly-read entry, in case another
  // upload landed the same hash between our two reads.
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
    // Basename only — strip any path fragments a browser might include.
    filename: file.name.split(/[\\/]/).pop() || undefined,
  };
  const updated: TravelEntry = {
    ...current,
    photos: [...(current.photos ?? []), newPhoto],
    updatedAt: new Date().toISOString(),
  };
  await containers.trips.item(params.id, params.id).replace(updated);

  return NextResponse.json({ duplicate: false, photo: newPhoto });
}
