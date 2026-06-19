import { containers } from "./cosmos";
import { memo } from "./memo";
import { slugify } from "./slug";
import type { Park } from "./types";

export async function listParks(): Promise<Park[]> {
  const { resources } = await containers.parks.items
    .query<Park>({ query: "SELECT * FROM c" })
    .fetchAll();
  resources.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
  return resources;
}

export async function getPark(slug: string): Promise<Park | null> {
  try {
    const { resource } = await containers.parks.item(slug, slug).read<Park>();
    return resource ?? null;
  } catch {
    return null;
  }
}

export async function findParkByExternalCoasterCountId(id: number): Promise<Park | null> {
  const { resources } = await containers.parks.items
    .query<Park>({
      query: "SELECT * FROM c WHERE c.externalIds.coasterCountId = @id",
      parameters: [{ name: "@id", value: id }],
    })
    .fetchAll();
  return resources[0] ?? null;
}

export type ParkInput = Partial<
  Omit<Park, "id" | "slug" | "createdAt" | "updatedAt">
> & { name: string; country: string };

export async function upsertParkBySlug(slug: string, input: ParkInput): Promise<Park> {
  const now = new Date().toISOString();
  const existing = await getPark(slug);
  const doc: Park = {
    id: slug,
    slug,
    name: input.name,
    aliases: input.aliases ?? existing?.aliases,
    city: input.city ?? existing?.city,
    state: input.state ?? existing?.state,
    country: input.country,
    lat: input.lat ?? existing?.lat,
    lng: input.lng ?? existing?.lng,
    url: input.url ?? existing?.url,
    externalIds: { ...existing?.externalIds, ...input.externalIds },
    description: input.description ?? existing?.description,
    imageUrl: input.imageUrl ?? existing?.imageUrl,
    notes: input.notes ?? existing?.notes,
    closed: input.closed ?? existing?.closed,
    closedYear: input.closedYear ?? existing?.closedYear,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  const { resource } = await containers.parks.items.upsert(doc);
  return resource as unknown as Park;
}

export async function deletePark(slug: string): Promise<boolean> {
  try {
    await containers.parks.item(slug, slug).delete();
    return true;
  } catch {
    return false;
  }
}

export function buildParkSlug(name: string): string {
  return slugify(name);
}

// ─── Aggregate helpers (with park → coaster counts) ─────────────────────────

export interface ParkAggregate {
  park: Park;
  coasterCount: number;
}

async function buildParkAggregates(): Promise<ParkAggregate[]> {
  const parks = await listParks();
  const { resources: counts } = await containers.coasters.items
    .query<{ parkId: string; count: number }>({
      query: "SELECT c.parkId, COUNT(1) AS count FROM c GROUP BY c.parkId",
    })
    .fetchAll();
  const countByPark = new Map(counts.map((c) => [c.parkId, c.count]));
  return parks.map((park) => ({ park, coasterCount: countByPark.get(park.id) ?? 0 }));
}

// 60s cache — same TTL as artists buildIndex.
export const listParkAggregates = memo(buildParkAggregates, 60_000, "parks:aggregates");

// ─── External-link helpers ──────────────────────────────────────────────────

export function coasterCountParkUrl(id: number | undefined): string | null {
  if (!id) return null;
  return `https://coaster-count.com/park/${id}`;
}

export function rcdbParkUrl(id: number | undefined): string | null {
  if (!id) return null;
  return `https://rcdb.com/${id}.htm`;
}
