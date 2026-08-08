/**
 * Populate artist.discography from MusicBrainz release-groups for every
 * artist that has a MB ID. Cross-links each release to the user's own
 * /vinyl/<slug> when we can fuzzy-match title + year.
 *
 * Fetch strategy:
 *   1) For each artist with musicbrainzId: fetch release-groups (paginated).
 *   2) Convert MB primary-type + secondary-types → DiscographyReleaseType.
 *   3) Extract year from "first-release-date" ("1985", "1985-04", "1985-04-08").
 *   4) Match against user's records by normalized title + year (±1 year).
 *
 * Rate limit: 1.1s between MB fetches per artist. Artists with paginated
 * discographies (>100 release-groups) internally space at 1.1s too.
 *
 * Idempotent: skips artists that already have a non-empty discography
 * unless --force. Supports --dry-run, --limit, --slug.
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

const MB_DELAY_MS = 1100;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Normalization for title matching ───────────────────────────────────

/** Fold to a canonical comparable form: strip punctuation and whitespace,
 *  lowercase. "Sgt. Pepper's Lonely Hearts Club Band" and
 *  "Sgt Peppers Lonely Hearts Club Band" both collapse to
 *  "sgtpepperslonelyheartsclubband". */
function normTitle(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Parse "1985", "1985-04", "1985-04-08", or "" into a year number or undefined. */
function yearFromMbDate(d: string | undefined): number | undefined {
  if (!d) return undefined;
  const m = d.match(/^(\d{4})/);
  return m ? Number(m[1]) : undefined;
}

/** Map MusicBrainz's primary-type + secondary-types into our narrower
 *  DiscographyReleaseType. Prefers secondary types when present so a
 *  "Live" album shows up under Live rather than under Album. */
function classifyType(
  primary: string | null | undefined,
  secondaries: string[] | undefined,
): import("../lib/types").DiscographyReleaseType {
  const sec = new Set((secondaries ?? []).map((s) => s.toLowerCase()));
  if (sec.has("live")) return "Live";
  if (sec.has("compilation")) return "Compilation";
  if (sec.has("soundtrack")) return "Soundtrack";
  if (sec.has("remix")) return "Remix";
  if (sec.has("broadcast")) return "Broadcast";
  if (sec.has("demo")) return "Demo";
  if (sec.has("mixtape/street")) return "Other";
  const p = (primary ?? "").toLowerCase();
  if (p === "album") return "Album";
  if (p === "ep") return "EP";
  if (p === "single") return "Single";
  return "Other";
}

// ─── Owned-record index for cross-linking ────────────────────────────────

interface OwnedIndex {
  // norm(title) → array of { slug, year } (an album can have multiple
  // pressings, each their own record slug — we cross-link to any that
  // matches on year).
  byTitle: Map<string, { slug: string; year?: number }[]>;
}

async function buildOwnedIndex(): Promise<OwnedIndex> {
  const { containers } = await import("../lib/cosmos");
  const { resources } = await containers.records.items
    .query<{ slug: string; title: string; year?: number }>(
      "SELECT c.slug, c.title, c.year FROM c WHERE c.hidden != true OR NOT IS_DEFINED(c.hidden)",
    )
    .fetchAll();
  const byTitle = new Map<string, { slug: string; year?: number }[]>();
  for (const r of resources) {
    if (!r.slug || !r.title) continue;
    const key = normTitle(r.title);
    if (!key) continue;
    const arr = byTitle.get(key) ?? [];
    arr.push({ slug: r.slug, year: r.year });
    byTitle.set(key, arr);
  }
  return { byTitle };
}

/** Find a matching owned record slug for a given release-group. Fuzzy on
 *  title (normalized) + year (±1 to account for MB using first release date
 *  vs the user's specific pressing year). */
function findOwnedSlug(
  index: OwnedIndex,
  title: string,
  year: number | undefined,
): string | undefined {
  const candidates = index.byTitle.get(normTitle(title));
  if (!candidates || candidates.length === 0) return undefined;
  if (year === undefined) return candidates[0].slug;
  const withinYear = candidates.find((c) => c.year !== undefined && Math.abs(c.year - year) <= 1);
  if (withinYear) return withinYear.slug;
  // Fall back to any candidate with the same title even if year is off —
  // better a cross-link than nothing when we clearly own the album.
  return candidates[0].slug;
}

// ─── Main ────────────────────────────────────────────────────────────────

interface Result {
  slug: string;
  name: string;
  outcome: "skipped-has-discography" | "no-mbid" | "no-releases" | "enriched" | "error";
  releaseCount?: number;
  ownedCount?: number;
  error?: string;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const force = args.includes("--force");
  const limitIx = args.indexOf("--limit");
  const limit = limitIx >= 0 ? Number(args[limitIx + 1]) : Infinity;
  const slugIx = args.indexOf("--slug");
  const singleSlug = slugIx >= 0 ? args[slugIx + 1] : undefined;

  const { containers } = await import("../lib/cosmos");
  const { listStoredArtists } = await import("../lib/artists");
  const { fetchArtistReleaseGroups } = await import("../lib/musicbrainz");

  const ownedIndex = await buildOwnedIndex();
  console.log(`owned-record index built: ${ownedIndex.byTitle.size} distinct titles`);

  let artists = await listStoredArtists();
  if (singleSlug) artists = artists.filter((a) => a.slug === singleSlug);
  artists = artists.slice(0, limit as number);

  console.log(
    `enriching discography for ${artists.length} artists — mode=${dryRun ? "dry-run" : "live"}${
      force ? " --force" : ""
    }`,
  );

  const results: Result[] = [];
  let mbCallsSinceSleep = 0;

  for (const artist of artists) {
    const line: Result = { slug: artist.slug, name: artist.name, outcome: "no-mbid" };

    if (!artist.musicbrainzId) {
      results.push(line);
      continue;
    }
    if (!force && artist.discography && artist.discography.length > 0) {
      line.outcome = "skipped-has-discography";
      line.releaseCount = artist.discography.length;
      results.push(line);
      console.log(`  ↷ ${artist.slug}: has ${line.releaseCount} releases already`);
      continue;
    }

    try {
      if (mbCallsSinceSleep > 0) await sleep(MB_DELAY_MS);
      mbCallsSinceSleep++;
      const rgs = await fetchArtistReleaseGroups(artist.musicbrainzId);
      if (rgs.length === 0) {
        line.outcome = "no-releases";
        results.push(line);
        console.log(`  · ${artist.slug}: no release-groups`);
        continue;
      }

      const discography: import("../lib/types").DiscographyRelease[] = rgs
        .map((rg) => {
          const year = yearFromMbDate(rg["first-release-date"]);
          const type = classifyType(rg["primary-type"], rg["secondary-types"]);
          const ownedRecordSlug = findOwnedSlug(ownedIndex, rg.title, year);
          const r: import("../lib/types").DiscographyRelease = {
            musicbrainzId: rg.id,
            title: rg.title,
            type,
            year,
            disambiguation: rg.disambiguation || undefined,
            ownedRecordSlug,
          };
          return r;
        })
        // Sort by year ascending (undefined years last), then title.
        .sort((a, b) => {
          if (a.year === undefined && b.year === undefined)
            return a.title.localeCompare(b.title);
          if (a.year === undefined) return 1;
          if (b.year === undefined) return -1;
          if (a.year !== b.year) return a.year - b.year;
          return a.title.localeCompare(b.title);
        });

      line.outcome = "enriched";
      line.releaseCount = discography.length;
      line.ownedCount = discography.filter((r) => r.ownedRecordSlug).length;

      if (!dryRun) {
        const updated = {
          ...artist,
          discography,
          updatedAt: new Date().toISOString(),
        };
        await containers.artists.item(artist.slug, artist.slug).replace(updated);
      }
      results.push(line);
      console.log(
        `  ✓ ${artist.slug}: ${line.releaseCount} releases (${line.ownedCount} owned)`,
      );
    } catch (err) {
      line.outcome = "error";
      line.error = err instanceof Error ? err.message : String(err);
      results.push(line);
      console.log(`  ⚠ ${artist.slug}: ${line.error}`);
    }
  }

  const counts = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.outcome] = (acc[r.outcome] ?? 0) + 1;
    return acc;
  }, {});
  const totalOwned = results.reduce((n, r) => n + (r.ownedCount ?? 0), 0);
  console.log("");
  console.log("summary:", counts, `totalOwnedLinks=${totalOwned}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
