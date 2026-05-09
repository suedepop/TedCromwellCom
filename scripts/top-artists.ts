import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

async function main() {
  const { containers } = await import("../lib/cosmos");
  const { resources } = await containers.records.items
    .query({ query: "SELECT * FROM c" })
    .fetchAll();
  const counts = new Map<string, { total: number; written: number }>();
  for (const r of resources as any[]) {
    const primary = r.artists?.[0]?.name ?? "(unknown)";
    const cur = counts.get(primary) ?? { total: 0, written: 0 };
    cur.total += 1;
    if (r.writeUp) cur.written += 1;
    counts.set(primary, cur);
  }
  const sorted = [...counts.entries()]
    .filter(([, v]) => v.written < v.total) // still has unwritten records
    .sort((a, b) => (b[1].total - b[1].written) - (a[1].total - a[1].written));
  const limit = Number(process.argv[2]) || 30;
  console.log("Artist\tTotal\tWritten\tRemaining");
  let totalRemaining = 0;
  for (const [name, v] of sorted.slice(0, limit)) {
    console.log(`${name}\t${v.total}\t${v.written}\t${v.total - v.written}`);
  }
  for (const [, v] of sorted) totalRemaining += v.total - v.written;
  console.log(`\n${sorted.length} artists with unwritten records · ${totalRemaining} records remaining total`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
