import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { getPark } from "@/lib/parks";
import { lookupRcdbPark } from "@/lib/rcdb";

export const runtime = "nodejs";

/**
 * Pull whatever the RCDB page surfaces for this park's RCDB id and return
 * it for the admin editor to merge into the form. Does NOT save — the
 * editor lets the admin review and Save.
 *
 * Body (optional): { rcdbId?: number } — overrides the stored externalIds.rcdbId.
 */
export async function POST(req: Request, { params }: { params: { slug: string } }) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const park = await getPark(params.slug);
  if (!park) return NextResponse.json({ error: "park not found" }, { status: 404 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const overrideId =
    typeof body.rcdbId === "number"
      ? body.rcdbId
      : typeof body.rcdbId === "string" && body.rcdbId.trim()
        ? Number(body.rcdbId)
        : undefined;
  const id = overrideId ?? park.externalIds?.rcdbId;
  if (!id || !Number.isFinite(id)) {
    return NextResponse.json(
      { error: "no RCDB id — set externalIds.rcdbId on the park or pass {rcdbId} in the body" },
      { status: 400 },
    );
  }

  try {
    const details = await lookupRcdbPark(id);
    return NextResponse.json({ rcdbId: id, details });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
