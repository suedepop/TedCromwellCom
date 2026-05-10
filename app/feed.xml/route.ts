import { listFeedAll } from "@/lib/feed";
import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from "@/lib/metadata";

export const runtime = "nodejs";
export const revalidate = 600;

function escape(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822(d: string | undefined): string {
  if (!d) return new Date().toUTCString();
  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) return new Date().toUTCString();
  return parsed.toUTCString();
}

export async function GET() {
  const items = (
    await listFeedAll({ types: ["blog", "concert", "travel", "vinyl", "venue"] }).catch(() => [])
  ).slice(0, 50);
  const channelLink = siteUrl();
  const feedLink = siteUrl("/feed.xml");

  const itemsXml = items
    .map((item) => {
      let title = "";
      let path = "";
      let description = "";
      const pub = rfc822(item.sortDate);
      let categories: string[] = [];
      switch (item.type) {
        case "blog": {
          const p = item.data;
          title = p.title;
          path = `/blog/${p.slug}`;
          description = p.excerpt ?? "";
          categories = ["Blog", ...(p.tags ?? [])];
          break;
        }
        case "concert": {
          const c = item.data;
          const bands = c.setlists.map((s) => s.artist).filter(Boolean).join(" · ");
          title = c.eventName ? `${c.eventName} — ${bands}` : bands || c.venueNameRaw;
          path = `/concerts/${c.slug ?? c.id}`;
          description = `${c.date} · ${c.venueNameRaw} · ${c.city}, ${c.country}`;
          categories = ["Concert"];
          break;
        }
        case "travel": {
          const t = item.data;
          title = t.locationName;
          path = `/travel/${t.slug ?? t.id}`;
          description =
            (t.content ?? "")
              .replace(/[#>*_`\[\]\(\)!]/g, "")
              .replace(/\s+/g, " ")
              .trim()
              .slice(0, 240) || `${t.startDate}`;
          categories = ["Travel"];
          break;
        }
        case "vinyl": {
          const r = item.data;
          const artists = r.artists.map((a) => a.name).join(" · ");
          title = `${artists} — ${r.title}`;
          path = `/vinyl/${r.slug ?? r.id}`;
          description =
            (r.writeUp ?? "")
              .replace(/[#>*_`\[\]\(\)!]/g, "")
              .replace(/\s+/g, " ")
              .trim()
              .slice(0, 240) ||
            `${r.year ?? ""} · ${r.primaryFormat}`.trim();
          categories = ["Vinyl", ...(r.genres ?? []).slice(0, 3)];
          break;
        }
        case "venue": {
          const v = item.data;
          title = v.canonicalName;
          path = `/venues/${v.id}`;
          const where = [v.city, v.state, v.country].filter(Boolean).join(", ");
          description = (v.description ?? where).slice(0, 240);
          categories = ["Venue"];
          break;
        }
      }
      const link = siteUrl(path);
      const cats = categories.map((c) => `<category>${escape(c)}</category>`).join("");
      return `<item>
  <title>${escape(title)}</title>
  <link>${escape(link)}</link>
  <guid isPermaLink="true">${escape(link)}</guid>
  <pubDate>${pub}</pubDate>
  <description>${escape(description)}</description>
  ${cats}
</item>`;
    })
    .join("\n");

  const now = new Date().toUTCString();
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(SITE_NAME)}</title>
    <link>${escape(channelLink)}</link>
    <atom:link href="${escape(feedLink)}" rel="self" type="application/rss+xml" />
    <description>${escape(SITE_DESCRIPTION)}</description>
    <language>en-US</language>
    <lastBuildDate>${now}</lastBuildDate>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
    },
  });
}
