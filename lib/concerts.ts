import { randomUUID } from "node:crypto";
import { containers } from "./cosmos";
import type { Concert } from "./types";

export interface ConcertFilters {
  venueId?: string;
  year?: string;
  artist?: string;
}

export async function listConcerts(filters: ConcertFilters = {}): Promise<Concert[]> {
  const where: string[] = [];
  const parameters: { name: string; value: string }[] = [];
  if (filters.venueId) {
    where.push("c.venueId = @venueId");
    parameters.push({ name: "@venueId", value: filters.venueId });
  }
  if (filters.year) {
    where.push("STARTSWITH(c.date, @year)");
    parameters.push({ name: "@year", value: filters.year });
  }
  if (filters.artist) {
    where.push("EXISTS(SELECT VALUE s FROM s IN c.setlists WHERE CONTAINS(LOWER(s.artist), @artist))");
    parameters.push({ name: "@artist", value: filters.artist.toLowerCase() });
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const { resources } = await containers.concerts.items
    .query<Concert>({
      query: `SELECT * FROM c ${whereSql} ORDER BY c.date DESC`,
      parameters,
    })
    .fetchAll();
  return resources;
}

export async function findConcertById(id: string): Promise<Concert | null> {
  const { resources } = await containers.concerts.items
    .query<Concert>({
      query: "SELECT * FROM c WHERE c.id = @id",
      parameters: [{ name: "@id", value: id }],
    })
    .fetchAll();
  return resources[0] ?? null;
}

export async function findConcertBySlug(slug: string): Promise<Concert | null> {
  const { resources } = await containers.concerts.items
    .query<Concert>({
      query: "SELECT * FROM c WHERE c.slug = @slug",
      parameters: [{ name: "@slug", value: slug }],
    })
    .fetchAll();
  return resources[0] ?? null;
}

export async function findConcertBySlugOrId(value: string): Promise<Concert | null> {
  return (await findConcertBySlug(value)) ?? findConcertById(value);
}

export async function upsertConcert(concert: Concert): Promise<Concert> {
  concert.pk = concert.venueId;
  concert.updatedAt = new Date().toISOString();
  if (!concert.slug) {
    const { uniqueConcertSlug } = await import("./slugBuilders");
    concert.slug = await uniqueConcertSlug(concert, concert.id);
  }
  const { resource } = await containers.concerts.items.upsert(concert);
  return resource as unknown as Concert;
}

export async function deleteConcertById(id: string): Promise<boolean> {
  const existing = await findConcertById(id);
  if (!existing) return false;
  await containers.concerts.item(existing.id, existing.venueId).delete();
  return true;
}

export async function mergeConcerts(keepId: string, mergeId: string): Promise<Concert | null> {
  if (keepId === mergeId) return null;
  const [keep, merge] = await Promise.all([findConcertById(keepId), findConcertById(mergeId)]);
  if (!keep || !merge) return null;

  // Combine setlists — preserve any keep's then append merge's, dedupe by setlistFmId, renumber sortOrder
  const seenSetlistIds = new Set<string>();
  const combinedSetlists = [...keep.setlists, ...merge.setlists]
    .filter((s) => {
      if (s.setlistFmId && seenSetlistIds.has(s.setlistFmId)) return false;
      if (s.setlistFmId) seenSetlistIds.add(s.setlistFmId);
      return true;
    })
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((s, i) => ({ ...s, sortOrder: i }));

  const dedupeBy = <T,>(arr: T[], key: (item: T) => string): T[] => {
    const seen = new Set<string>();
    return arr.filter((item) => {
      const k = key(item);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  };

  const merged: Concert = {
    ...keep,
    setlists: combinedSetlists,
    photos: dedupeBy([...keep.photos, ...merge.photos], (p) => p.id),
    ticketStubs: dedupeBy([...keep.ticketStubs, ...merge.ticketStubs], (t) => t.id),
    links: dedupeBy([...keep.links, ...merge.links], (l) => l.url),
    videoUrls: Array.from(new Set([...(keep.videoUrls ?? []), ...(merge.videoUrls ?? [])])),
    setlistFmIds: Array.from(new Set([...keep.setlistFmIds, ...merge.setlistFmIds])),
    eventName: keep.eventName || merge.eventName,
    writeUp: keep.writeUp || merge.writeUp,
    notes: [keep.notes, merge.notes].filter(Boolean).join("\n\n").trim(),
    featuredPhotoId: keep.featuredPhotoId ?? merge.featuredPhotoId,
    updatedAt: new Date().toISOString(),
  };

  await containers.concerts.item(merge.id, merge.venueId).delete();
  const { resource } = await containers.concerts.item(keep.id, keep.venueId).replace(merged);
  return resource as Concert;
}

export async function findConcertsOnSameDateOrVenue(
  concert: Concert,
): Promise<Concert[]> {
  const { resources } = await containers.concerts.items
    .query<Concert>({
      query:
        "SELECT * FROM c WHERE c.id != @id AND (c.date = @date OR c.venueId = @venueId)",
      parameters: [
        { name: "@id", value: concert.id },
        { name: "@date", value: concert.date },
        { name: "@venueId", value: concert.venueId },
      ],
    })
    .fetchAll();
  return resources;
}

export function newConcertId(): string {
  return randomUUID();
}

export async function collectSetlistFmIds(): Promise<Set<string>> {
  const { resources } = await containers.concerts.items
    .query<{ setlistFmIds: string[] }>({
      query: "SELECT c.setlistFmIds FROM c",
    })
    .fetchAll();
  const set = new Set<string>();
  for (const row of resources) for (const id of row.setlistFmIds ?? []) set.add(id);
  return set;
}
