import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

async function main() {
  const filterArg = process.argv[2]; // "size:2" or "size:1"
  const { containers } = await import("../lib/cosmos");
  const { resources } = await containers.records.items
    .query({ query: "SELECT * FROM c" })
    .fetchAll();

  const byArtist = new Map<string, any[]>();
  for (const r of resources as any[]) {
    if (r.writeUp) continue;
    const primary = r.artists?.[0]?.name ?? "(unknown)";
    if (primary.toLowerCase().startsWith("various")) continue;
    const arr = byArtist.get(primary) ?? [];
    arr.push(r);
    byArtist.set(primary, arr);
  }

  const sorted = [...byArtist.entries()].sort((a, b) => b[1].length - a[1].length);
  for (const [artist, records] of sorted) {
    if (filterArg === "size:2" && records.length !== 2) continue;
    if (filterArg === "size:1" && records.length !== 1) continue;
    if (filterArg === "size:3+" && records.length < 3) continue;
    console.log(`\n# ${artist} (${records.length})`);
    records.sort((a, b) => (a.year ?? 0) - (b.year ?? 0));
    for (const r of records) {
      console.log(`${r.id}\t${r.year ?? "----"}\t${r.title}\t[${r.primaryFormat}]`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
