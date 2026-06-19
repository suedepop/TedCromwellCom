import { containers } from "./cosmos";
import { slugify } from "./slug";
import type { Coaster } from "./types";

export interface CoasterFilters {
  parkId?: string;
  country?: string;
  manufacturer?: string;
  type?: string;
  status?: string;
}

export async function listCoasters(filters: CoasterFilters = {}): Promise<Coaster[]> {
  const where: string[] = [];
  const parameters: { name: string; value: string }[] = [];
  if (filters.parkId) {
    where.push("c.parkId = @parkId");
    parameters.push({ name: "@parkId", value: filters.parkId });
  }
  if (filters.manufacturer) {
    where.push("LOWER(c.manufacturer) = @manufacturer");
    parameters.push({ name: "@manufacturer", value: filters.manufacturer.toLowerCase() });
  }
  if (filters.type) {
    where.push("c.type = @type");
    parameters.push({ name: "@type", value: filters.type });
  }
  if (filters.status) {
    where.push("c.status = @status");
    parameters.push({ name: "@status", value: filters.status });
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const { resources } = await containers.coasters.items
    .query<Coaster>({
      query: `SELECT * FROM c ${whereSql}`,
      parameters,
    })
    .fetchAll();
  resources.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
  return resources;
}

export async function getCoaster(slug: string): Promise<Coaster | null> {
  try {
    const { resource } = await containers.coasters.item(slug, slug).read<Coaster>();
    return resource ?? null;
  } catch {
    return null;
  }
}

export async function findCoasterByExternalCoasterCountId(id: number): Promise<Coaster | null> {
  const { resources } = await containers.coasters.items
    .query<Coaster>({
      query: "SELECT * FROM c WHERE c.externalIds.coasterCountId = @id",
      parameters: [{ name: "@id", value: id }],
    })
    .fetchAll();
  return resources[0] ?? null;
}

export type CoasterInput = Partial<
  Omit<Coaster, "id" | "slug" | "createdAt" | "updatedAt">
> & { name: string; parkId: string };

export async function upsertCoasterBySlug(slug: string, input: CoasterInput): Promise<Coaster> {
  const now = new Date().toISOString();
  const existing = await getCoaster(slug);
  const doc: Coaster = {
    id: slug,
    slug,
    name: input.name,
    parkId: input.parkId,
    externalIds: { ...existing?.externalIds, ...input.externalIds },
    manufacturer: input.manufacturer ?? existing?.manufacturer,
    type: input.type ?? existing?.type,
    openedYear: input.openedYear ?? existing?.openedYear,
    status: input.status ?? existing?.status,
    stats: input.stats ? { ...existing?.stats, ...input.stats } : existing?.stats,
    description: input.description ?? existing?.description,
    writeUp: input.writeUp ?? existing?.writeUp,
    coverImageUrl: input.coverImageUrl ?? existing?.coverImageUrl,
    photos: input.photos ?? existing?.photos,
    notes: input.notes ?? existing?.notes,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  const { resource } = await containers.coasters.items.upsert(doc);
  return resource as unknown as Coaster;
}

export async function deleteCoaster(slug: string): Promise<boolean> {
  try {
    await containers.coasters.item(slug, slug).delete();
    return true;
  } catch {
    return false;
  }
}

/** Slug for a coaster — disambiguates duplicates ("Big Apple" exists at many parks)
 *  by prefixing with the park slug. */
export function buildCoasterSlug(name: string, parkSlug: string): string {
  return `${parkSlug}-${slugify(name)}`.slice(0, 100);
}

// ─── External-link helpers ──────────────────────────────────────────────────

export function coasterCountCoasterUrl(id: number | undefined): string | null {
  if (!id) return null;
  return `https://coaster-count.com/coaster/${id}`;
}

export function rcdbCoasterUrl(id: number | undefined): string | null {
  if (!id) return null;
  return `https://rcdb.com/${id}.htm`;
}
