import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { backfillSlugs } from "@/lib/maintenance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as { dryRun?: boolean };
  try {
    const result = await backfillSlugs({ dryRun: !!body.dryRun });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
