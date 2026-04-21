export interface WikipediaLookup {
  title: string;
  description?: string;
  extract: string;
  url: string;
  thumbnailUrl?: string;
}

interface SearchResponse {
  pages?: { key: string; title: string; excerpt?: string; description?: string }[];
}

interface SummaryResponse {
  title: string;
  description?: string;
  extract?: string;
  content_urls?: { desktop?: { page?: string } };
  thumbnail?: { source?: string };
}

function titleFromWikipediaUrl(raw: string): string | null {
  try {
    const u = new URL(raw.trim());
    if (!/wikipedia\.org$/i.test(u.hostname.replace(/^[a-z]+\./, "wikipedia.org"))) return null;
    const m = u.pathname.match(/^\/wiki\/(.+)$/);
    if (!m) return null;
    return decodeURIComponent(m[1]);
  } catch {
    return null;
  }
}

async function fetchSummary(title: string): Promise<WikipediaLookup | null> {
  const sumUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const res = await fetch(sumUrl, { headers: { Accept: "application/json" } });
  if (!res.ok) return null;
  const sum = (await res.json()) as SummaryResponse;
  const extract = (sum.extract ?? "").trim();
  if (!extract) return null;
  return {
    title: sum.title,
    description: sum.description,
    extract,
    url: sum.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
    thumbnailUrl: sum.thumbnail?.source,
  };
}

export async function lookupByWikipediaUrl(url: string): Promise<WikipediaLookup | null> {
  const title = titleFromWikipediaUrl(url);
  if (!title) return null;
  return fetchSummary(title);
}

export async function lookupVenue(query: string): Promise<WikipediaLookup | null> {
  const searchUrl = `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(query)}&limit=1`;
  const searchRes = await fetch(searchUrl, { headers: { Accept: "application/json" } });
  if (!searchRes.ok) return null;
  const search = (await searchRes.json()) as SearchResponse;
  const page = search.pages?.[0];
  if (!page) return null;
  return fetchSummary(page.key);
}
