/**
 * Shared maintenance routines. Each function returns a structured result that
 * works for both CLI scripts and admin API responses.
 *
 * All routines are idempotent and safe to run repeatedly.
 */
import { containers } from "./cosmos";
import { listConcerts } from "./concerts";
import { listRecords } from "./records";
import { listTravelEntries } from "./travel";
import { listStoredArtists, buildArtistSlug } from "./artists";
import { uniqueConcertSlug, uniqueTravelSlug } from "./slugBuilders";
import type { Artist, Concert, TravelEntry } from "./types";

// ─── bootstrapArtists ────────────────────────────────────────────────────────

export interface BootstrapArtistsResult {
  created: number;
  updated: number;
  skipped: number;
  totalSeen: number;
  newArtistNames: string[];
  log: string[];
}

export async function bootstrapArtists(opts: {
  refillDiscogs?: boolean;
  dryRun?: boolean;
} = {}): Promise<BootstrapArtistsResult> {
  const { refillDiscogs = false, dryRun = false } = opts;
  const log: string[] = [];

  const [concerts, records, existing] = await Promise.all([
    listConcerts(),
    listRecords(),
    listStoredArtists(),
  ]);
  const existingBySlug = new Map(existing.map((a) => [a.slug, a]));

  const aggregated = new Map<
    string,
    { name: string; discogsId?: number; concertCount: number; recordCount: number }
  >();

  function bump(rawName: string, discogsId: number | undefined, kind: "concert" | "record") {
    const slug = buildArtistSlug(rawName);
    const cur = aggregated.get(slug) ?? {
      name: rawName.trim(),
      discogsId: undefined,
      concertCount: 0,
      recordCount: 0,
    };
    if (discogsId && !cur.discogsId) cur.discogsId = discogsId;
    if (kind === "concert") cur.concertCount += 1;
    else cur.recordCount += 1;
    aggregated.set(slug, cur);
  }

  for (const c of concerts) {
    const seen = new Set<string>();
    for (const s of c.setlists) {
      if (!s.artist) continue;
      const slug = buildArtistSlug(s.artist);
      if (seen.has(slug)) continue;
      seen.add(slug);
      bump(s.artist, undefined, "concert");
    }
  }
  for (const r of records) {
    const seen = new Set<string>();
    for (const a of r.artists) {
      if (!a.name) continue;
      const slug = buildArtistSlug(a.name);
      if (seen.has(slug)) continue;
      seen.add(slug);
      bump(a.name, a.id, "record");
    }
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;
  const newArtistNames: string[] = [];
  const now = new Date().toISOString();

  for (const [slug, info] of aggregated) {
    const existingDoc = existingBySlug.get(slug);
    if (existingDoc) {
      if (!refillDiscogs || existingDoc.discogsArtistId || !info.discogsId) {
        skipped += 1;
        continue;
      }
      const updatedDoc: Artist = {
        ...existingDoc,
        discogsArtistId: info.discogsId,
        updatedAt: now,
      };
      if (!dryRun) {
        await containers.artists.item(slug, slug).replace(updatedDoc);
      }
      updated += 1;
      log.push(`updated ${slug} (discogs=${info.discogsId})`);
      continue;
    }
    const doc: Artist = {
      id: slug,
      slug,
      name: info.name,
      discogsArtistId: info.discogsId,
      createdAt: now,
      updatedAt: now,
    };
    if (!dryRun) {
      await containers.artists.items.create(doc);
    }
    created += 1;
    newArtistNames.push(info.name);
    log.push(`created ${slug} (name="${info.name}", discogs=${info.discogsId ?? "—"})`);
  }

  return {
    created,
    updated,
    skipped,
    totalSeen: aggregated.size,
    newArtistNames: newArtistNames.slice(0, 50),
    log,
  };
}

// ─── backfillSlugs ───────────────────────────────────────────────────────────

export interface BackfillSlugsResult {
  concertsUpdated: number;
  travelUpdated: number;
  log: string[];
}

export async function backfillSlugs(opts: { dryRun?: boolean } = {}): Promise<BackfillSlugsResult> {
  const { dryRun = false } = opts;
  const log: string[] = [];

  const { resources: rawConcerts } = await containers.concerts.items
    .query<Concert>({ query: "SELECT * FROM c" })
    .fetchAll();

  let concertsUpdated = 0;
  for (const c of rawConcerts) {
    if (c.slug) continue;
    const slug = await uniqueConcertSlug(c, c.id);
    if (!dryRun) {
      await containers.concerts.item(c.id, c.venueId).replace({ ...c, slug });
    }
    concertsUpdated += 1;
    log.push(`concert ${c.date} → ${slug}`);
  }

  const trips = await listTravelEntries();
  let travelUpdated = 0;
  for (const t of trips) {
    if (t.slug) continue;
    const slug = await uniqueTravelSlug(t, t.id);
    if (!dryRun) {
      await containers.trips.item(t.id, t.id).replace({ ...t, slug });
    }
    travelUpdated += 1;
    log.push(`travel ${t.startDate} → ${slug}`);
  }

  return { concertsUpdated, travelUpdated, log };
}

// ─── verifyConnections ──────────────────────────────────────────────────────

export interface VerifyConnectionsResult {
  ok: boolean;
  cosmos: { name: string; ok: boolean; partitionKey?: string[]; error?: string }[];
  blob: { name: string; ok: boolean; error?: string }[];
  storage?: { kind?: string; sku?: string };
  database?: string;
}

export async function verifyConnections(): Promise<VerifyConnectionsResult> {
  const { cosmosClient } = await import("./cosmos");
  const { blobService, container: blobContainer } = await import("./blob");

  const cosmosNames = ["posts", "concerts", "venues", "trips", "places", "resume", "records", "artists"] as const;
  const cosmos: VerifyConnectionsResult["cosmos"] = [];
  for (const name of cosmosNames) {
    try {
      const { resource } = await containers[name].read();
      cosmos.push({
        name,
        ok: true,
        partitionKey: resource?.partitionKey?.paths,
      });
    } catch (e) {
      cosmos.push({ name, ok: false, error: (e as Error).message });
    }
  }

  const blobNames = ["photos", "stubs", "blog", "travel", "resume"] as const;
  const blob: VerifyConnectionsResult["blob"] = [];
  for (const name of blobNames) {
    try {
      const exists = await blobContainer(name).exists();
      blob.push({ name, ok: !!exists, error: exists ? undefined : "not found" });
    } catch (e) {
      blob.push({ name, ok: false, error: (e as Error).message });
    }
  }

  let storage: VerifyConnectionsResult["storage"];
  try {
    const info = await blobService.getAccountInfo();
    storage = { kind: info.accountKind, sku: info.skuName };
  } catch {
    storage = undefined;
  }

  let database: string | undefined;
  try {
    const { resource } = await cosmosClient
      .database(process.env.COSMOS_DATABASE ?? "tedcromwell")
      .read();
    database = resource?.id;
  } catch {
    database = undefined;
  }

  const ok = cosmos.every((c) => c.ok) && blob.every((b) => b.ok);
  return { ok, cosmos, blob, storage, database };
}

// ─── lookupMusicBrainzIds ───────────────────────────────────────────────────

interface MbArtist {
  id: string;
  name: string;
  score: number;
  type?: string;
  country?: string;
  disambiguation?: string;
  aliases?: { name: string }[];
}

export interface MbLookupCandidate {
  mbid: string;
  name: string;
  score: number;
  type?: string;
  country?: string;
  disambiguation?: string;
}

export interface MbAmbiguousArtist {
  slug: string;
  name: string;
  reason: string;
  candidates: MbLookupCandidate[];
}

export interface LookupMusicBrainzResult {
  processed: number;
  matched: number;
  ambiguous: number;
  notFound: number;
  errors: number;
  remaining: number;
  ambiguousList: MbAmbiguousArtist[];
}

const MB_BASE = "https://musicbrainz.org/ws/2/artist/";
const MB_RATE_DELAY_MS = 1100; // ~0.9 req/s, well under MB's 1/s anonymous limit
const MB_USER_AGENT =
  "TedCromwellCom/1.0 (+https://www.tedcromwell.com — personal-site artist alignment)";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function normalizeForMatch(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

async function searchMusicBrainz(name: string): Promise<MbArtist[]> {
  const q = `artist:"${name.replace(/"/g, "")}"`;
  const url = `${MB_BASE}?query=${encodeURIComponent(q)}&fmt=json&limit=5`;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, {
      headers: { "User-Agent": MB_USER_AGENT, Accept: "application/json" },
    });
    if (res.ok) {
      const data = (await res.json()) as { artists?: MbArtist[] };
      return data.artists ?? [];
    }
    if (res.status === 503 || res.status === 429) {
      // Honor MB's rate limit — back off and retry
      await sleep(2000 * (attempt + 1));
      continue;
    }
    throw new Error(`musicbrainz ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  throw new Error("musicbrainz: too many retries");
}

function classifyMatch(
  artistName: string,
  candidates: MbArtist[],
):
  | { kind: "match"; mbid: string }
  | { kind: "ambiguous"; reason: string; candidates: MbLookupCandidate[] }
  | { kind: "not-found" } {
  if (candidates.length === 0) return { kind: "not-found" };
  const target = normalizeForMatch(artistName);
  const scored = candidates.map((c) => {
    const nameMatches = normalizeForMatch(c.name) === target;
    const aliasMatches =
      c.aliases?.some((a) => normalizeForMatch(a.name) === target) ?? false;
    return { ...c, nameMatches, aliasMatches };
  });
  const top = scored[0];
  const second = scored[1];
  // Confident match: top has high score AND name/alias matches AND second is meaningfully behind.
  if (
    (top.nameMatches || top.aliasMatches) &&
    top.score >= 95 &&
    (!second || second.score <= top.score - 5 || !(second.nameMatches || second.aliasMatches))
  ) {
    return { kind: "match", mbid: top.id };
  }
  const candidatesOut: MbLookupCandidate[] = scored.slice(0, 5).map((c) => ({
    mbid: c.id,
    name: c.name,
    score: c.score,
    type: c.type,
    country: c.country,
    disambiguation: c.disambiguation,
  }));
  if (top.score < 80) {
    return { kind: "not-found" };
  }
  return {
    kind: "ambiguous",
    reason:
      top.nameMatches || top.aliasMatches
        ? "Multiple close-scoring candidates"
        : "Top result name doesn't match exactly",
    candidates: candidatesOut,
  };
}

export async function lookupMusicBrainzIds(opts: {
  limit?: number;
  dryRun?: boolean;
} = {}): Promise<LookupMusicBrainzResult> {
  const { limit = 200, dryRun = false } = opts;
  const stored = await listStoredArtists();
  const todo = stored.filter((a) => !a.musicbrainzId);
  const slice = todo.slice(0, limit);

  let matched = 0;
  let ambiguous = 0;
  let notFound = 0;
  let errors = 0;
  const ambiguousList: MbAmbiguousArtist[] = [];
  const now = new Date().toISOString();

  for (let i = 0; i < slice.length; i++) {
    const artist = slice[i];
    if (i > 0) await sleep(MB_RATE_DELAY_MS);
    try {
      const candidates = await searchMusicBrainz(artist.name);
      const result = classifyMatch(artist.name, candidates);
      if (result.kind === "match") {
        matched += 1;
        if (!dryRun) {
          const updated: Artist = {
            ...artist,
            musicbrainzId: result.mbid,
            setlistFmMbid: artist.setlistFmMbid ?? result.mbid,
            updatedAt: now,
          };
          await containers.artists.item(artist.slug, artist.slug).replace(updated);
        }
      } else if (result.kind === "ambiguous") {
        ambiguous += 1;
        ambiguousList.push({
          slug: artist.slug,
          name: artist.name,
          reason: result.reason,
          candidates: result.candidates,
        });
      } else {
        notFound += 1;
      }
    } catch {
      errors += 1;
    }
  }

  return {
    processed: slice.length,
    matched,
    ambiguous,
    notFound,
    errors,
    remaining: Math.max(0, todo.length - slice.length),
    ambiguousList: ambiguousList.slice(0, 30),
  };
}

// Re-export the TravelEntry type so the script-side wrapper can stay narrow.
export type { TravelEntry };
