import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware: rewrite raw-id URLs to an internal Node.js route that emits
 * a real HTTP 308 to the pretty slug URL.
 *
 * Why this shape (attempt 4, previous attempts documented in git history):
 * - redirect() from a page or generateMetadata gets embedded in the
 *   streaming response instead of setting HTTP status (client-side only).
 * - Middleware on Azure SWA can't fetch same-origin URLs (fetch failed).
 * - NextResponse.rewrite is INTERNAL routing, no network call — so it
 *   works on SWA — and the target route handler CAN issue a real 308
 *   because route handlers don't stream.
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

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const rule = RULES.find((r) => pathname.startsWith(r.prefix));
  if (!rule) return NextResponse.next();
  const rest = pathname.slice(rule.prefix.length);
  if (!rest || rest.includes("/")) return NextResponse.next();
  if (!rule.isIdShape(rest)) return NextResponse.next();

  // Rewrite is internal (no fetch), and the target route.ts returns a
  // real 308 that flows back to the client as if it came from this URL.
  // Pass type + id as URL PATH SEGMENTS: query string and request headers
  // don't reliably survive Azure SWA's proxy layer between middleware and
  // the target route handler, but path segments (via dynamic route params)
  // always do.
  const rewriteUrl = new URL(
    `/api/id-redirect/${rule.type}/${encodeURIComponent(rest)}`,
    req.url,
  );
  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: ["/concerts/:path*", "/vinyl/:path*", "/travel/:path*"],
};
