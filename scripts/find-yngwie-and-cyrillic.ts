import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

async function main() {
  const { containers } = await import("../lib/cosmos");

  const { resources: yngwie } = await containers.artists.items
    .query({
      query:
        "SELECT c.id, c.name, c.aliases, c.discogsArtistId, c.musicbrainzId, c.setlistFmMbid, c.description, c.imageUrl FROM c WHERE CONTAINS(LOWER(c.name), 'yngwie') OR CONTAINS(LOWER(c.id), 'yngwie') OR CONTAINS(LOWER(c.id), 'malmsteen') OR CONTAINS(LOWER(c.name), 'malmsteen')",
    })
    .fetchAll();
  console.log("=== Yngwie / Malmsteen matches ===");
  console.log(JSON.stringify(yngwie, null, 2));

  const { resources: all } = await containers.artists.items
    .query({
      query:
        "SELECT c.id, c.name, c.aliases, c.discogsArtistId, c.musicbrainzId, c.setlistFmMbid FROM c WHERE NOT IS_DEFINED(c.id) OR c.id = '' OR LENGTH(c.id) < 2",
    })
    .fetchAll();
  console.log("=== Empty / short id ===");
  console.log(JSON.stringify(all, null, 2));

  const { resources: cyr } = await containers.artists.items
    .query({
      query:
        "SELECT c.id, c.name, c.aliases, c.discogsArtistId, c.musicbrainzId, c.setlistFmMbid FROM c WHERE CONTAINS(c.name, 'Малмстин') OR CONTAINS(c.name, 'Ингви')",
    })
    .fetchAll();
  console.log("=== Cyrillic name ===");
  console.log(JSON.stringify(cyr, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
