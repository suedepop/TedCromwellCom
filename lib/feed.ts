import { listPosts } from "./blog";
import { listConcerts } from "./concerts";
import { listTravelEntries } from "./travel";
import type { BlogPost, Concert, TravelEntry } from "./types";

export type FeedItem =
  | { type: "blog"; sortDate: string; key: string; data: BlogPost }
  | { type: "concert"; sortDate: string; key: string; data: Concert }
  | { type: "travel"; sortDate: string; key: string; data: TravelEntry };

function blogSortDate(p: BlogPost): string {
  return p.publishedAt ?? p.updatedAt ?? "";
}

export async function listFeedAll(): Promise<FeedItem[]> {
  const [posts, concerts, travel] = await Promise.all([
    listPosts("published").catch(() => []),
    listConcerts().catch(() => []),
    listTravelEntries().catch(() => []),
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
  ];

  items.sort((a, b) => (b.sortDate ?? "").localeCompare(a.sortDate ?? ""));
  return items;
}

export async function listFeedPage(offset: number, limit: number): Promise<{
  items: FeedItem[];
  total: number;
  offset: number;
  limit: number;
}> {
  const all = await listFeedAll();
  return {
    items: all.slice(offset, offset + limit),
    total: all.length,
    offset,
    limit,
  };
}
