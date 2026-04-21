import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { createTravelEntry, listTravelEntries } from "@/lib/travel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const entries = await listTravelEntries();
  const url = new URL(req.url);
  const offsetParam = url.searchParams.get("offset");
  const limitParam = url.searchParams.get("limit");
  if (offsetParam !== null || limitParam !== null) {
    const offset = Math.max(0, parseInt(offsetParam ?? "0", 10) || 0);
    const limit = Math.min(100, Math.max(1, parseInt(limitParam ?? "12", 10) || 12));
    const items = entries.slice(offset, offset + limit);
    return NextResponse.json({ items, total: entries.length, offset, limit });
  }
  return NextResponse.json(entries);
}

export async function POST(req: Request) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (!body.locationName || !body.startDate || !body.country) {
    return NextResponse.json(
      { error: "locationName, startDate, country required" },
      { status: 400 },
    );
  }
  if (typeof body.lat !== "number" || typeof body.lng !== "number") {
    return NextResponse.json({ error: "lat and lng required" }, { status: 400 });
  }
  const entry = await createTravelEntry({
    locationName: String(body.locationName),
    startDate: String(body.startDate),
    endDate: body.endDate ? String(body.endDate) : undefined,
    city: body.city ? String(body.city) : undefined,
    state: body.state ? String(body.state) : undefined,
    country: String(body.country),
    lat: body.lat,
    lng: body.lng,
    content: body.content ? String(body.content) : "",
    photos: Array.isArray(body.photos) ? (body.photos as any[]) : [],
    featuredPhotoId: body.featuredPhotoId ? String(body.featuredPhotoId) : undefined,
    publishedAt: body.publishedAt ? String(body.publishedAt) : undefined,
  });
  return NextResponse.json(entry, { status: 201 });
}
