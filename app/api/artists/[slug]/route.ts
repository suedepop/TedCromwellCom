import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { upsertStoredArtist, deleteStoredArtist, getStoredArtist } from "@/lib/artists";

export const runtime = "nodejs";

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  const aliases = Array.isArray(body.aliases)
    ? (body.aliases as unknown[])
        .map((a) => (typeof a === "string" ? a.trim() : ""))
        .filter(Boolean)
    : undefined;

  const updated = await upsertStoredArtist(params.slug, {
    name,
    aliases,
    musicbrainzId: typeof body.musicbrainzId === "string" ? body.musicbrainzId.trim() || undefined : undefined,
    setlistFmMbid: typeof body.setlistFmMbid === "string" ? body.setlistFmMbid.trim() || undefined : undefined,
    discogsArtistId: typeof body.discogsArtistId === "number" && Number.isFinite(body.discogsArtistId)
      ? body.discogsArtistId
      : typeof body.discogsArtistId === "string" && body.discogsArtistId.trim()
        ? Number(body.discogsArtistId)
        : undefined,
    description: typeof body.description === "string" ? body.description : undefined,
    imageUrl: typeof body.imageUrl === "string" ? body.imageUrl.trim() || undefined : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const ok = await deleteStoredArtist(params.slug);
  return NextResponse.json({ ok });
}

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const artist = await getStoredArtist(params.slug);
  if (!artist) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(artist);
}
