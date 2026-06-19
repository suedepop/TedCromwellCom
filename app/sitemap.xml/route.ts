import { listPosts } from "@/lib/blog";
import { listConcerts } from "@/lib/concerts";
import { listVenues } from "@/lib/venues";
import { listTravelEntries } from "@/lib/travel";
import { listRecords } from "@/lib/records";
import { listStoredArtistSlugs } from "@/lib/artists";
import { listParks } from "@/lib/parks";
import { listCoasters } from "@/lib/coasters";
import { siteUrl } from "@/lib/metadata";

export const runtime = "nodejs";
// Render at request time — at build time the Cosmos env vars aren't available,
// so all dynamic entries would silently fall back to empty arrays.
export const dynamic = "force-dynamic";

interface Entry {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function render(entries: Entry[]): string {
  const items = entries
    .map((e) => {
      const parts = [`  <loc>${escape(e.loc)}</loc>`];
      if (e.lastmod) parts.push(`  <lastmod>${e.lastmod}</lastmod>`);
      if (e.changefreq) parts.push(`  <changefreq>${e.changefreq}</changefreq>`);
      if (e.priority !== undefined) parts.push(`  <priority>${e.priority}</priority>`);
      return `<url>\n${parts.join("\n")}\n</url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}

export async function GET() {
  const [posts, concerts, venues, travel, records, artists, parks, coasters] = await Promise.all([
    listPosts("published").catch(() => []),
    listConcerts().catch(() => []),
    listVenues().catch(() => []),
    listTravelEntries().catch(() => []),
    listRecords().catch(() => []),
    listStoredArtistSlugs().catch(() => []),
    listParks().catch(() => []),
    listCoasters().catch(() => []),
  ]);

  const now = new Date().toISOString();

  const entries: Entry[] = [
    { loc: siteUrl("/"), lastmod: now, changefreq: "daily", priority: 1.0 },
    { loc: siteUrl("/blog"), lastmod: now, changefreq: "weekly", priority: 0.8 },
    { loc: siteUrl("/concerts"), lastmod: now, changefreq: "monthly", priority: 0.8 },
    { loc: siteUrl("/venues"), lastmod: now, changefreq: "monthly", priority: 0.7 },
    { loc: siteUrl("/travel"), lastmod: now, changefreq: "weekly", priority: 0.8 },
    { loc: siteUrl("/vinyl"), lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: siteUrl("/artists"), lastmod: now, changefreq: "weekly", priority: 0.5 },
    { loc: siteUrl("/coasters"), lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: siteUrl("/parks"), lastmod: now, changefreq: "weekly", priority: 0.6 },
    { loc: siteUrl("/resume"), lastmod: now, changefreq: "monthly", priority: 0.6 },
    { loc: siteUrl("/search"), lastmod: now, changefreq: "monthly", priority: 0.3 },
    { loc: siteUrl("/experiments"), lastmod: now, changefreq: "monthly", priority: 0.4 },
    { loc: siteUrl("/experiments/dashboard"), lastmod: now, changefreq: "daily", priority: 0.4 },
    { loc: siteUrl("/privacy"), lastmod: now, changefreq: "yearly", priority: 0.2 },
  ];

  for (const p of posts) {
    entries.push({
      loc: siteUrl(`/blog/${p.slug}`),
      lastmod: p.updatedAt ?? p.publishedAt ?? now,
      changefreq: "monthly",
      priority: 0.7,
    });
  }
  for (const c of concerts) {
    entries.push({
      loc: siteUrl(`/concerts/${c.slug ?? c.id}`),
      lastmod: c.updatedAt ?? c.date ?? now,
      changefreq: "yearly",
      priority: 0.6,
    });
  }
  for (const v of venues) {
    entries.push({
      loc: siteUrl(`/venues/${v.id}`),
      lastmod: now,
      changefreq: "yearly",
      priority: 0.5,
    });
  }
  for (const t of travel) {
    entries.push({
      loc: siteUrl(`/travel/${t.slug ?? t.id}`),
      lastmod: t.updatedAt ?? t.startDate ?? now,
      changefreq: "monthly",
      priority: 0.6,
    });
  }
  for (const r of records) {
    entries.push({
      loc: siteUrl(`/vinyl/${r.slug ?? r.id}`),
      lastmod: r.updatedAt ?? now,
      changefreq: "monthly",
      priority: 0.5,
    });
  }
  for (const a of artists) {
    entries.push({
      loc: siteUrl(`/artists/${a.slug}`),
      lastmod: a.updatedAt ?? now,
      changefreq: "monthly",
      priority: 0.4,
    });
  }
  for (const p of parks) {
    entries.push({
      loc: siteUrl(`/parks/${p.slug}`),
      lastmod: p.updatedAt ?? now,
      changefreq: "monthly",
      priority: 0.5,
    });
  }
  for (const c of coasters) {
    entries.push({
      loc: siteUrl(`/coasters/${c.slug}`),
      lastmod: c.updatedAt ?? now,
      changefreq: "monthly",
      priority: 0.5,
    });
  }

  return new Response(render(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
