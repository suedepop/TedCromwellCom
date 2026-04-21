import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { deleteConcertById, findConcertById, upsertConcert } from "@/lib/concerts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const concert = await findConcertById(params.id);
  if (!concert) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(concert);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const existing = await findConcertById(params.id);
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const updated = await upsertConcert({ ...existing, ...(body as object), id: existing.id });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const ok = await deleteConcertById(params.id);
  return NextResponse.json({ ok });
}
