import { randomUUID } from "node:crypto";
import { containers } from "./cosmos";
import type { Venue, Concert } from "./types";

export async function listVenues(): Promise<Venue[]> {
  const { resources } = await containers.venues.items
    .query<Venue>({ query: "SELECT * FROM c ORDER BY c.canonicalName" })
    .fetchAll();
  return resources;
}

export async function getVenue(id: string): Promise<Venue | null> {
  try {
    const { resource } = await containers.venues.item(id, id).read<Venue>();
    return resource ?? null;
  } catch {
    return null;
  }
}

export async function findVenueByAlias(rawName: string): Promise<Venue | null> {
  const normalized = rawName.trim();
  const { resources } = await containers.venues.items
    .query<Venue>({
      query:
        "SELECT * FROM c WHERE c.canonicalName = @n OR ARRAY_CONTAINS(c.aliases, @n)",
      parameters: [{ name: "@n", value: normalized }],
    })
    .fetchAll();
  return resources[0] ?? null;
}

export interface VenueCreateInput {
  canonicalName: string;
  city: string;
  state?: string;
  country: string;
  aliases?: string[];
  lat?: number;
  lng?: number;
  url?: string;
  notes?: string;
}

export async function createVenue(input: VenueCreateInput): Promise<Venue> {
  const venue: Venue = {
    id: randomUUID(),
    canonicalName: input.canonicalName,
    city: input.city,
    state: input.state,
    country: input.country,
    aliases: input.aliases ?? [input.canonicalName],
    lat: input.lat,
    lng: input.lng,
    url: input.url,
    notes: input.notes,
  };
  const { resource } = await containers.venues.items.create(venue);
  return resource as Venue;
}

export async function updateVenue(id: string, patch: Partial<Venue>): Promise<Venue | null> {
  const existing = await getVenue(id);
  if (!existing) return null;
  const updated: Venue = { ...existing, ...patch, id: existing.id };
  const { resource } = await containers.venues.item(id, id).replace(updated);
  return resource as Venue;
}

export async function splitAliasToNewVenue(
  fromVenueId: string,
  alias: string,
): Promise<{ newVenue: Venue; updatedSource: Venue; movedConcerts: number } | null> {
  const source = await getVenue(fromVenueId);
  if (!source) return null;
  const trimmed = alias.trim();
  if (!trimmed) return null;

  // 1. Create a new venue inheriting city/state/country from the source
  const newVenue = await createVenue({
    canonicalName: trimmed,
    city: source.city,
    state: source.state,
    country: source.country,
    aliases: [trimmed],
  });

  // 2. Move concerts whose venueNameRaw matches the alias
  const { resources: matchingConcerts } = await containers.concerts.items
    .query<Concert>({
      query:
        "SELECT * FROM c WHERE c.venueId = @vid AND (LOWER(c.venueNameRaw) = LOWER(@alias) OR LOWER(c.venueNameRaw) = LOWER(@aliasNoT))",
      parameters: [
        { name: "@vid", value: fromVenueId },
        { name: "@alias", value: trimmed },
        // account for minor whitespace diffs by also trying a normalized form
        { name: "@aliasNoT", value: trimmed.replace(/\s+/g, " ") },
      ],
    })
    .fetchAll();

  for (const concert of matchingConcerts) {
    await containers.concerts.item(concert.id, concert.venueId).delete();
    const moved: Concert = {
      ...concert,
      pk: newVenue.id,
      venueId: newVenue.id,
      updatedAt: new Date().toISOString(),
    };
    await containers.concerts.items.create(moved);
  }

  // 3. Remove the alias from the source venue (case-insensitive)
  const filteredAliases = source.aliases.filter(
    (a) => a.trim().toLowerCase() !== trimmed.toLowerCase(),
  );
  const updatedSource = await updateVenue(source.id, { aliases: filteredAliases });

  return {
    newVenue,
    updatedSource: updatedSource ?? source,
    movedConcerts: matchingConcerts.length,
  };
}

export async function mergeVenues(keepId: string, mergeId: string): Promise<Venue | null> {
  const [keep, merge] = await Promise.all([getVenue(keepId), getVenue(mergeId)]);
  if (!keep || !merge) return null;

  const mergedAliases = Array.from(
    new Set([...keep.aliases, ...merge.aliases, merge.canonicalName]),
  );
  const updated: Venue = { ...keep, aliases: mergedAliases };

  const { resources: concertsToMove } = await containers.concerts.items
    .query<Concert>({
      query: "SELECT * FROM c WHERE c.venueId = @mergeId",
      parameters: [{ name: "@mergeId", value: mergeId }],
    })
    .fetchAll();

  for (const concert of concertsToMove) {
    await containers.concerts.item(concert.id, concert.venueId).delete();
    const moved: Concert = {
      ...concert,
      pk: keep.id,
      venueId: keep.id,
      updatedAt: new Date().toISOString(),
    };
    await containers.concerts.items.create(moved);
  }

  await containers.venues.item(merge.id, merge.id).delete();
  const { resource } = await containers.venues.item(keep.id, keep.id).replace(updated);
  return resource as Venue;
}
