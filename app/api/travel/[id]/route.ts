import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { deleteTravelEntry, getTravelEntry, updateTravelEntry } from "@/lib/travel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const entry = await getTravelEntry(params.id);
  if (!entry) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(entry);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const existing = await getTravelEntry(params.id);
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const updated = await updateTravelEntry(existing, body as any);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const existing = await getTravelEntry(params.id);
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
  await deleteTravelEntry(existing);
  return NextResponse.json({ ok: true });
}
