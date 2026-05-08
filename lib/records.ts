import { containers } from "./cosmos";
import type { VinylRecord } from "./types";

export async function listRecords(opts: { includeHidden?: boolean } = {}): Promise<VinylRecord[]> {
  const where = opts.includeHidden ? "" : "WHERE c.hidden != true OR NOT IS_DEFINED(c.hidden)";
  const { resources } = await containers.records.items
    .query<VinylRecord>({ query: `SELECT * FROM c ${where}` })
    .fetchAll();
  // Sort by date added desc, then by year desc as fallback
  resources.sort((a, b) => {
    const ad = a.addedToCollectionAt ?? "";
    const bd = b.addedToCollectionAt ?? "";
    if (ad !== bd) return bd.localeCompare(ad);
    return (b.year ?? 0) - (a.year ?? 0);
  });
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
  patch: Partial<Pick<VinylRecord, "notes" | "hidden">>,
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
