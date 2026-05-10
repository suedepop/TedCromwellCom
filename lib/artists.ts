import { containers } from "./cosmos";
import { listConcerts } from "./concerts";
import { listRecords } from "./records";
import { slugify } from "./slug";
import type { Artist, Concert, VinylRecord } from "./types";

export interface ArtistAggregate {
  name: string; // canonical display name
  slug: string;
  concerts: Concert[];
  records: VinylRecord[];
  /** Stored Artist doc when one exists for this slug, else null. */
  stored: Artist | null;
}

/**
 * Strip Discogs-style disambiguators and common variations so different
 * spellings of the same artist collapse to one slug.
 *   "Pixies (US)"      → "pixies"
 *   "Beck (2)"         → "beck"
 *   "Beatles, The"     → "the-beatles"
 *   "  bad religion  " → "bad-religion"
 */
function normalizeArtistName(name: string): string {
  let n = name.trim();
  // Discogs numeric disambiguator: "Beck (2)"
  n = n.replace(/\s*\(\d+\)\s*$/g, "");
  // Discogs country/region disambiguator: "Pixies (US)"
  n = n.replace(/\s*\((?:US|UK|JP|UK\d?|US\d?|EU|AU|CA|FR|DE|JPN|CAN)\)\s*$/i, "");
  // "Beatles, The" → "The Beatles"
  n = n.replace(/^(.+),\s*(The|A|An)$/i, "$2 $1");
  // Collapse internal whitespace
  n = n.replace(/\s+/g, " ").trim();
  return n;
}

/** Slug used for /artists/<slug>. Lowercased, hyphenated, leading "the-" preserved. */
function artistSlug(name: string): string {
  return slugify(normalizeArtistName(name));
}

// ─── Stored Artist CRUD ─────────────────────────────────────────────────────

export async function listStoredArtists(): Promise<Artist[]> {
  const { resources } = await containers.artists.items
    .query<Artist>({ query: "SELECT * FROM c" })
    .fetchAll();
  return resources;
}

export async function getStoredArtist(slug: string): Promise<Artist | null> {
  try {
    const { resource } = await containers.artists.item(slug, slug).read<Artist>();
    return resource ?? null;
  } catch {
    return null;
  }
}

export type ArtistInput = Partial<
  Omit<Artist, "id" | "slug" | "createdAt" | "updatedAt">
> & { name: string };

export async function upsertStoredArtist(slug: string, input: ArtistInput): Promise<Artist> {
  const now = new Date().toISOString();
  const existing = await getStoredArtist(slug);
  const doc: Artist = {
    id: slug,
    slug,
    name: input.name,
    aliases: input.aliases,
    musicbrainzId: input.musicbrainzId,
    setlistFmMbid: input.setlistFmMbid,
    discogsArtistId: input.discogsArtistId,
    description: input.description,
    imageUrl: input.imageUrl,
    notes: input.notes,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  const { resource } = await containers.artists.items.upsert(doc);
  return resource as unknown as Artist;
}

export async function deleteStoredArtist(slug: string): Promise<boolean> {
  try {
    await containers.artists.item(slug, slug).delete();
    return true;
  } catch {
    return false;
  }
}

// ─── Aggregate (computed + merged with stored) ──────────────────────────────

interface RawIndex {
  byKey: Map<string, ArtistAggregate>;
  /** Track display-name occurrence counts so the most common form wins. */
  nameCounts: Map<string, Map<string, number>>;
}

function ensureBucket(idx: RawIndex, displayName: string, targetSlug: string): ArtistAggregate {
  const norm = normalizeArtistName(displayName);
  let agg = idx.byKey.get(targetSlug);
  if (!agg) {
    agg = { name: norm, slug: targetSlug, concerts: [], records: [], stored: null };
    idx.byKey.set(targetSlug, agg);
  }
  // Tally names so we can promote the most common one
  let names = idx.nameCounts.get(targetSlug);
  if (!names) {
    names = new Map();
    idx.nameCounts.set(targetSlug, names);
  }
  names.set(norm, (names.get(norm) ?? 0) + 1);
  return agg;
}

/**
 * Build a name→slug map from stored aliases. If "pixies" stores
 * aliases ["Pixies (US)", "Pixies (US 2)"], both raw inputs route
 * to the same canonical slug as the regex would.
 */
function buildAliasMap(stored: Artist[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const a of stored) {
    for (const alias of a.aliases ?? []) {
      map.set(alias.trim().toLowerCase(), a.slug);
    }
  }
  return map;
}

function resolveSlug(rawName: string, aliasMap: Map<string, string>): string {
  const aliased = aliasMap.get(rawName.trim().toLowerCase());
  if (aliased) return aliased;
  return artistSlug(rawName);
}

async function buildIndex(): Promise<RawIndex> {
  const [concerts, records, stored] = await Promise.all([
    listConcerts().catch(() => []),
    listRecords().catch(() => []),
    listStoredArtists().catch(() => [] as Artist[]),
  ]);
  const aliasMap = buildAliasMap(stored);
  const idx: RawIndex = { byKey: new Map(), nameCounts: new Map() };

  for (const c of concerts) {
    const seen = new Set<string>();
    for (const s of c.setlists) {
      if (!s.artist) continue;
      const slug = resolveSlug(s.artist, aliasMap);
      if (seen.has(slug)) continue;
      seen.add(slug);
      const bucket = ensureBucket(idx, s.artist, slug);
      bucket.concerts.push(c);
    }
  }

  for (const r of records) {
    const seen = new Set<string>();
    for (const a of r.artists) {
      if (!a.name) continue;
      const slug = resolveSlug(a.name, aliasMap);
      if (seen.has(slug)) continue;
      seen.add(slug);
      const bucket = ensureBucket(idx, a.name, slug);
      bucket.records.push(r);
    }
  }

  // Promote the most common display name per slug — but if a stored Artist
  // exists for the slug, its name wins (admin gets to set the canonical form).
  const storedBySlug = new Map(stored.map((a) => [a.slug, a]));
  for (const [slug, counts] of idx.nameCounts) {
    const bucket = idx.byKey.get(slug);
    if (!bucket) continue;
    const storedArtist = storedBySlug.get(slug);
    if (storedArtist) {
      bucket.name = storedArtist.name;
      bucket.stored = storedArtist;
    } else {
      const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
      if (best) bucket.name = best[0];
    }
  }

  // Also ensure stored artists with zero concerts/records show up (so admin can manage them)
  for (const a of stored) {
    if (!idx.byKey.has(a.slug)) {
      idx.byKey.set(a.slug, {
        name: a.name,
        slug: a.slug,
        concerts: [],
        records: [],
        stored: a,
      });
    }
  }

  // Sort each artist's items
  for (const agg of idx.byKey.values()) {
    agg.concerts.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
    agg.records.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  }

  return idx;
}

export async function listArtists(): Promise<ArtistAggregate[]> {
  const idx = await buildIndex();
  return [...idx.byKey.values()].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
}

export async function getArtist(slug: string): Promise<ArtistAggregate | null> {
  const idx = await buildIndex();
  return idx.byKey.get(slug) ?? null;
}

export function buildArtistSlug(name: string): string {
  return artistSlug(name);
}

// ─── External-link helpers ──────────────────────────────────────────────────

export function musicbrainzUrl(mbid: string | undefined): string | null {
  if (!mbid) return null;
  return `https://musicbrainz.org/artist/${mbid}`;
}

export function setlistFmArtistUrl(mbid: string | undefined, name?: string): string | null {
  if (mbid) return `https://www.setlist.fm/setlists/${mbid}.html`;
  // Fall back to a search URL so the admin still has somewhere to click.
  if (name) return `https://www.setlist.fm/search?query=${encodeURIComponent(name)}`;
  return null;
}

export function discogsArtistUrl(id: number | undefined): string | null {
  if (!id) return null;
  return `https://www.discogs.com/artist/${id}`;
}
