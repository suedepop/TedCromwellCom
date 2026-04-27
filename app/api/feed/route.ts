import { NextResponse } from "next/server";
import { listFeedPage } from "@/lib/feed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const offset = Math.max(0, parseInt(url.searchParams.get("offset") ?? "0", 10) || 0);
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") ?? "12", 10) || 12));
  const page = await listFeedPage(offset, limit);
  return NextResponse.json(page);
}
