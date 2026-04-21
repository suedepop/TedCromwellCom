import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { runImport } from "@/lib/setlistfm";

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
    return NextResponse.json({
      newConcerts: result.newConcerts,
      skipped: result.skipped,
      newVenues: result.newVenues,
      newVenueNames: result.newVenueNames,
      fetchedFromApi: result.fetchedFromApi,
      apiReportedTotal: result.apiReportedTotal,
      pagesFetched: result.pagesFetched,
      committed: !!commit,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
