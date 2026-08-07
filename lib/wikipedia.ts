/**
 * Wikipedia helpers — powers both the venue-research feature (short
 * summary lookup by URL or name) and the artist-enrichment pass (longer
 * extract lookup for richer bio content).
 *
 * All endpoints are anonymous; the User-Agent identifies the project per
 * Wikipedia's REST guidelines. Rate limits are generous but we pace
 * conservatively during batch runs.
 */

const REST_BASE = "https://en.wikipedia.org/api/rest_v1";
const ACTION_API = "https://en.wikipedia.org/w/api.php";
export const WIKI_USER_AGENT =
  "TedCromwellCom/1.0 (+https://www.tedcromwell.com - personal-site enrichment)";

// ─── Legacy short-summary helpers (used by venue research) ───────────────

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
  type?: string;
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

/** Public alias — exposed for scripts that need URL→title parsing. */
export function wikipediaTitleFromUrl(url: string): string | null {
  return titleFromWikipediaUrl(url);
}

async function fetchSummary(title: string): Promise<WikipediaLookup | null> {
  const sumUrl = `${REST_BASE}/page/summary/${encodeURIComponent(title)}`;
  const res = await fetch(sumUrl, {
    headers: { "User-Agent": WIKI_USER_AGENT, Accept: "application/json" },
  });
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
  const searchRes = await fetch(searchUrl, {
    headers: { "User-Agent": WIKI_USER_AGENT, Accept: "application/json" },
  });
  if (!searchRes.ok) return null;
  const search = (await searchRes.json()) as SearchResponse;
  const page = search.pages?.[0];
  if (!page) return null;
  return fetchSummary(page.key);
}

// ─── Long-extract helpers (used by artist enrichment) ─────────────────────

export interface WikipediaSummary {
  title: string;
  extract: string;
  url: string;
  description?: string;
  thumbnailUrl?: string;
  type?: "standard" | "disambiguation" | "no-extract";
}

/**
 * Fetch the /page/summary/{title} response, normalized. Returns null on 404
 * or a non-standard response (disambiguation page, empty extract).
 */
export async function fetchWikipediaSummary(title: string): Promise<WikipediaSummary | null> {
  const url = `${REST_BASE}/page/summary/${encodeURIComponent(title)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": WIKI_USER_AGENT, Accept: "application/json" },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`wikipedia summary ${res.status} for ${title}`);
  const j = (await res.json()) as SummaryResponse;
  const extract = (j.extract ?? "").trim();
  const returnedTitle = j.title ?? title;
  const articleUrl =
    j.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(returnedTitle)}`;
  if (!extract) {
    return {
      title: returnedTitle,
      extract: "",
      url: articleUrl,
      description: j.description,
      type: "no-extract",
    };
  }
  return {
    title: returnedTitle,
    extract,
    url: articleUrl,
    description: j.description,
    thumbnailUrl: j.thumbnail?.source,
    type: (j.type as WikipediaSummary["type"]) ?? "standard",
  };
}

interface SearchHit {
  title: string;
  snippet: string;
}

/**
 * Search Wikipedia for pages matching `query`. Used as a fallback when
 * we can't resolve an article title via MusicBrainz or exact-title lookup.
 */
export async function searchWikipedia(query: string, limit = 5): Promise<SearchHit[]> {
  const u = new URL(ACTION_API);
  u.searchParams.set("action", "query");
  u.searchParams.set("list", "search");
  u.searchParams.set("srsearch", query);
  u.searchParams.set("srlimit", String(limit));
  u.searchParams.set("format", "json");
  u.searchParams.set("origin", "*");
  const res = await fetch(u.toString(), {
    headers: { "User-Agent": WIKI_USER_AGENT, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`wikipedia search ${res.status}`);
  const j = (await res.json()) as {
    query?: { search?: { title: string; snippet: string }[] };
  };
  return j.query?.search ?? [];
}

/**
 * Fetch a plain-text extract of the given article using the MediaWiki action
 * API. Returns 1500 chars by default (~10 sentences) — enough to serve as
 * real body content on an artist page. Returns null when the title doesn't
 * resolve, or a flagged result when the target is a disambiguation page so
 * callers can retry with a different title.
 */
export async function fetchWikipediaExtract(
  title: string,
  opts: { chars?: number } = {},
): Promise<{ title: string; extract: string; url: string; isDisambiguation: boolean } | null> {
  const u = new URL(ACTION_API);
  u.searchParams.set("action", "query");
  u.searchParams.set("prop", "extracts|pageprops|info");
  u.searchParams.set("titles", title);
  u.searchParams.set("explaintext", "1");
  u.searchParams.set("exchars", String(opts.chars ?? 1500));
  u.searchParams.set("exsectionformat", "plain");
  u.searchParams.set("redirects", "1");
  u.searchParams.set("inprop", "url");
  u.searchParams.set("format", "json");
  u.searchParams.set("origin", "*");
  const res = await fetch(u.toString(), {
    headers: { "User-Agent": WIKI_USER_AGENT, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`wikipedia extract ${res.status} for ${title}`);
  const j = (await res.json()) as {
    query?: {
      pages?: Record<
        string,
        {
          pageid?: number;
          title?: string;
          extract?: string;
          fullurl?: string;
          pageprops?: { disambiguation?: string };
          missing?: string;
        }
      >;
    };
  };
  const pages = j.query?.pages ?? {};
  const first = Object.values(pages)[0];
  if (!first || first.missing !== undefined || !first.pageid) return null;
  const extract = (first.extract ?? "").trim();
  if (!extract) return null;
  return {
    title: first.title ?? title,
    extract,
    url:
      first.fullurl ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(first.title ?? title)}`,
    isDisambiguation: first.pageprops?.disambiguation !== undefined,
  };
}
