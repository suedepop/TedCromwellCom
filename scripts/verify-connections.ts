import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

async function main() {
  const { cosmosClient, containers } = await import("../lib/cosmos");
  const { blobService, container: blobContainer } = await import("../lib/blob");

  console.log("→ Cosmos: reading containers");
  for (const [name, c] of Object.entries(containers)) {
    const { resource } = await c.read();
    console.log(`  ✓ ${name}: partitionKey=${JSON.stringify(resource?.partitionKey?.paths)}`);
  }

  console.log("→ Blob: checking containers");
  for (const name of ["photos", "stubs", "blog", "travel", "resume"] as const) {
    const exists = await blobContainer(name).exists();
    console.log(`  ${exists ? "✓" : "✗"} ${name}`);
  }

  const accountInfo = await blobService.getAccountInfo();
  console.log(`→ Storage kind: ${accountInfo.accountKind}, sku: ${accountInfo.skuName}`);

  const { resource: dbRes } = await cosmosClient
    .database(process.env.COSMOS_DATABASE ?? "tedcromwell")
    .read();
  console.log(`→ Cosmos database id: ${dbRes?.id}`);

  console.log("All checks passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
