/**
 * Parse an Instagram post URL into a "kind/shortcode" path used by the embed.
 * Accepts these URL forms:
 *   https://www.instagram.com/p/<shortcode>/
 *   https://www.instagram.com/reel/<shortcode>/
 *   https://www.instagram.com/reels/<shortcode>/
 *   https://www.instagram.com/tv/<shortcode>/
 * Returns "p/<shortcode>" / "reel/<shortcode>" / "tv/<shortcode>" or null.
 */
export function instagramPath(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const u = new URL(trimmed);
    const host = u.hostname.replace(/^www\./, "");
    if (host !== "instagram.com" && host !== "instagr.am") return null;
    const m = u.pathname.match(/^\/(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
    if (!m) return null;
    const kind = m[1] === "reels" ? "reel" : m[1];
    return `${kind}/${m[2]}`;
  } catch {
    return null;
  }
}

export function instagramPermalink(path: string): string {
  return `https://www.instagram.com/${path}/`;
}
