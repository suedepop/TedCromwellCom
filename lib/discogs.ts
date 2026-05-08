import type { VinylRecord } from "./types";
import { containers } from "./cosmos";
import { slugify } from "./slug";

const BASE = "https://api.discogs.com";
const PER_PAGE = 100;
const RATE_DELAY_MS = 1100; // ~55 req/min, well under the 60/min auth'd limit

interface DiscogsArtist {
  id: number;
  name: string;
  anv?: string;
}
interface DiscogsFormat {
  name: string;
  qty?: string;
  descriptions?: string[];
}
interface DiscogsLabel {
  id?: number;
  name: string;
  catno?: string;
  entity_type?: string;
}
interface DiscogsBasicInfo {
  id: number;
  master_id?: number;
  title: string;
  year?: number;
  artists?: DiscogsArtist[];
  formats?: DiscogsFormat[];
  labels?: DiscogsLabel[];
  genres?: string[];
  styles?: string[];
  thumb?: string;
  cover_image?: string;
  resource_url?: string;
}
interface DiscogsCollectionRelease {
  id: number;
  date_added?: string;
  basic_information: DiscogsBasicInfo;
}
interface DiscogsCollectionResponse {
  pagination: { page: number; pages: number; items: number };
  releases: DiscogsCollectionRelease[];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function authHeader(): string {
  const k = process.env.DISCOGS_KEY;
  const s = process.env.DISCOGS_SECRET;
  if (!k || !s) throw new Error("DISCOGS_KEY and DISCOGS_SECRET must be set");
  return `Discogs key=${k}, secret=${s}`;
}

async function fetchPage(username: string, page: number): Promise<DiscogsCollectionResponse> {
  const url = `${BASE}/users/${encodeURIComponent(username)}/collection/folders/0/releases?per_page=${PER_PAGE}&page=${page}&sort=added&sort_order=desc`;
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "TedCromwellCom/1.0 (+https://www.tedcromwell.com)",
        Authorization: authHeader(),
        Accept: "application/json",
      },
    });
    if (res.ok) return (await res.json()) as DiscogsCollectionResponse;
    if (res.status === 429) {
      const retry = Number(res.headers.get("retry-after")) || 5;
      await sleep(retry * 1000 * (attempt + 1));
      continue;
    }
    throw new Error(`discogs ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  throw new Error("discogs: too many 429s");
}

async function fetchAllReleases(username: string): Promise<{
  releases: DiscogsCollectionRelease[];
  total: number;
  pagesFetched: number;
}> {
  const out: DiscogsCollectionRelease[] = [];
  let page = 1;
  let pages = 1;
  let total = 0;
  do {
    const data = await fetchPage(username, page);
    pages = data.pagination.pages;
    total = data.pagination.items;
    out.push(...data.releases);
    page += 1;
    if (page <= pages) await sleep(RATE_DELAY_MS);
    if (page > 200) break; // safety: 200 * 100 = 20k records
  } while (page <= pages);
  return { releases: out, total, pagesFetched: page - 1 };
}

function buildSlug(info: DiscogsBasicInfo, existing: Set<string>): string {
  const artist = info.artists?.[0]?.name ?? "various";
  const base = slugify(`${info.year ?? ""}-${artist}-${info.title}`) || `release-${info.id}`;
  if (!existing.has(base)) return base;
  for (let n = 2; n < 50; n++) {
    const candidate = `${base}-${n}`;
    if (!existing.has(candidate)) return candidate;
  }
  return `${base}-${info.id}`;
}

function flattenFormats(formats?: DiscogsFormat[]): { all: string[]; primary: string } {
  if (!formats || formats.length === 0) return { all: [], primary: "" };
  const all = formats.flatMap((f) => [f.name, ...(f.descriptions ?? [])]).filter(Boolean);
  const primary = [formats[0].name, ...(formats[0].descriptions ?? [])].filter(Boolean).join(", ");
  return { all: Array.from(new Set(all)), primary };
}

function toRecord(rel: DiscogsCollectionRelease, slug: string): VinylRecord {
  const info = rel.basic_information;
  const fmt = flattenFormats(info.formats);
  const now = new Date().toISOString();
  return {
    id: String(info.id),
    slug,
    discogsReleaseId: info.id,
    discogsMasterId: info.master_id,
    title: info.title,
    artists: (info.artists ?? []).map((a) => ({ id: a.id, name: a.anv?.trim() || a.name })),
    year: info.year && info.year > 0 ? info.year : undefined,
    formats: fmt.all,
    primaryFormat: fmt.primary,
    labels: (info.labels ?? []).map((l) => ({ name: l.name, catno: l.catno })),
    genres: info.genres ?? [],
    styles: info.styles ?? [],
    coverImageUrl: info.cover_image,
    thumbnailUrl: info.thumb,
    resourceUrl: info.resource_url,
    permalinkUrl: `https://www.discogs.com/release/${info.id}`,
    addedToCollectionAt: rel.date_added,
    importedAt: now,
    updatedAt: now,
  };
}

export interface DiscogsImportResult {
  fetchedFromApi: number;
  apiReportedTotal: number;
  pagesFetched: number;
  newRecords: number;
  updatedRecords: number;
  newRecordTitles: string[];
  committed: boolean;
}

export async function runDiscogsImport(opts: { commit: boolean }): Promise<DiscogsImportResult> {
  const username = process.env.DISCOGS_USERNAME;
  if (!username) throw new Error("DISCOGS_USERNAME must be set");

  const { releases, total, pagesFetched } = await fetchAllReleases(username);

  // Find existing records to determine new vs updated
  const { resources: existingDocs } = await containers.records.items
    .query<{ id: string; slug: string }>({ query: "SELECT c.id, c.slug FROM c" })
    .fetchAll();
  const existingIds = new Set(existingDocs.map((d) => d.id));
  const slugSet = new Set(existingDocs.map((d) => d.slug));

  let newCount = 0;
  let updatedCount = 0;
  const newTitles: string[] = [];

  for (const rel of releases) {
    const id = String(rel.basic_information.id);
    const isNew = !existingIds.has(id);
    let slug: string;
    if (isNew) {
      slug = buildSlug(rel.basic_information, slugSet);
      slugSet.add(slug);
    } else {
      // keep existing slug
      const found = existingDocs.find((d) => d.id === id);
      slug = found?.slug ?? buildSlug(rel.basic_information, slugSet);
    }
    if (isNew) {
      newCount += 1;
      newTitles.push(`${rel.basic_information.artists?.[0]?.name ?? ""} — ${rel.basic_information.title}`);
    } else {
      updatedCount += 1;
    }
    if (opts.commit) {
      const doc = toRecord(rel, slug);
      // preserve admin-edited fields if present
      if (!isNew) {
        try {
          const { resource: prev } = await containers.records.item(id, id).read<VinylRecord>();
          if (prev) {
            doc.notes = prev.notes;
            doc.hidden = prev.hidden;
            // keep original importedAt
            doc.importedAt = prev.importedAt;
          }
        } catch {
          /* ignore */
        }
      }
      await containers.records.items.upsert(doc);
    }
  }

  return {
    fetchedFromApi: releases.length,
    apiReportedTotal: total,
    pagesFetched,
    newRecords: newCount,
    updatedRecords: updatedCount,
    newRecordTitles: newTitles.slice(0, 25),
    committed: !!opts.commit,
  };
}
