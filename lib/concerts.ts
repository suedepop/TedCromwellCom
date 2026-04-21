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

export async function upsertConcert(concert: Concert): Promise<Concert> {
  concert.pk = concert.venueId;
  concert.updatedAt = new Date().toISOString();
  const { resource } = await containers.concerts.items.upsert(concert);
  return resource as unknown as Concert;
}

export async function deleteConcertById(id: string): Promise<boolean> {
  const existing = await findConcertById(id);
  if (!existing) return false;
  await containers.concerts.item(existing.id, existing.venueId).delete();
  return true;
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
