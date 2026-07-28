import { NextResponse } from "next/server";
import { findConcertBySlugOrId } from "@/lib/concerts";
import { findRecordBySlugOrId } from "@/lib/records";
import { findTravelEntryBySlugOrId } from "@/lib/travel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Internal target of middleware.ts rewrites. Given a request rewritten to
 * /api/id-redirect/{type}/{id}, look up the record and 308-redirect to
 * /{urlSection}/{slug}. The client sees exactly one HTTP transaction:
 *   client → /vinyl/4760354 → 308 → /vinyl/2013-weezer-weezer
 *
 * Type + id are passed as URL path segments (not query string, not
 * request headers) because those are the only middleware→handler channel
 * that reliably survives Azure SWA's proxy layer.
 */
const URL_SECTION: Record<string, string> = {
  concert: "concerts",
  vinyl: "vinyl",
  travel: "travel",
};

export async function GET(
  req: Request,
  { params }: { params: { type: string; id: string } },
) {
  const { type, id } = params;
  const section = URL_SECTION[type];
  if (!section) return new Response(`bad type: ${type}`, { status: 400 });
  if (!id) return new Response("missing id", { status: 400 });

  try {
    let slug: string | undefined;
    if (type === "concert") {
      const c = await findConcertBySlugOrId(id);
      if (c && c.slug && c.slug !== id) slug = c.slug;
    } else if (type === "vinyl") {
      const r = await findRecordBySlugOrId(id);
      if (r && r.slug && r.slug !== id) slug = r.slug;
    } else if (type === "travel") {
      const t = await findTravelEntryBySlugOrId(id);
      if (t && t.slug && t.slug !== id) slug = t.slug;
    }
    if (!slug) return new Response("no slug", { status: 404 });
    const dest = new URL(`/${section}/${slug}`, req.url);
    return NextResponse.redirect(dest, 308);
  } catch (err) {
    return new Response(`error: ${(err as Error).message}`, { status: 500 });
  }
}
