import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { runDiscogsImport } from "@/lib/discogs";

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
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
