import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { runDiscogsImport } from "@/lib/discogs";
import { bootstrapArtists } from "@/lib/maintenance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { commit } = (await req.json().catch(() => ({}))) as { commit?: boolean };
  try {
    const result = await runDiscogsImport({ commit: !!commit });

    // After a successful commit, bootstrap any new Artist docs and refill any
    // missing Discogs IDs we now have data for. Failures don't break the import.
    let postRun: { artistsCreated?: number; artistsUpdated?: number; postRunError?: string } = {};
    if (commit) {
      try {
        const boot = await bootstrapArtists({ refillDiscogs: true });
        postRun = {
          artistsCreated: boot.created,
          artistsUpdated: boot.updated,
        };
      } catch (e) {
        postRun.postRunError = (e as Error).message;
      }
    }

    return NextResponse.json({ ...result, ...postRun });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
