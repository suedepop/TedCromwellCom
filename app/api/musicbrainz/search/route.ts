import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { searchArtists } from "@/lib/musicbrainz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  if (!q) return NextResponse.json({ artists: [] });
  try {
    const artists = await searchArtists(q, 10);
    return NextResponse.json({ artists });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
