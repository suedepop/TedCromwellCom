import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

/**
 * Thin CLI wrapper around lib/maintenance.verifyConnections.
 */
async function main() {
  const { verifyConnections } = await import("../lib/maintenance");
  const r = await verifyConnections();
  console.log("→ Cosmos containers");
  for (const c of r.cosmos) {
    const tag = c.ok ? "✓" : "✗";
    const pk = c.partitionKey ? ` partitionKey=${JSON.stringify(c.partitionKey)}` : "";
    const err = c.error ? ` ${c.error}` : "";
    console.log(`  ${tag} ${c.name}${pk}${err}`);
  }
  console.log("→ Blob containers");
  for (const b of r.blob) {
    const tag = b.ok ? "✓" : "✗";
    const err = b.error ? ` ${b.error}` : "";
    console.log(`  ${tag} ${b.name}${err}`);
  }
  if (r.storage) console.log(`→ Storage kind: ${r.storage.kind}, sku: ${r.storage.sku}`);
  if (r.database) console.log(`→ Cosmos database id: ${r.database}`);
  if (!r.ok) {
    console.error("Some checks failed.");
    process.exit(1);
  }
  console.log("All checks passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
