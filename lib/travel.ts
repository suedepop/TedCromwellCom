import { randomUUID } from "node:crypto";
import { containers } from "./cosmos";
import type { Photo, TravelEntry } from "./types";

export interface TravelEntryInput {
  locationName: string;
  startDate: string;
  endDate?: string;
  city?: string;
  state?: string;
  country: string;
  lat: number;
  lng: number;
  content: string;
  photos?: Photo[];
  featuredPhotoId?: string;
  publishedAt?: string;
}

function sortDesc(entries: TravelEntry[]): TravelEntry[] {
  // Sort by visit date (startDate) descending — most recent trip first.
  // Falls back to updatedAt only if startDate is missing (shouldn't happen).
  entries.sort((a, b) => {
    const ad = a.startDate ?? a.updatedAt ?? "";
    const bd = b.startDate ?? b.updatedAt ?? "";
    return bd.localeCompare(ad);
  });
  return entries;
}

export async function listTravelEntries(): Promise<TravelEntry[]> {
  const { resources } = await containers.trips.items
    .query<TravelEntry>({
      query: "SELECT * FROM c WHERE IS_DEFINED(c.locationName)",
    })
    .fetchAll();
  return sortDesc(resources);
}

export async function getTravelEntry(id: string): Promise<TravelEntry | null> {
  try {
    const { resource } = await containers.trips.item(id, id).read<TravelEntry>();
    return resource ?? null;
  } catch {
    return null;
  }
}

export async function createTravelEntry(input: TravelEntryInput): Promise<TravelEntry> {
  const now = new Date().toISOString();
  const entry: TravelEntry = {
    id: randomUUID(),
    locationName: input.locationName,
    startDate: input.startDate,
    endDate: input.endDate || undefined,
    city: input.city,
    state: input.state,
    country: input.country,
    lat: input.lat,
    lng: input.lng,
    content: input.content,
    photos: input.photos ?? [],
    featuredPhotoId: input.featuredPhotoId,
    publishedAt: input.publishedAt ?? now,
    updatedAt: now,
  };
  const { resource } = await containers.trips.items.create(entry);
  return resource as unknown as TravelEntry;
}

export async function updateTravelEntry(
  existing: TravelEntry,
  input: Partial<TravelEntryInput>,
): Promise<TravelEntry> {
  const now = new Date().toISOString();
  const nextPhotos = input.photos ?? existing.photos;
  const featured =
    input.featuredPhotoId !== undefined
      ? input.featuredPhotoId
      : existing.featuredPhotoId;
  const updated: TravelEntry = {
    ...existing,
    locationName: input.locationName ?? existing.locationName,
    startDate: input.startDate ?? existing.startDate,
    endDate: input.endDate ?? existing.endDate,
    city: input.city ?? existing.city,
    state: input.state ?? existing.state,
    country: input.country ?? existing.country,
    lat: input.lat ?? existing.lat,
    lng: input.lng ?? existing.lng,
    content: input.content ?? existing.content,
    photos: nextPhotos,
    featuredPhotoId:
      featured && nextPhotos.some((p) => p.id === featured) ? featured : undefined,
    publishedAt: input.publishedAt ?? existing.publishedAt,
    updatedAt: now,
  };
  const { resource } = await containers.trips.item(existing.id, existing.id).replace(updated);
  return resource as unknown as TravelEntry;
}

export async function deleteTravelEntry(entry: TravelEntry): Promise<void> {
  await containers.trips.item(entry.id, entry.id).delete();
}
