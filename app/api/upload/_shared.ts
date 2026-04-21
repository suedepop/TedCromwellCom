import { NextResponse } from "next/server";
import type { BlobContainer } from "@/lib/blob";
import { requireAdminFromRequest } from "@/lib/authServer";
import { isImageMime, processAndUploadImage } from "@/lib/upload";

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|heic|heif)$/i;

export async function handleImageUpload(req: Request, container: BlobContainer) {
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
    const result = await processAndUploadImage(container, buffer);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
