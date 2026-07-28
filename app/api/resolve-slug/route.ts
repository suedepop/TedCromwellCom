import { NextResponse } from "next/server";
import { findConcertBySlugOrId } from "@/lib/concerts";
import { findRecordBySlugOrId } from "@/lib/records";
import { findTravelEntryBySlugOrId } from "@/lib/travel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Internal endpoint used by middleware.ts to answer "does this raw-id URL
 * segment have a pretty slug I should 308 to?" without middleware needing
 * direct Cosmos access. Called only for id-shaped URL segments (numeric or
 * UUID) so slug URLs never hit this.
 *
 * Returns 200 with { slug } if a slug exists for that id, or 204 if no
 * redirect is needed (id has no slug, or id and slug already match, or
 * the record doesn't exist). Middleware treats anything other than a
 * 200+slug as "pass through unchanged".
 */
export async function GET(req: Request) {
  const u = new URL(req.url);
  const type = u.searchParams.get("type");
  const id = u.searchParams.get("id");
  if (!id || !type) return new Response(null, { status: 204 });

  try {
    let slug: string | undefined;
    if (type === "concert") {
      const c = await findConcertBySlugOrId(id);
      slug = c?.slug;
      if (slug === id) slug = undefined;
    } else if (type === "vinyl") {
      const r = await findRecordBySlugOrId(id);
      slug = r?.slug;
      if (slug === id) slug = undefined;
    } else if (type === "travel") {
      const t = await findTravelEntryBySlugOrId(id);
      slug = t?.slug;
      if (slug === id) slug = undefined;
    } else {
      return new Response(null, { status: 204 });
    }
    if (!slug) return new Response(null, { status: 204 });
    return NextResponse.json(
      { slug },
      {
        headers: {
          // Slug for an id doesn't change often; short edge cache is fine.
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    return new Response(null, { status: 204 });
  }
}
