import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

async function main() {
  const { containers } = await import("../lib/cosmos");
  const { uniqueConcertSlug, uniqueTravelSlug } = await import("../lib/slugBuilders");
  const concertsModule = await import("../lib/concerts");
  const { listTravelEntries } = await import("../lib/travel");

  console.log("→ Backfilling concert slugs…");
  // listConcerts already filters by activity; just iterate everything in the container
  const { resources: concerts } = await containers.concerts.items
    .query({ query: "SELECT * FROM c" })
    .fetchAll();

  let concertCount = 0;
  for (const c of concerts as any[]) {
    if (c.slug) continue;
    const slug = await uniqueConcertSlug(c, c.id);
    await containers.concerts.item(c.id, c.venueId).replace({ ...c, slug });
    concertCount += 1;
    console.log(`  ✓ ${c.date} ${slug}`);
  }
  console.log(`  Updated ${concertCount} concerts`);

  console.log("→ Backfilling travel-entry slugs…");
  const trips = await listTravelEntries();
  let travelCount = 0;
  for (const t of trips) {
    if (t.slug) continue;
    const slug = await uniqueTravelSlug(t, t.id);
    await containers.trips.item(t.id, t.id).replace({ ...t, slug });
    travelCount += 1;
    console.log(`  ✓ ${t.startDate} ${slug}`);
  }
  console.log(`  Updated ${travelCount} travel entries`);

  // Silence unused import warning
  void concertsModule;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
