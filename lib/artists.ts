import { listConcerts } from "./concerts";
import { listRecords } from "./records";
import { slugify } from "./slug";
import type { Concert, VinylRecord } from "./types";

export interface ArtistAggregate {
  name: string; // canonical display name
  slug: string;
  concerts: Concert[];
  records: VinylRecord[];
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

interface RawIndex {
  byKey: Map<string, ArtistAggregate>;
  /** Track display-name occurrence counts so the most common form wins. */
  nameCounts: Map<string, Map<string, number>>;
}

function ensureBucket(idx: RawIndex, displayName: string): ArtistAggregate {
  const norm = normalizeArtistName(displayName);
  const slug = artistSlug(displayName);
  let agg = idx.byKey.get(slug);
  if (!agg) {
    agg = { name: norm, slug, concerts: [], records: [] };
    idx.byKey.set(slug, agg);
  }
  // Tally names so we can promote the most common one
  let names = idx.nameCounts.get(slug);
  if (!names) {
    names = new Map();
    idx.nameCounts.set(slug, names);
  }
  names.set(norm, (names.get(norm) ?? 0) + 1);
  return agg;
}

async function buildIndex(): Promise<RawIndex> {
  const [concerts, records] = await Promise.all([
    listConcerts().catch(() => []),
    listRecords().catch(() => []),
  ]);
  const idx: RawIndex = { byKey: new Map(), nameCounts: new Map() };

  for (const c of concerts) {
    const seen = new Set<string>();
    for (const s of c.setlists) {
      if (!s.artist) continue;
      const slug = artistSlug(s.artist);
      if (seen.has(slug)) continue;
      seen.add(slug);
      const bucket = ensureBucket(idx, s.artist);
      bucket.concerts.push(c);
    }
  }

  for (const r of records) {
    const seen = new Set<string>();
    for (const a of r.artists) {
      if (!a.name) continue;
      const slug = artistSlug(a.name);
      if (seen.has(slug)) continue;
      seen.add(slug);
      const bucket = ensureBucket(idx, a.name);
      bucket.records.push(r);
    }
  }

  // Promote the most common display name per slug
  for (const [slug, counts] of idx.nameCounts) {
    const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    if (best) {
      const bucket = idx.byKey.get(slug);
      if (bucket) bucket.name = best[0];
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
