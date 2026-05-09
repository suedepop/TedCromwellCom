import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

async function main() {
  const artistArg = process.argv[2];
  if (!artistArg) {
    console.error("Usage: tsx scripts/list-records.ts <artist-substring>");
    process.exit(1);
  }
  const { containers } = await import("../lib/cosmos");
  const { resources } = await containers.records.items
    .query({ query: "SELECT * FROM c" })
    .fetchAll();
  const needle = artistArg.toLowerCase();
  const exact = process.argv.includes("--exact");
  const matches = (resources as any[]).filter((r) =>
    (r.artists ?? []).some((a: any) => {
      const name = (a.name ?? "").toLowerCase();
      return exact ? name === needle : name.includes(needle);
    }),
  );
  matches.sort((a, b) => (a.year ?? 0) - (b.year ?? 0));
  for (const r of matches) {
    const artists = r.artists.map((a: any) => a.name).join(" · ");
    const hasWriteUp = r.writeUp ? "✓" : " ";
    console.log(`${hasWriteUp} ${r.id}\t${r.year ?? "----"}\t${artists} — ${r.title}\t[${r.primaryFormat}]`);
  }
  console.log(`\n${matches.length} match(es).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
