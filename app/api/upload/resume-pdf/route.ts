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
  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "pdf required" }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const { blobUrl } = await uploadBufferWithName(
    "resume",
    buffer,
    "application/pdf",
    `${randomUUID()}.pdf`,
  );
  return NextResponse.json({ blobUrl });
}
