import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

/**
 * Rank stored artists by combined activity (concerts + records).
 * Filters to ones still missing a description so we can prioritize the
 * most-impactful descriptions to write first.
 */
async function main() {
  const limit = Number(process.argv[2]) || 60;
  const includeDescribed = process.argv.includes("--include-described");
  const { listArtists } = await import("../lib/artists");

  const all = await listArtists();
  const candidates = all
    .filter((a) => includeDescribed || !a.stored?.description)
    .map((a) => ({
      slug: a.slug,
      name: a.name,
      concerts: a.concerts.length,
      records: a.records.length,
      total: a.concerts.length + a.records.length,
      hasMb: !!a.stored?.musicbrainzId,
      hasDiscogs: !!a.stored?.discogsArtistId,
    }))
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));

  console.log("Slug\tName\tConcerts\tRecords\tTotal\tMB\tDiscogs");
  for (const a of candidates.slice(0, limit)) {
    console.log(
      `${a.slug}\t${a.name}\t${a.concerts}\t${a.records}\t${a.total}\t${a.hasMb ? "✓" : ""}\t${a.hasDiscogs ? "✓" : ""}`,
    );
  }
  console.log(`\n${candidates.length} candidates without descriptions; showing top ${Math.min(limit, candidates.length)}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
