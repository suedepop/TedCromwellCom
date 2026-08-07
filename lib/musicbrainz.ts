/**
 * MusicBrainz Web Service v2 helpers.
 * Anonymous endpoints; rate-limited to ~1 request/second by their docs.
 *
 * NOTE: HTTP header values must be ASCII — keep MB_USER_AGENT free of
 * non-ASCII characters (em-dashes, smart quotes, etc.).
 */

export const MB_BASE = "https://musicbrainz.org/ws/2/artist/";
export const MB_USER_AGENT =
  "TedCromwellCom/1.0 (+https://www.tedcromwell.com - personal-site artist alignment)";

export interface MbArtist {
  id: string;
  name: string;
  score: number;
  type?: string;
  country?: string;
  disambiguation?: string;
  aliases?: { name: string }[];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface MbArtistDetail {
  id: string;
  name: string;
  type?: string;
  country?: string;
  disambiguation?: string;
  relations?: { type: string; url?: { resource: string } }[];
}

/**
 * Fetch a specific artist by MBID with URL relationships included. Used to
 * resolve the canonical Wikipedia article for an artist (higher signal than
 * a name-only search, which is ambiguous for common names).
 */
export async function fetchArtistWithUrls(mbid: string): Promise<MbArtistDetail | null> {
  const url = `${MB_BASE}${mbid}?inc=url-rels&fmt=json`;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, {
      headers: { "User-Agent": MB_USER_AGENT, Accept: "application/json" },
    });
    if (res.status === 404) return null;
    if (res.ok) {
      return (await res.json()) as MbArtistDetail;
    }
    if (res.status === 503 || res.status === 429) {
      await sleep(2000 * (attempt + 1));
      continue;
    }
    throw new Error(`musicbrainz ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  throw new Error("musicbrainz: too many retries");
}

/** Extract the Wikipedia URL from a MusicBrainz artist's URL relationships,
 *  preferring the English article when multiple languages are present. */
export function wikipediaUrlFromMbArtist(artist: MbArtistDetail): string | null {
  const rels = artist.relations ?? [];
  const wikiRels = rels
    .filter((r) => r.type === "wikipedia" && r.url?.resource)
    .map((r) => r.url!.resource);
  if (wikiRels.length === 0) return null;
  return wikiRels.find((u) => /^https?:\/\/en\.wikipedia\.org\//i.test(u)) ?? wikiRels[0];
}

export async function searchArtists(name: string, limit = 10): Promise<MbArtist[]> {
  const q = `artist:"${name.replace(/"/g, "")}"`;
  const url = `${MB_BASE}?query=${encodeURIComponent(q)}&fmt=json&limit=${limit}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, {
      headers: { "User-Agent": MB_USER_AGENT, Accept: "application/json" },
    });
    if (res.ok) {
      const data = (await res.json()) as { artists?: MbArtist[] };
      return data.artists ?? [];
    }
    if (res.status === 503 || res.status === 429) {
      await sleep(2000 * (attempt + 1));
      continue;
    }
    throw new Error(`musicbrainz ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  throw new Error("musicbrainz: too many retries");
}
