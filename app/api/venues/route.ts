import { NextResponse } from "next/server";
import { listVenues } from "@/lib/venues";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const venues = await listVenues();
  return NextResponse.json(venues);
}
