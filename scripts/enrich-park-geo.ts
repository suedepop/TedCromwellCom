/**
 * Geocode parks via Nominatim (OpenStreetMap) and fill in missing lat/lng.
 *
 * For each park that doesn't already have coords, build a query like
 * "<park name> <city> <country>", call Nominatim, and save the first
 * result if the latitude/longitude look sane. Polite — 1.1s between
 * queries (Nominatim's free tier asks for ≤1 req/sec).
 *
 * Idempotent: parks already containing lat/lng are skipped. Run again
 * with --force to overwrite. --dry-run prints proposed changes without
 * saving.
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
  class?: string;
}

async function nominatim(query: string): Promise<NominatimResult | null> {
  const u = new URL("https://nominatim.openstreetmap.org/search");
  u.searchParams.set("q", query);
  u.searchParams.set("format", "json");
  u.searchParams.set("limit", "1");
  const res = await fetch(u.toString(), {
    headers: {
      "User-Agent": "TedCromwellCom park geocoder (https://www.tedcromwell.com)",
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error(`nominatim ${res.status}`);
  const arr = (await res.json()) as NominatimResult[];
  return arr[0] ?? null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const force = process.argv.includes("--force");
  const { containers } = await import("../lib/cosmos");
  const { listParks, upsertParkBySlug } = await import("../lib/parks");

  const parks = await listParks();
  const todo = parks.filter(
    (p) =>
      force ||
      typeof p.lat !== "number" ||
      typeof p.lng !== "number" ||
      Number.isNaN(p.lat) ||
      Number.isNaN(p.lng),
  );

  console.log(
    `${todo.length} of ${parks.length} parks need geocoding (mode: ${dryRun ? "dry-run" : "live"}${force ? " --force" : ""})`,
  );

  let filled = 0;
  let skipped = 0;
  let failed = 0;

  /**
   * Clean park name for geocoding. coaster-count's defunct/relocated marker
   * is a trailing asterisk; "Walt Disney World - Magic Kingdom" reads better
   * as the part AFTER the dash since that's the indexed entity in OSM.
   */
  function cleanForQuery(raw: string): string {
    let s = raw.replace(/\*+$/, "").trim();
    // For "Parent - Child" style names, the child is usually the geocodable
    // entity (e.g. "Disney's Animal Kingdom" not "Walt Disney World").
    const dash = s.lastIndexOf(" - ");
    if (dash > 0) s = s.slice(dash + 3).trim();
    return s;
  }

  /** Sanity check: a match must land in the right country AND — for parks
   *  that have a city or state recorded — within that city or state. This
   *  catches "Wonderpark, United States" matching a Montana entity when the
   *  real park is in Cincinnati. */
  function looksRight(
    park: { country?: string; city?: string; state?: string },
    label: string,
    isLooseQuery: boolean,
  ): boolean {
    const l = label.toLowerCase();
    if (park.country) {
      const c = park.country.toLowerCase();
      const aliases: Record<string, string[]> = {
        "united states": ["united states", "usa"],
        "united kingdom": ["united kingdom", "uk", "england", "scotland", "wales"],
        canada: ["canada"],
        poland: ["poland"],
      };
      const list = aliases[c] ?? [c];
      if (!list.some((a) => l.includes(a))) return false;
    }
    // For a fallback query that dropped city/state, require the match
    // string to still contain the original city or state.
    if (isLooseQuery && (park.city || park.state)) {
      const tokens = [park.city, park.state].filter(Boolean).map((t) => t!.toLowerCase());
      if (!tokens.some((t) => l.includes(t))) return false;
    }
    return true;
  }

  for (const park of todo) {
    const cleanName = cleanForQuery(park.name);
    const tightQueries = [
      [cleanName, park.city, park.state, park.country].filter(Boolean).join(", "),
      [cleanName, park.city, park.country].filter(Boolean).join(", "),
    ];
    const looseQueries = [
      [cleanName, park.country].filter(Boolean).join(", "),
      cleanName,
    ];
    const queryPlan: { q: string; loose: boolean }[] = [
      ...tightQueries.filter(Boolean).map((q) => ({ q, loose: false })),
      ...looseQueries.filter(Boolean).map((q) => ({ q, loose: true })),
    ];
    process.stdout.write(`  ${park.slug}: `);

    let hit: NominatimResult | null = null;
    let usedQuery = "";
    try {
      for (const { q, loose } of queryPlan) {
        if (!q) continue;
        const candidate = await nominatim(q);
        await sleep(1100);
        if (candidate && looksRight(park, candidate.display_name, loose)) {
          hit = candidate;
          usedQuery = q;
          break;
        }
      }
    } catch (err) {
      console.log(`ERROR ${(err as Error).message}`);
      failed++;
      continue;
    }

    if (!hit) {
      console.log(`NO MATCH`);
      failed++;
      continue;
    }

    const lat = parseFloat(hit.lat);
    const lng = parseFloat(hit.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      console.log(`bad coords`);
      failed++;
      continue;
    }
    console.log(`${lat.toFixed(4)},${lng.toFixed(4)} (q="${usedQuery}") ${dryRun ? "[dry]" : ""}`);
    if (!dryRun) {
      await upsertParkBySlug(park.slug, {
        ...park,
        lat,
        lng,
      });
    }
    filled++;
  }

  skipped = parks.length - todo.length;
  console.log("");
  console.log(`Done. filled=${filled} failed=${failed} alreadyHadGeo=${skipped}`);
  // Suppress unused-warning on containers without removing the import
  void containers;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
