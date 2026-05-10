import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

/**
 * Thin CLI wrapper around lib/maintenance.backfillSlugs.
 *   --dry-run : preview only
 */
async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const { backfillSlugs } = await import("../lib/maintenance");
  const r = await backfillSlugs({ dryRun });
  for (const line of r.log) console.log(`  ✓ ${line}`);
  console.log(
    `\nDone. concertsUpdated=${r.concertsUpdated} travelUpdated=${r.travelUpdated}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
