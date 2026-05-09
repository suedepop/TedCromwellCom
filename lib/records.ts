import { containers } from "./cosmos";
import type { VinylRecord } from "./types";

export type RecordSort = "artist" | "added" | "year";

export async function listRecords(
  opts: { includeHidden?: boolean; sort?: RecordSort } = {},
): Promise<VinylRecord[]> {
  const where = opts.includeHidden ? "" : "WHERE c.hidden != true OR NOT IS_DEFINED(c.hidden)";
  const { resources } = await containers.records.items
    .query<VinylRecord>({ query: `SELECT * FROM c ${where}` })
    .fetchAll();
  const sort = opts.sort ?? "artist";
  if (sort === "added") {
    resources.sort((a, b) => {
      const ad = a.addedToCollectionAt ?? "";
      const bd = b.addedToCollectionAt ?? "";
      if (ad !== bd) return bd.localeCompare(ad);
      return (b.year ?? 0) - (a.year ?? 0);
    });
  } else if (sort === "year") {
    resources.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  } else {
    // "artist" — primary artist name asc, then release year desc, then title asc
    resources.sort((a, b) => {
      const an = (a.artists[0]?.name ?? "").toLowerCase();
      const bn = (b.artists[0]?.name ?? "").toLowerCase();
      if (an !== bn) return an.localeCompare(bn, undefined, { sensitivity: "base" });
      const ay = a.year ?? 0;
      const by = b.year ?? 0;
      if (ay !== by) return by - ay;
      return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
    });
  }
  return resources;
}

export async function getRecord(id: string): Promise<VinylRecord | null> {
  try {
    const { resource } = await containers.records.item(id, id).read<VinylRecord>();
    return resource ?? null;
  } catch {
    return null;
  }
}

export async function findRecordBySlug(slug: string): Promise<VinylRecord | null> {
  const { resources } = await containers.records.items
    .query<VinylRecord>({
      query: "SELECT * FROM c WHERE c.slug = @slug",
      parameters: [{ name: "@slug", value: slug }],
    })
    .fetchAll();
  return resources[0] ?? null;
}

export async function findRecordBySlugOrId(value: string): Promise<VinylRecord | null> {
  return (await findRecordBySlug(value)) ?? getRecord(value);
}

export async function updateRecord(
  id: string,
  patch: Partial<Pick<VinylRecord, "notes" | "writeUp" | "hidden">>,
): Promise<VinylRecord | null> {
  const existing = await getRecord(id);
  if (!existing) return null;
  const updated: VinylRecord = {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  const { resource } = await containers.records.item(id, id).replace(updated);
  return resource as unknown as VinylRecord;
}

export async function deleteRecord(id: string): Promise<boolean> {
  try {
    await containers.records.item(id, id).delete();
    return true;
  } catch {
    return false;
  }
}
