import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { getVenue, updateVenue } from "@/lib/venues";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const venue = await getVenue(params.id);
  if (!venue) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(venue);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const updated = await updateVenue(params.id, body);
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(updated);
}
