import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const { containers } = await import("../lib/cosmos");
  const { getStoredArtist } = await import("../lib/artists");

  const cyrillicId = "11118d90-39d3-48b6-90a3-196cd884d5c3";
  const cyrillicName = "Ингви Малмстин";
  const canonicalSlug = "yngwie-j-malmsteen";

  const target = await getStoredArtist(canonicalSlug);
  if (!target) {
    console.error(`Canonical artist '${canonicalSlug}' not found.`);
    process.exit(1);
  }

  const aliases = new Set(target.aliases ?? []);
  const hadAlias = aliases.has(cyrillicName);
  aliases.add(cyrillicName);

  console.log(`Target: ${target.name} (${target.slug})`);
  console.log(`Existing aliases: ${[...(target.aliases ?? [])].join(", ") || "(none)"}`);
  console.log(`Adding alias: '${cyrillicName}' ${hadAlias ? "(already present)" : "(new)"}`);

  const { resources: records } = await containers.records.items
    .query({
      query:
        "SELECT c.id, c.title, c.artists FROM c WHERE ARRAY_CONTAINS(c.artists, { name: @n }, true)",
      parameters: [{ name: "@n", value: cyrillicName }],
    })
    .fetchAll();
  console.log(`Records using '${cyrillicName}': ${records.length}`);
  for (const r of records.slice(0, 5)) {
    console.log(`  - ${r.id}: ${r.title}`);
  }

  if (dryRun) {
    console.log("\n[dry run] No changes written.");
    return;
  }

  if (!hadAlias) {
    const updated = {
      ...target,
      aliases: [...aliases],
      updatedAt: new Date().toISOString(),
    };
    await containers.artists.item(canonicalSlug, canonicalSlug).replace(updated);
    console.log(`✓ Updated ${canonicalSlug} with new alias.`);
  }

  try {
    await containers.artists.item(cyrillicId, cyrillicId).delete();
    console.log(`✓ Deleted stray doc ${cyrillicId}.`);
  } catch (err) {
    console.error(`✗ Failed to delete ${cyrillicId}:`, err);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
