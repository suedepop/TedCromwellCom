import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { deletePark, getPark, upsertParkBySlug } from "@/lib/parks";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const park = await getPark(params.slug);
  if (!park) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(park);
}

function num(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim()) {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function str(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t ? t : undefined;
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = str(body.name);
  const country = str(body.country);
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
  if (!country) return NextResponse.json({ error: "country required" }, { status: 400 });

  const aliases = Array.isArray(body.aliases)
    ? (body.aliases as unknown[])
        .map((a) => (typeof a === "string" ? a.trim() : ""))
        .filter(Boolean)
    : undefined;

  const externalIds: { coasterCountId?: number; rcdbId?: number } = {};
  if (body.externalIds && typeof body.externalIds === "object") {
    const ext = body.externalIds as Record<string, unknown>;
    const cc = num(ext.coasterCountId);
    const rc = num(ext.rcdbId);
    if (cc !== undefined) externalIds.coasterCountId = cc;
    if (rc !== undefined) externalIds.rcdbId = rc;
  }

  const updated = await upsertParkBySlug(params.slug, {
    name,
    country,
    aliases,
    city: str(body.city),
    state: str(body.state),
    lat: num(body.lat),
    lng: num(body.lng),
    url: str(body.url),
    description: typeof body.description === "string" ? body.description : undefined,
    imageUrl: str(body.imageUrl),
    notes: typeof body.notes === "string" ? body.notes : undefined,
    closed: typeof body.closed === "boolean" ? body.closed : undefined,
    closedYear: num(body.closedYear),
    externalIds,
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const ok = await deletePark(params.slug);
  return NextResponse.json({ ok });
}
