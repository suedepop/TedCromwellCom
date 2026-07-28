import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware: canonicalize raw-id URLs to their pretty slug URLs with HTTP 308.
 *
 * Why here instead of in the page: Next.js redirects from within a page or
 * generateMetadata run during a streaming response, so Next embeds them as
 * client-side navigation instructions ($RX("NEXT_REDIRECT;...;308")) and the
 * initial response stays HTTP 200. Googlebot doesn't run that JS and keeps
 * indexing both URLs — the exact "Duplicate without user-selected canonical"
 * symptom in Search Console. Middleware runs BEFORE any render, so a
 * NextResponse.redirect() here emits a real 308 with a Location header.
 *
 * Pattern-match FIRST so slug URLs never hit the resolve endpoint. Only
 * URL shapes that look like a raw id are checked:
 *   - concerts / travel: UUID (36 chars, 4 dashes at fixed positions)
 *   - vinyl: all-digits (Discogs release id)
 */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DIGITS_RE = /^\d+$/;

interface RouteRule {
  prefix: string;
  isIdShape: (segment: string) => boolean;
  type: "concert" | "vinyl" | "travel";
}
const RULES: RouteRule[] = [
  { prefix: "/concerts/", isIdShape: (s) => UUID_RE.test(s), type: "concert" },
  { prefix: "/vinyl/", isIdShape: (s) => DIGITS_RE.test(s), type: "vinyl" },
  { prefix: "/travel/", isIdShape: (s) => UUID_RE.test(s), type: "travel" },
];

export async function middleware(req: NextRequest) {
  const { pathname, search, origin } = req.nextUrl;
  const rule = RULES.find((r) => pathname.startsWith(r.prefix));
  if (!rule) {
    const passthrough = NextResponse.next();
    passthrough.headers.set("x-mw", `nomatch:${pathname}`);
    return passthrough;
  }
  // "/concerts/abc" → "abc"; also handles "/concerts/abc/anything" → don't touch nested paths
  const rest = pathname.slice(rule.prefix.length);
  if (rest.includes("/") || !rest) {
    const p = NextResponse.next();
    p.headers.set("x-mw", `nested-or-empty:${rest}`);
    return p;
  }
  if (!rule.isIdShape(rest)) {
    const p = NextResponse.next();
    p.headers.set("x-mw", `notidshape:${rest}`);
    return p;
  }

  try {
    const res = await fetch(
      `${origin}/api/resolve-slug?type=${rule.type}&id=${encodeURIComponent(rest)}`,
      { headers: { "user-agent": "middleware-slug-resolver" } },
    );
    if (!res.ok || res.status === 204) {
      const p = NextResponse.next();
      p.headers.set("x-mw", `resolve-${res.status}:${rest}`);
      return p;
    }
    const data = (await res.json()) as { slug?: string };
    if (!data.slug) {
      const p = NextResponse.next();
      p.headers.set("x-mw", `no-slug:${rest}`);
      return p;
    }
    const dest = new URL(`${rule.prefix}${data.slug}${search}`, req.url);
    const r = NextResponse.redirect(dest, 308);
    r.headers.set("x-mw", `redirect:${rest}->${data.slug}`);
    return r;
  } catch (err) {
    const p = NextResponse.next();
    p.headers.set("x-mw", `error:${(err as Error).message}`);
    return p;
  }
}

export const config = {
  // Only run for the three detail-page prefixes; skip everything else so
  // the middleware overhead is zero for static assets, _next chunks, admin,
  // API routes, and slug URLs.
  matcher: ["/concerts/:path*", "/vinyl/:path*", "/travel/:path*"],
};
