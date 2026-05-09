import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { deleteRecord, getRecord, updateRecord } from "@/lib/records";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const record = await getRecord(params.id);
  if (!record) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(record);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const updated = await updateRecord(params.id, {
    notes: typeof body.notes === "string" ? body.notes : undefined,
    writeUp: typeof body.writeUp === "string" ? body.writeUp : undefined,
    hidden: typeof body.hidden === "boolean" ? body.hidden : undefined,
  });
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const ok = await deleteRecord(params.id);
  return NextResponse.json({ ok });
}
