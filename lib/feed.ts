import { listPosts } from "./blog";
import { listConcerts } from "./concerts";
import { listTravelEntries } from "./travel";
import { listRecords } from "./records";
import { listVenues } from "./venues";
import type { BlogPost, Concert, TravelEntry, Venue, VinylRecord } from "./types";

export type FeedItem =
  | { type: "blog"; sortDate: string; key: string; data: BlogPost }
  | { type: "concert"; sortDate: string; key: string; data: Concert }
  | { type: "travel"; sortDate: string; key: string; data: TravelEntry }
  | { type: "vinyl"; sortDate: string; key: string; data: VinylRecord }
  | { type: "venue"; sortDate: string; key: string; data: Venue };

function blogSortDate(p: BlogPost): string {
  return p.publishedAt ?? p.updatedAt ?? "";
}

function vinylSortDate(r: VinylRecord): string {
  // Prefer when the record was added to the collection; fall back to the
  // import timestamp (when our system first saw it). Both are ISO strings.
  return r.addedToCollectionAt ?? r.importedAt ?? r.updatedAt ?? "";
}

function venueSortDate(v: Venue): string {
  // Venues lack an explicit publish date; use the Cosmos server timestamp _ts
  // when present, otherwise fall back to a stable sentinel that keeps them
  // sorted but doesn't push them above genuinely fresh content.
  const ts = (v as unknown as { _ts?: number })._ts;
  if (typeof ts === "number") return new Date(ts * 1000).toISOString();
  return "1970-01-01T00:00:00.000Z";
}

export type FeedItemType = FeedItem["type"];

const DEFAULT_HOME_TYPES: FeedItemType[] = ["blog", "concert", "travel"];

export async function listFeedAll(opts: { types?: FeedItemType[] } = {}): Promise<FeedItem[]> {
  const types = new Set<FeedItemType>(opts.types ?? ["blog", "concert", "travel", "vinyl", "venue"]);
  const [posts, concerts, travel, records, venues] = await Promise.all([
    types.has("blog") ? listPosts("published").catch(() => []) : Promise.resolve([]),
    types.has("concert") ? listConcerts().catch(() => []) : Promise.resolve([]),
    types.has("travel") ? listTravelEntries().catch(() => []) : Promise.resolve([]),
    types.has("vinyl") ? listRecords().catch(() => []) : Promise.resolve([]),
    types.has("venue") ? listVenues().catch(() => []) : Promise.resolve([]),
  ]);

  const items: FeedItem[] = [
    ...posts.map<FeedItem>((p) => ({
      type: "blog",
      sortDate: blogSortDate(p),
      key: `blog-${p.id}`,
      data: p,
    })),
    ...concerts.map<FeedItem>((c) => ({
      type: "concert",
      sortDate: c.date,
      key: `concert-${c.id}`,
      data: c,
    })),
    ...travel.map<FeedItem>((t) => ({
      type: "travel",
      sortDate: t.startDate,
      key: `travel-${t.id}`,
      data: t,
    })),
    ...records.map<FeedItem>((r) => ({
      type: "vinyl",
      sortDate: vinylSortDate(r),
      key: `vinyl-${r.id}`,
      data: r,
    })),
    ...venues.map<FeedItem>((v) => ({
      type: "venue",
      sortDate: venueSortDate(v),
      key: `venue-${v.id}`,
      data: v,
    })),
  ];

  items.sort((a, b) => (b.sortDate ?? "").localeCompare(a.sortDate ?? ""));
  return items;
}

export async function listFeedPage(
  offset: number,
  limit: number,
  opts: { types?: FeedItemType[] } = { types: DEFAULT_HOME_TYPES },
): Promise<{
  items: FeedItem[];
  total: number;
  offset: number;
  limit: number;
}> {
  const all = await listFeedAll(opts);
  return {
    items: all.slice(offset, offset + limit),
    total: all.length,
    offset,
    limit,
  };
}
