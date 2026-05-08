import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { listRecords, type RecordSort } from "@/lib/records";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const isAdmin = !!requireAdminFromRequest(req);
  const sortParam = url.searchParams.get("sort") as RecordSort | null;
  const sort: RecordSort | undefined =
    sortParam === "artist" || sortParam === "added" || sortParam === "year" ? sortParam : undefined;
  const records = await listRecords({ includeHidden: isAdmin, sort });

  const offsetParam = url.searchParams.get("offset");
  const limitParam = url.searchParams.get("limit");
  if (offsetParam !== null || limitParam !== null) {
    const offset = Math.max(0, parseInt(offsetParam ?? "0", 10) || 0);
    const limit = Math.min(100, Math.max(1, parseInt(limitParam ?? "16", 10) || 16));
    const items = records.slice(offset, offset + limit);
    return NextResponse.json({ items, total: records.length, offset, limit });
  }
  return NextResponse.json(records);
}
