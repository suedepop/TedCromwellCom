import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { getVenue } from "@/lib/venues";
import { lookupByWikipediaUrl, lookupVenue } from "@/lib/wikipedia";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const venue = await getVenue(params.id);
  if (!venue) return NextResponse.json({ error: "not found" }, { status: 404 });

  const url = new URL(req.url);
  const wikipediaUrl = url.searchParams.get("url") ?? venue.wikipediaUrl;
  const queryOverride = url.searchParams.get("q");

  const attempts: string[] = [];

  // 1. If the caller already knows the exact Wikipedia URL, use it directly.
  if (wikipediaUrl) {
    try {
      const hit = await lookupByWikipediaUrl(wikipediaUrl);
      if (hit) return NextResponse.json({ ...hit, source: "url" });
      attempts.push(`url returned empty: ${wikipediaUrl}`);
    } catch (e) {
      attempts.push(`url error: ${(e as Error).message}`);
    }
  }

  // 2. Fall through to name-based search as a backup.
  const candidates = [
    queryOverride,
    `${venue.canonicalName} (${venue.city})`,
    `${venue.canonicalName} ${venue.city}`,
    venue.canonicalName,
    ...venue.aliases,
  ].filter((s): s is string => !!s && s.length > 0);

  for (const q of candidates) {
    try {
      const hit = await lookupVenue(q);
      if (hit) return NextResponse.json({ ...hit, query: q, source: "search" });
      attempts.push(`search: ${q}`);
    } catch (e) {
      attempts.push(`search error (${q}): ${(e as Error).message}`);
    }
  }
  return NextResponse.json(
    { error: "no Wikipedia match", attempts },
    { status: 404 },
  );
}
