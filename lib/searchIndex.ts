import { listPosts } from "./blog";
import { listConcerts } from "./concerts";
import { listTravelEntries } from "./travel";
import { concertBandLine } from "./concertDisplay";
import type { SearchIndexEntry } from "./types";

export const fuseOptions = {
  keys: [
    { name: "title", weight: 0.5 },
    { name: "body", weight: 0.4 },
    { name: "date", weight: 0.1 },
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2,
};

export async function buildSearchIndex(): Promise<SearchIndexEntry[]> {
  const [posts, concerts, trips] = await Promise.all([
    listPosts("published").catch(() => []),
    listConcerts().catch(() => []),
    listTravelEntries().catch(() => []),
  ]);

  const entries: SearchIndexEntry[] = [];

  for (const p of posts) {
    entries.push({
      id: p.id,
      type: "post",
      title: p.title,
      date: p.publishedAt ?? p.updatedAt,
      body: `${p.excerpt}\n${p.tags.join(" ")}\n${p.content}`,
      url: `/blog/${p.slug}`,
    });
  }

  for (const c of concerts) {
    const artists = c.setlists.map((s) => s.artist).join(" · ");
    const songs = c.setlists.flatMap((s) => s.songs.map((song) => song.name)).join(" ");
    entries.push({
      id: c.id,
      type: "concert",
      title: c.eventName ? `${c.eventName} — ${concertBandLine(c)}` : concertBandLine(c),
      date: c.date,
      body: `${c.eventName ?? ""} ${artists} ${c.venueNameRaw} ${c.city} ${c.country} ${songs} ${c.notes}`,
      url: `/concerts/${c.id}`,
    });
  }

  for (const t of trips) {
    entries.push({
      id: t.id,
      type: "trip",
      title: t.locationName,
      date: t.startDate,
      body: `${t.content} ${[t.city, t.state, t.country].filter(Boolean).join(", ")}`,
      url: `/travel/${t.id}`,
    });
  }

  return entries;
}
