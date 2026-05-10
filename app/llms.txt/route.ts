import { listPosts } from "@/lib/blog";
import { listConcerts } from "@/lib/concerts";
import { listVenues } from "@/lib/venues";
import { listTravelEntries } from "@/lib/travel";
import { getResume } from "@/lib/resume";
import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from "@/lib/metadata";

export const runtime = "nodejs";
// Render at request time — at build time the Cosmos env vars aren't available,
// so all dynamic sections would silently fall back to empty arrays.
export const dynamic = "force-dynamic";
export const revalidate = 600;

function abs(path: string): string {
  return siteUrl(path);
}

export async function GET() {
  const [posts, concerts, venues, travel, resume] = await Promise.all([
    listPosts("published").catch(() => []),
    listConcerts().catch(() => []),
    listVenues().catch(() => []),
    listTravelEntries().catch(() => []),
    getResume().catch(() => null),
  ]);

  const lines: string[] = [];
  lines.push(`# ${SITE_NAME}`);
  lines.push("");
  lines.push(`> ${SITE_DESCRIPTION}`);
  lines.push("");
  if (resume) {
    lines.push(`Author: ${resume.name}${resume.tagline ? ` — ${resume.tagline}` : ""}`);
    if (resume.location) lines.push(`Location: ${resume.location}`);
    if (resume.email) lines.push(`Contact: ${resume.email}`);
    lines.push("");
  }

  lines.push(`## Sections`);
  lines.push(`- [Home](${abs("/")}): mixed feed of recent posts, concerts, and travel`);
  lines.push(`- [Blog](${abs("/blog")}): essays and notes`);
  lines.push(`- [Concerts](${abs("/concerts")}): every concert attended, with setlists, photos, and notes`);
  lines.push(`- [Venues](${abs("/venues")}): venues where I've seen live music, mapped`);
  lines.push(`- [Travel](${abs("/travel")}): travel blog with locations on a world map`);
  lines.push(`- [Resume](${abs("/resume")}): work history and skills`);
  lines.push(`- [Search](${abs("/search")}): full-text search across all content`);
  lines.push(`- [RSS](${abs("/feed.xml")}): combined feed of recent items`);
  lines.push(`- [Sitemap](${abs("/sitemap.xml")}): full URL list`);
  lines.push("");

  if (posts.length > 0) {
    lines.push(`## Blog Posts`);
    for (const p of posts.slice(0, 50)) {
      const date = (p.publishedAt ?? p.updatedAt).slice(0, 10);
      lines.push(`- [${p.title}](${abs(`/blog/${p.slug}`)}) — ${date}: ${p.excerpt}`);
    }
    lines.push("");
  }

  if (travel.length > 0) {
    lines.push(`## Travel`);
    for (const t of travel.slice(0, 50)) {
      const where = [t.city, t.state, t.country].filter(Boolean).join(", ");
      lines.push(`- [${t.locationName}](${abs(`/travel/${t.slug ?? t.id}`)}) — ${t.startDate}, ${where}`);
    }
    lines.push("");
  }

  if (concerts.length > 0) {
    lines.push(`## Concerts (most recent)`);
    for (const c of concerts.slice(0, 100)) {
      const bands = c.setlists.map((s) => s.artist).filter(Boolean).join(", ");
      const title = c.eventName ? `${c.eventName} — ${bands}` : bands || c.venueNameRaw;
      lines.push(`- [${title}](${abs(`/concerts/${c.slug ?? c.id}`)}) — ${c.date}, ${c.venueNameRaw}, ${c.city}`);
    }
    lines.push("");
  }

  if (venues.length > 0) {
    lines.push(`## Venues`);
    for (const v of venues.slice(0, 100)) {
      const where = [v.city, v.state, v.country].filter(Boolean).join(", ");
      lines.push(`- [${v.canonicalName}](${abs(`/venues/${v.id}`)}) — ${where}`);
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
    },
  });
}
