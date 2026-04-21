import { NextResponse } from "next/server";
import { buildSearchIndex } from "@/lib/searchIndex";

export const runtime = "nodejs";
export const revalidate = 600;

export async function GET() {
  const index = await buildSearchIndex();
  return NextResponse.json(index, {
    headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" },
  });
}
