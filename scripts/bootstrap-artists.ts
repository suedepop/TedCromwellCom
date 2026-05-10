import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

/**
 * Thin CLI wrapper around lib/maintenance.bootstrapArtists.
 * Re-running is safe: existing Artist docs are not overwritten.
 *   --dry-run        : preview only
 *   --refill-discogs : also fill missing Discogs IDs on existing docs
 */
async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const refillDiscogs = process.argv.includes("--refill-discogs");
  const { bootstrapArtists } = await import("../lib/maintenance");
  const r = await bootstrapArtists({ dryRun, refillDiscogs });
  for (const line of r.log) console.log(`✓ ${line}`);
  console.log(
    `\nDone. created=${r.created} updated=${r.updated} skipped=${r.skipped} totalSeen=${r.totalSeen}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
