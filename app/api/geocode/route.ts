import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
}

export async function GET(req: Request) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }
  const n = new URL("https://nominatim.openstreetmap.org/search");
  n.searchParams.set("q", q);
  n.searchParams.set("format", "json");
  n.searchParams.set("limit", "5");
  n.searchParams.set("addressdetails", "0");
  const res = await fetch(n.toString(), {
    headers: {
      "User-Agent": "TedCromwellCom/1.0 (https://www.tedcromwell.com)",
      Accept: "application/json",
    },
  });
  if (!res.ok) return NextResponse.json({ error: `nominatim ${res.status}` }, { status: 502 });
  const raw = (await res.json()) as NominatimResult[];
  const results = raw.map((r) => ({
    label: r.display_name,
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
    type: r.type,
  }));
  return NextResponse.json({ results });
}
