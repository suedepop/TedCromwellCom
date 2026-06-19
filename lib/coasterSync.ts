/**
 * Pull the user's ridden list from coaster-count.com and upsert parks +
 * coasters into Cosmos.
 *
 * coaster-count is a JavaScript-driven SPA: there are no per-park or
 * per-coaster detail URLs reachable anonymously, so the index page is the
 * only data source. Each parsed entry yields:
 *   { country, parkId, parkName, coasterId, coasterName }
 *
 * The sync does ONE HTTP request total. Per-park geo and per-coaster stats
 * have to come from elsewhere (RCDB via the park editor, or manual entry).
 */
import {
  fetchRiddenIndex,
  parseRiddenIndex,
  type RiddenEntry,
} from "./coasterCount";
import {
  buildCoasterSlug,
  findCoasterByExternalCoasterCountId,
  upsertCoasterBySlug,
} from "./coasters";
import {
  buildParkSlug,
  findParkByExternalCoasterCountId,
  upsertParkBySlug,
} from "./parks";

/** Default user id — the site owner's coaster-count account. */
export const DEFAULT_COASTER_COUNT_USER_ID = 6972;

export interface SyncOptions {
  userId?: number;
  dryRun?: boolean;
}

export interface SyncResult {
  ok: boolean;
  userId: number;
  totalEntries: number;
  parksAdded: number;
  parksUpdated: number;
  parksUntouched: number;
  coastersAdded: number;
  coastersUpdated: number;
  coastersUntouched: number;
  countries: string[];
  log: string[];
  dryRun?: boolean;
  error?: string;
}

/**
 * coaster-count park labels look like "Energylandia - Zator". The trailing
 * " - <city>" is the location; split it off so the stored park name reads
 * cleanly. If there's no " - " (e.g. "Williams Grove Amusement Park"), keep
 * the name as-is and leave city unset.
 */
export function splitParkLabel(label: string): { name: string; city?: string } {
  const trimmed = label.trim();
  const idx = trimmed.lastIndexOf(" - ");
  if (idx < 0) return { name: trimmed };
  const name = trimmed.slice(0, idx).trim();
  const city = trimmed.slice(idx + 3).trim();
  if (!name || !city) return { name: trimmed };
  return { name, city };
}

interface ParkAccumulator {
  parkId: number;
  label: string;
  country: string;
  coasterIds: Set<number>;
}

/**
 * Group entries by park id so we touch each park exactly once during the
 * upsert pass.
 */
function groupByPark(entries: RiddenEntry[]): Map<number, ParkAccumulator> {
  const byPark = new Map<number, ParkAccumulator>();
  for (const e of entries) {
    if (e.parkId == null) continue;
    let acc = byPark.get(e.parkId);
    if (!acc) {
      acc = {
        parkId: e.parkId,
        label: e.parkName,
        country: e.country,
        coasterIds: new Set(),
      };
      byPark.set(e.parkId, acc);
    }
    acc.coasterIds.add(e.coasterId);
  }
  return byPark;
}

export async function syncCoastersFromCoasterCount(
  opts: SyncOptions = {},
): Promise<SyncResult> {
  const userId = opts.userId ?? DEFAULT_COASTER_COUNT_USER_ID;
  const dryRun = !!opts.dryRun;
  const log: string[] = [];

  const result: SyncResult = {
    ok: true,
    userId,
    totalEntries: 0,
    parksAdded: 0,
    parksUpdated: 0,
    parksUntouched: 0,
    coastersAdded: 0,
    coastersUpdated: 0,
    coastersUntouched: 0,
    countries: [],
    log,
    dryRun: dryRun || undefined,
  };

  let html: string;
  try {
    html = await fetchRiddenIndex(userId);
  } catch (err) {
    result.ok = false;
    result.error = err instanceof Error ? err.message : String(err);
    log.push(`fetch failed: ${result.error}`);
    return result;
  }

  const entries = parseRiddenIndex(html);
  result.totalEntries = entries.length;
  result.countries = Array.from(new Set(entries.map((e) => e.country).filter(Boolean))).sort();
  log.push(`parsed ${entries.length} entries across ${result.countries.length} countries`);

  if (entries.length === 0) {
    log.push("nothing to sync");
    return result;
  }

  // ─── Parks ─────────────────────────────────────────────────────────────
  const parkGroups = groupByPark(entries);
  log.push(`grouped into ${parkGroups.size} unique parks`);

  // parkId → resolved slug (so coasters can attach by parkId == slug)
  const parkSlugById = new Map<number, string>();

  for (const acc of parkGroups.values()) {
    const { name, city } = splitParkLabel(acc.label);

    const existing = await findParkByExternalCoasterCountId(acc.parkId);
    const slug = existing?.slug ?? buildParkSlug(name);
    parkSlugById.set(acc.parkId, slug);

    if (existing) {
      // Only update fields that materially changed. Don't clobber admin edits.
      const changes: string[] = [];
      if (!existing.country && acc.country) changes.push("country");
      if (!existing.city && city) changes.push("city");
      if (changes.length === 0) {
        result.parksUntouched++;
        continue;
      }
      log.push(`update park ${slug}: ${changes.join("+")} `);
      if (!dryRun) {
        await upsertParkBySlug(slug, {
          name: existing.name, // preserve admin's name choice
          country: existing.country || acc.country,
          city: existing.city || city,
          externalIds: { coasterCountId: acc.parkId },
        });
      }
      result.parksUpdated++;
      continue;
    }

    log.push(`new park ${slug} (cc:${acc.parkId})`);
    if (!dryRun) {
      await upsertParkBySlug(slug, {
        name,
        country: acc.country || "Unknown",
        city,
        externalIds: { coasterCountId: acc.parkId },
      });
    }
    result.parksAdded++;
  }

  // ─── Coasters ──────────────────────────────────────────────────────────
  for (const e of entries) {
    const parkSlug = parkSlugById.get(e.parkId ?? -1);
    if (!parkSlug) {
      log.push(`skip coaster ${e.coasterId} (${e.coasterName}) — no park slug`);
      continue;
    }

    const existing = await findCoasterByExternalCoasterCountId(e.coasterId);
    const slug = existing?.slug ?? buildCoasterSlug(e.coasterName, parkSlug);

    if (existing) {
      // Coaster docs are mostly authored manually post-sync — leave them alone
      // unless something basic is missing.
      const changes: string[] = [];
      if (!existing.name) changes.push("name");
      if (!existing.parkId) changes.push("parkId");
      if (changes.length === 0) {
        result.coastersUntouched++;
        continue;
      }
      log.push(`update coaster ${slug}: ${changes.join("+")}`);
      if (!dryRun) {
        await upsertCoasterBySlug(slug, {
          name: existing.name || e.coasterName,
          parkId: existing.parkId || parkSlug,
          externalIds: { coasterCountId: e.coasterId },
        });
      }
      result.coastersUpdated++;
      continue;
    }

    log.push(`new coaster ${slug} (cc:${e.coasterId}) → ${parkSlug}`);
    if (!dryRun) {
      await upsertCoasterBySlug(slug, {
        name: e.coasterName,
        parkId: parkSlug,
        externalIds: { coasterCountId: e.coasterId },
      });
    }
    result.coastersAdded++;
  }

  log.push(
    `done. parks: +${result.parksAdded} ~${result.parksUpdated} =${result.parksUntouched}` +
      ` · coasters: +${result.coastersAdded} ~${result.coastersUpdated} =${result.coastersUntouched}`,
  );

  return result;
}
