import { NextResponse } from "next/server";
import { findConcertBySlugOrId } from "@/lib/concerts";
import { findRecordBySlugOrId } from "@/lib/records";
import { findTravelEntryBySlugOrId } from "@/lib/travel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Internal target of middleware.ts rewrites. Middleware detects raw-id URLs
 * like /vinyl/4760354 and rewrites the request here. This route looks up
 * the slug in Cosmos and returns a real HTTP 308 to the pretty URL, which
 * the client sees exactly as if the id URL had returned 308 directly.
 *
 * This is a workaround for two Next.js+Azure-SWA limitations we hit while
 * trying to canonicalize id → slug URLs for GSC:
 *   1) redirect() inside a page or generateMetadata gets embedded in the
 *      streaming response instead of setting HTTP status.
 *   2) Middleware on SWA cannot fetch same-origin URLs (fetch fails).
 * NextResponse.rewrite from middleware IS internal (no network call) and
 * NextResponse.redirect from a route handler DOES emit real HTTP status.
 */
export async function GET(req: Request) {
  // Middleware passes these via request headers because req.url reflects
  // the ORIGINAL client URL (e.g. /vinyl/4760354), not the rewritten path.
  const type = req.headers.get("x-id-redirect-type");
  const id = req.headers.get("x-id-redirect-id");
  if (!id || !type) return new Response("bad request", { status: 400 });

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
    } else {
      return new Response("bad type", { status: 400 });
    }
    if (!slug) return new Response("no slug", { status: 404 });
    const dest = new URL(`/${type === "concert" ? "concerts" : type === "vinyl" ? "vinyl" : "travel"}/${slug}`, req.url);
    return NextResponse.redirect(dest, 308);
  } catch (err) {
    return new Response(`error: ${(err as Error).message}`, { status: 500 });
  }
}
