import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import {
  syncCoastersFromCoasterCount,
  DEFAULT_COASTER_COUNT_USER_ID,
} from "@/lib/coasterSync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// 490 coasters × 2 round-trips to Cosmos = ~1000 ops. SWA Standard plan
// allows up to 30 min, but realistically this finishes in under a minute.
export const maxDuration = 300;

export async function POST(req: Request) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as {
    userId?: number;
    dryRun?: boolean;
  };
  const userId =
    typeof body.userId === "number" && Number.isFinite(body.userId)
      ? body.userId
      : DEFAULT_COASTER_COUNT_USER_ID;
  try {
    const result = await syncCoastersFromCoasterCount({
      userId,
      dryRun: !!body.dryRun,
    });
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
