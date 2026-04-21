import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { splitAliasToNewVenue } from "@/lib/venues";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { alias } = (await req.json().catch(() => ({}))) as { alias?: string };
  if (!alias) {
    return NextResponse.json({ error: "alias required" }, { status: 400 });
  }
  const result = await splitAliasToNewVenue(params.id, alias);
  if (!result) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(result);
}
