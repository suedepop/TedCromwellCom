/**
 * Renders app/icon.svg to a multi-resolution app/favicon.ico (16/32/48 px).
 * The .ico embeds PNG-compressed frames (valid since Windows Vista; supported
 * by all current browsers and Googlebot). Run: npx tsx scripts/generate-favicon.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = join(__dirname, "..");
const SVG = join(ROOT, "app", "icon.svg");
const OUT = join(ROOT, "app", "favicon.ico");
const SIZES = [16, 32, 48];

async function main() {
  const svg = readFileSync(SVG);
  const pngs = await Promise.all(
    SIZES.map((size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer()),
  );

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(SIZES.length, 4); // image count

  const entries: Buffer[] = [];
  let offset = 6 + SIZES.length * 16;
  pngs.forEach((png, i) => {
    const size = SIZES[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset of image data
    offset += png.length;
    entries.push(entry);
  });

  const ico = Buffer.concat([header, ...entries, ...pngs]);
  writeFileSync(OUT, ico);
  console.log(`Wrote ${OUT} (${ico.length} bytes, sizes: ${SIZES.join("/")}px)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
