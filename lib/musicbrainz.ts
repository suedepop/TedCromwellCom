/**
 * MusicBrainz Web Service v2 helpers.
 * Anonymous endpoints; rate-limited to ~1 request/second by their docs.
 *
 * NOTE: HTTP header values must be ASCII — keep MB_USER_AGENT free of
 * non-ASCII characters (em-dashes, smart quotes, etc.).
 */

export const MB_BASE = "https://musicbrainz.org/ws/2/artist/";
export const MB_RG_BASE = "https://musicbrainz.org/ws/2/release-group";
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

export interface MbArtistRel {
  type: string;                              // e.g. "member of band"
  direction: "forward" | "backward";
  begin?: string | null;                     // "1985", "1985-04", "1985-04-08"
  end?: string | null;
  attributes?: string[];                     // ["lead vocals", "guitar"]
  artist?: {
    id: string;
    name: string;
    type?: string | null;
    disambiguation?: string;
  };
}

export interface MbArtistFull extends MbArtistDetail {
  relations?: (MbArtistRel & { url?: { resource: string } })[];
}

/**
 * Fetch an artist with BOTH URL relationships (for the Wikipedia lookup)
 * and artist relationships (for members / groups). One request replaces
 * the previous fetchArtistWithUrls when we want everything.
 */
export async function fetchArtistFull(mbid: string): Promise<MbArtistFull | null> {
  const url = `${MB_BASE}${mbid}?inc=url-rels+artist-rels&fmt=json`;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, {
      headers: { "User-Agent": MB_USER_AGENT, Accept: "application/json" },
    });
    if (res.status === 404) return null;
    if (res.ok) {
      return (await res.json()) as MbArtistFull;
    }
    if (res.status === 503 || res.status === 429) {
      await sleep(2000 * (attempt + 1));
      continue;
    }
    throw new Error(`musicbrainz ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  throw new Error("musicbrainz: too many retries");
}

/**
 * Filter "member of band" relations from an MB artist's relations list.
 * Returns { members, partOf } — members are the OTHER artists when the
 * queried artist is a group; partOf are the bands when the queried
 * artist is a person. We compute both from the direction field so the
 * caller doesn't have to think about it.
 */
export function membershipRelations(artist: MbArtistFull): {
  members: MbArtistRel[];
  partOf: MbArtistRel[];
} {
  const rels = (artist.relations ?? []).filter(
    (r): r is MbArtistRel => r.type === "member of band" && !!r.artist,
  );
  const members: MbArtistRel[] = [];
  const partOf: MbArtistRel[] = [];
  for (const r of rels) {
    // In MB: "X is a member of Y". The forward direction on X (person)
    // points to Y (band). When we query a person, forward = groups they
    // belong to. When we query a group, backward = the persons who are
    // members.
    if (r.direction === "backward") members.push(r);
    else partOf.push(r);
  }
  return { members, partOf };
}

export interface MbReleaseGroup {
  id: string;                           // release-group MBID
  title: string;
  "primary-type"?: string | null;       // "Album" | "EP" | "Single" | ...
  "secondary-types"?: string[];         // e.g. ["Compilation"], ["Live"], ["Soundtrack"]
  "first-release-date"?: string;        // "1985-04-08" or "1985" or "" — MB is lenient
  disambiguation?: string;
}

interface MbReleaseGroupPage {
  "release-group-count"?: number;
  "release-groups"?: MbReleaseGroup[];
}

/**
 * Fetch every release-group for an artist. Paginates in 100-item batches
 * (MB's max) so artists with hundreds of releases (Elvis, The Beatles,
 * various-artists MBIDs) come back complete. Filters out MB's placeholder
 * "album; compilation" pairs are kept — they're distinct release-groups
 * even when they collide on title.
 *
 * Rate limit: caller must space calls at ≥1s. This function retries on
 * 503/429 with backoff but does NOT throttle between pagination pages;
 * the caller should insert a delay between artists.
 */
export async function fetchArtistReleaseGroups(mbid: string): Promise<MbReleaseGroup[]> {
  const out: MbReleaseGroup[] = [];
  let offset = 0;
  const limit = 100;
  while (true) {
    // MB's release-group /type filter accepts only PRIMARY types (Album,
    // EP, Single, Broadcast, Other) — not secondary types like Live,
    // Compilation, Soundtrack. Mixing them, or passing unknown values,
    // silently returns 0 results. Live/Compilation/Soundtrack are
    // distinguished per-item via the "secondary-types" field in each
    // release-group's response and classified downstream.
    // Also: the pipe must be URL-encoded as %7C.
    const typeFilter = encodeURIComponent("album|ep|single|broadcast|other");
    const url = `${MB_RG_BASE}?artist=${mbid}&type=${typeFilter}&limit=${limit}&offset=${offset}&fmt=json`;
    let page: MbReleaseGroupPage | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const res = await fetch(url, {
        headers: { "User-Agent": MB_USER_AGENT, Accept: "application/json" },
      });
      if (res.status === 404) return out;
      if (res.ok) {
        page = (await res.json()) as MbReleaseGroupPage;
        break;
      }
      if (res.status === 503 || res.status === 429) {
        await sleep(2000 * (attempt + 1));
        continue;
      }
      throw new Error(`musicbrainz rg ${res.status}: ${(await res.text()).slice(0, 200)}`);
    }
    if (!page) throw new Error("musicbrainz rg: too many retries");
    const rgs = page["release-groups"] ?? [];
    out.push(...rgs);
    const total = page["release-group-count"] ?? out.length;
    offset += rgs.length;
    // Stop when we've exhausted the total OR MB returned an empty page.
    if (offset >= total || rgs.length === 0) break;
    // Space paginated calls at 1.1s to stay under MB's anonymous limit.
    await sleep(1100);
  }
  return out;
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
