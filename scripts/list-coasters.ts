import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

async function main() {
  const { containers } = await import("../lib/cosmos");

  const { resources: parks } = await containers.parks.items
    .query<{ slug: string; name: string; country: string; city?: string }>(
      "SELECT c.slug, c.name, c.country, c.city FROM c",
    )
    .fetchAll();
  const parksBySlug = new Map(parks.map((p) => [p.slug, p]));

  const { resources: coasters } = await containers.coasters.items
    .query<{
      slug: string;
      name: string;
      parkId: string;
      description?: string;
      manufacturer?: string;
      openedYear?: number;
    }>("SELECT c.slug, c.name, c.parkId, c.description, c.manufacturer, c.openedYear FROM c")
    .fetchAll();

  const want = process.argv.includes("--missing-desc")
    ? coasters.filter((c) => !c.description)
    : coasters;

  console.log(`Slug\tCoaster\tPark\tCountry\tHasDesc`);
  for (const c of want.sort((a, b) => a.slug.localeCompare(b.slug))) {
    const park = parksBySlug.get(c.parkId);
    console.log(
      `${c.slug}\t${c.name}\t${park?.name ?? c.parkId}\t${park?.country ?? "?"}\t${c.description ? "Y" : "N"}`,
    );
  }
  console.log("");
  console.log(
    `${parks.length} parks · ${coasters.length} coasters · ${coasters.filter((c) => c.description).length} have descriptions, ${coasters.filter((c) => !c.description).length} don't`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
