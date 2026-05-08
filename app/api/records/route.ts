import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { listRecords } from "@/lib/records";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const isAdmin = !!requireAdminFromRequest(req);
  const records = await listRecords({ includeHidden: isAdmin });
  return NextResponse.json(records);
}
