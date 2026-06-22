import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { isImageMime, processAndUploadImage } from "@/lib/upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|heic|heif)$/i;

export async function POST(req: Request) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "file field required" }, { status: 400 });
  }
  const ok = isImageMime(file.type) || IMAGE_EXT.test(file.name);
  if (!ok) {
    return NextResponse.json(
      { error: `unsupported type ${file.type || "unknown"} (${file.name})` },
      { status: 400 },
    );
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    // Coaster cover photos get the standard 1200px hero + 400px thumbnail
    // treatment (same as blog covers and travel photos), uploaded to the
    // "coasters" Blob container.
    const result = await processAndUploadImage("coasters", buffer);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
