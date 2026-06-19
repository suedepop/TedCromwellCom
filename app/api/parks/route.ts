import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { buildParkSlug, listParks, upsertParkBySlug } from "@/lib/parks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const parks = await listParks();
  return NextResponse.json(parks);
}

export async function POST(req: Request) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const country = typeof body.country === "string" ? body.country.trim() : "";
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
  if (!country) return NextResponse.json({ error: "country required" }, { status: 400 });

  const slug = typeof body.slug === "string" && body.slug.trim()
    ? body.slug.trim()
    : buildParkSlug(name);

  const created = await upsertParkBySlug(slug, { name, country });
  return NextResponse.json(created, { status: 201 });
}
