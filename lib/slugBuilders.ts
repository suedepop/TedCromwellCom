import { containers } from "./cosmos";
import { slugify } from "./slug";
import type { Concert, Setlist, TravelEntry } from "./types";

function bandLine(setlists: Setlist[] | undefined): string {
  if (!setlists || setlists.length === 0) return "";
  return [...setlists]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((s) => s.artist)
    .filter(Boolean)
    .join(" ");
}

export function buildConcertBaseSlug(
  c: Pick<Concert, "date" | "eventName" | "setlists" | "venueNameRaw">,
): string {
  const date = (c.date ?? "").slice(0, 10);
  const title =
    (c.eventName && c.eventName.trim()) ||
    bandLine(c.setlists) ||
    c.venueNameRaw ||
    "concert";
  const combined = date ? `${date}-${title}` : title;
  return slugify(combined) || "concert";
}

export function buildTravelBaseSlug(
  t: Pick<TravelEntry, "startDate" | "locationName" | "country">,
): string {
  const date = (t.startDate ?? "").slice(0, 10);
  const title = t.locationName || t.country || "trip";
  const combined = date ? `${date}-${title}` : title;
  return slugify(combined) || "trip";
}

async function slugTaken(
  container: typeof containers.concerts | typeof containers.trips,
  slug: string,
  ignoreId?: string,
): Promise<boolean> {
  const { resources } = await container.items
    .query<{ id: string }>({
      query: "SELECT TOP 1 c.id FROM c WHERE c.slug = @slug",
      parameters: [{ name: "@slug", value: slug }],
    })
    .fetchAll();
  if (resources.length === 0) return false;
  if (ignoreId && resources[0].id === ignoreId) return false;
  return true;
}

async function ensureUnique(
  container: typeof containers.concerts | typeof containers.trips,
  base: string,
  ignoreId?: string,
): Promise<string> {
  if (!(await slugTaken(container, base, ignoreId))) return base;
  for (let n = 2; n < 100; n++) {
    const candidate = `${base}-${n}`;
    if (!(await slugTaken(container, candidate, ignoreId))) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export async function uniqueConcertSlug(
  c: Pick<Concert, "date" | "eventName" | "setlists" | "venueNameRaw">,
  ignoreId?: string,
): Promise<string> {
  return ensureUnique(containers.concerts, buildConcertBaseSlug(c), ignoreId);
}

export async function uniqueTravelSlug(
  t: Pick<TravelEntry, "startDate" | "locationName" | "country">,
  ignoreId?: string,
): Promise<string> {
  return ensureUnique(containers.trips, buildTravelBaseSlug(t), ignoreId);
}
