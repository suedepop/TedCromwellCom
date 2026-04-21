import { NextResponse } from "next/server";
import { listConcerts } from "@/lib/concerts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const concerts = await listConcerts({
    venueId: url.searchParams.get("venueId") ?? undefined,
    year: url.searchParams.get("year") ?? undefined,
    artist: url.searchParams.get("artist") ?? undefined,
  });
  const offsetParam = url.searchParams.get("offset");
  const limitParam = url.searchParams.get("limit");
  if (offsetParam !== null || limitParam !== null) {
    const offset = Math.max(0, parseInt(offsetParam ?? "0", 10) || 0);
    const limit = Math.min(100, Math.max(1, parseInt(limitParam ?? "12", 10) || 12));
    const items = concerts.slice(offset, offset + limit);
    return NextResponse.json({ items, total: concerts.length, offset, limit });
  }
  return NextResponse.json(concerts);
}
