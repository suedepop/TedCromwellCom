import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { buildCoasterSlug, listCoasters, upsertCoasterBySlug } from "@/lib/coasters";
import { getPark } from "@/lib/parks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const coasters = await listCoasters();
  return NextResponse.json(coasters);
}

export async function POST(req: Request) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const parkId = typeof body.parkId === "string" ? body.parkId.trim() : "";
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
  if (!parkId) return NextResponse.json({ error: "parkId required" }, { status: 400 });

  const park = await getPark(parkId);
  if (!park) return NextResponse.json({ error: "park not found" }, { status: 400 });

  const slug = typeof body.slug === "string" && body.slug.trim()
    ? body.slug.trim()
    : buildCoasterSlug(name, park.slug);

  const created = await upsertCoasterBySlug(slug, { name, parkId });
  return NextResponse.json(created, { status: 201 });
}
