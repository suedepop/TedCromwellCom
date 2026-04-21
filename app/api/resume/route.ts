import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { getResume, upsertResume } from "@/lib/resume";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const resume = await getResume();
  if (!resume) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(resume);
}

export async function PUT(req: Request) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const updated = await upsertResume(body as any);
  return NextResponse.json(updated);
}
