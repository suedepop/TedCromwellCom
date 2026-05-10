import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { runImport } from "@/lib/setlistfm";
import { backfillSlugs, bootstrapArtists } from "@/lib/maintenance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { commit } = (await req.json().catch(() => ({}))) as { commit?: boolean };
  try {
    const result = await runImport({ commit: !!commit });

    // After a successful commit, automatically backfill slugs and bootstrap any
    // artists we haven't seen before. Failures here do not invalidate the import.
    let postRun: { artistsCreated?: number; slugsAddedConcerts?: number; postRunError?: string } = {};
    if (commit) {
      try {
        const slugs = await backfillSlugs({});
        const boot = await bootstrapArtists({});
        postRun = {
          slugsAddedConcerts: slugs.concertsUpdated,
          artistsCreated: boot.created,
        };
      } catch (e) {
        postRun.postRunError = (e as Error).message;
      }
    }

    return NextResponse.json({
      newConcerts: result.newConcerts,
      skipped: result.skipped,
      newVenues: result.newVenues,
      newVenueNames: result.newVenueNames,
      fetchedFromApi: result.fetchedFromApi,
      apiReportedTotal: result.apiReportedTotal,
      pagesFetched: result.pagesFetched,
      committed: !!commit,
      ...postRun,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
