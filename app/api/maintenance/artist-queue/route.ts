import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { listStoredArtists } from "@/lib/artists";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Slim list of artists that still need at least one external ID.
 * Used by the bulk Artist Lookup modal so it can iterate without re-querying
 * Cosmos for every step.
 */
export interface QueueItem {
  slug: string;
  name: string;
  hasMusicbrainz: boolean;
  hasSetlistFm: boolean;
  hasDiscogs: boolean;
}

export async function GET(req: Request) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const stored = await listStoredArtists();
  const queue: QueueItem[] = stored
    .map((a) => ({
      slug: a.slug,
      name: a.name,
      hasMusicbrainz: !!a.musicbrainzId,
      hasSetlistFm: !!a.setlistFmMbid,
      hasDiscogs: !!a.discogsArtistId,
    }))
    .filter((a) => !a.hasMusicbrainz || !a.hasDiscogs)
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
  return NextResponse.json({ queue, total: queue.length });
}
