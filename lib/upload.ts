import sharp from "sharp";
import heicConvert from "heic-convert";
import { randomUUID } from "node:crypto";
import { uploadBufferWithName, type BlobContainer } from "./blob";

export interface ImageUploadResult {
  blobUrl: string;
  thumbnailUrl: string;
  contentType: string;
}

function looksLikeHeic(buf: Buffer): boolean {
  // HEIC/HEIF files use an ISO-BMFF container: bytes 4..8 are "ftyp",
  // then 8..12 is a brand like "heic", "heix", "mif1", "heim", "heis", etc.
  if (buf.length < 12) return false;
  if (buf.slice(4, 8).toString("ascii") !== "ftyp") return false;
  const brand = buf.slice(8, 12).toString("ascii");
  return ["heic", "heix", "heim", "heis", "mif1", "msf1"].includes(brand);
}

async function decodeToJpeg(input: Buffer): Promise<Buffer> {
  if (!looksLikeHeic(input)) return input;
  const out = await heicConvert({
    buffer: input as unknown as ArrayBufferLike,
    format: "JPEG",
    quality: 0.9,
  });
  return Buffer.from(out as ArrayBuffer);
}

export async function processAndUploadImage(
  containerName: BlobContainer,
  input: Buffer,
): Promise<ImageUploadResult> {
  const id = randomUUID();
  const decoded = await decodeToJpeg(input);
  const main = await sharp(decoded)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 85, progressive: true })
    .toBuffer();
  const thumb = await sharp(decoded)
    .rotate()
    .resize({ width: 400, withoutEnlargement: true })
    .jpeg({ quality: 80, progressive: true })
    .toBuffer();

  const [{ blobUrl }, { blobUrl: thumbnailUrl }] = await Promise.all([
    uploadBufferWithName(containerName, main, "image/jpeg", `${id}.jpg`),
    uploadBufferWithName(containerName, thumb, "image/jpeg", `${id}-thumb.jpg`),
  ]);

  return { blobUrl, thumbnailUrl, contentType: "image/jpeg" };
}

export function isImageMime(mime: string): boolean {
  return /^image\/(jpeg|jpg|png|webp|gif|heic|heif)$/i.test(mime);
}

/**
 * Artist portraits are stored at a fixed 300x300 (smart cover crop) — no
 * separate thumbnail since the image is already small. Uses sharp's "attention"
 * heuristic to keep the focal subject (typically a face) centered.
 */
export async function processAndUploadArtistImage(
  input: Buffer,
): Promise<{ blobUrl: string; contentType: string }> {
  const id = randomUUID();
  const decoded = await decodeToJpeg(input);
  const main = await sharp(decoded)
    .rotate()
    .resize({ width: 300, height: 300, fit: "cover", position: "attention" })
    .jpeg({ quality: 85, progressive: true })
    .toBuffer();
  const { blobUrl } = await uploadBufferWithName(
    "artists",
    main,
    "image/jpeg",
    `${id}.jpg`,
  );
  return { blobUrl, contentType: "image/jpeg" };
}
