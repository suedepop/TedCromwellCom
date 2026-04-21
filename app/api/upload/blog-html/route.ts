import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { requireAdminFromRequest } from "@/lib/authServer";
import { uploadBufferWithName } from "@/lib/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "file field required" }, { status: 400 });
  }
  const isHtml = /\.html?$/i.test(file.name) || file.type === "text/html";
  if (!isHtml) {
    return NextResponse.json({ error: `expected .html file, got ${file.type || file.name}` }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const { blobUrl } = await uploadBufferWithName(
    "blog",
    buffer,
    "text/html; charset=utf-8",
    `post-${randomUUID()}.html`,
  );
  return NextResponse.json({ blobUrl });
}
