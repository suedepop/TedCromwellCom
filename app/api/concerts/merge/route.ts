import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { mergeConcerts } from "@/lib/concerts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { keepId, mergeId } = (await req.json().catch(() => ({}))) as {
    keepId?: string;
    mergeId?: string;
  };
  if (!keepId || !mergeId || keepId === mergeId) {
    return NextResponse.json(
      { error: "keepId and mergeId required and distinct" },
      { status: 400 },
    );
  }
  const merged = await mergeConcerts(keepId, mergeId);
  if (!merged) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(merged);
}
