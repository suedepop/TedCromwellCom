/**
 * Populate artist.members / artist.partOf / artist.artistType from
 * MusicBrainz "member of band" relationships. Cross-links each member
 * to a stored artist when we have one with the same MBID.
 *
 * For a Group (band): members = the persons who make up the band.
 * For a Person (solo): partOf = the bands they're a member of.
 * Sometimes both apply (e.g. a project that acts as both).
 *
 * Rate limit: 1.1s between MB fetches. Idempotent — skips artists whose
 * members[] AND partOf[] are already populated unless --force. Supports
 * --dry-run, --limit, --slug.
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

const MB_DELAY_MS = 1100;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function yearFromMbDate(d: string | null | undefined): number | undefined {
  if (!d) return undefined;
  const m = d.match(/^(\d{4})/);
  return m ? Number(m[1]) : undefined;
}

interface Result {
  slug: string;
  name: string;
  outcome: "skipped-has-both" | "no-mbid" | "no-relations" | "enriched" | "error";
  memberCount?: number;
  partOfCount?: number;
  crossLinked?: number;
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
  const { fetchArtistFull, membershipRelations } = await import("../lib/musicbrainz");

  // Build a MBID → slug index once so we can cross-link each member
  // back to a stored artist page when one exists.
  const all = await listStoredArtists();
  const bySlugMap = new Map(all.map((a) => [a.slug, a]));
  const mbidToSlug = new Map<string, string>();
  for (const a of all) {
    if (a.musicbrainzId) mbidToSlug.set(a.musicbrainzId, a.slug);
  }
  console.log(`stored-artist index: ${all.length} artists, ${mbidToSlug.size} with MBIDs`);

  let artists = singleSlug ? all.filter((a) => a.slug === singleSlug) : all;
  artists = artists.slice(0, limit as number);
  console.log(
    `enriching members for ${artists.length} artists — mode=${dryRun ? "dry-run" : "live"}${
      force ? " --force" : ""
    }`,
  );

  const results: Result[] = [];
  let mbCallsSinceSleep = 0;

  for (const artist of artists) {
    const line: Result = { slug: artist.slug, name: artist.name, outcome: "no-mbid" };
    void bySlugMap; // reserved for future use (member disambiguation lookups)

    if (!artist.musicbrainzId) {
      results.push(line);
      continue;
    }
    if (!force && artist.members && artist.partOf) {
      line.outcome = "skipped-has-both";
      line.memberCount = artist.members.length;
      line.partOfCount = artist.partOf.length;
      results.push(line);
      console.log(`  ↷ ${artist.slug}: has ${line.memberCount}m / ${line.partOfCount}p already`);
      continue;
    }

    try {
      if (mbCallsSinceSleep > 0) await sleep(MB_DELAY_MS);
      mbCallsSinceSleep++;
      const mb = await fetchArtistFull(artist.musicbrainzId);
      if (!mb) {
        line.outcome = "no-relations";
        results.push(line);
        console.log(`  · ${artist.slug}: MB returned no artist`);
        continue;
      }

      const { members: memRels, partOf: partRels } = membershipRelations(mb);

      const toBandMember = (
        r: import("../lib/musicbrainz").MbArtistRel,
      ): import("../lib/types").BandMember => {
        const otherMbid = r.artist?.id;
        return {
          musicbrainzId: otherMbid,
          name: r.artist?.name ?? "",
          roles: r.attributes && r.attributes.length ? r.attributes : undefined,
          from: yearFromMbDate(r.begin),
          to: yearFromMbDate(r.end),
          storedArtistSlug: otherMbid ? mbidToSlug.get(otherMbid) : undefined,
        };
      };

      const sortByFrom = (
        a: import("../lib/types").BandMember,
        b: import("../lib/types").BandMember,
      ) => {
        if (a.from === undefined && b.from === undefined) return a.name.localeCompare(b.name);
        if (a.from === undefined) return 1;
        if (b.from === undefined) return -1;
        return a.from - b.from;
      };

      const members = memRels.map(toBandMember).sort(sortByFrom);
      const partOf = partRels.map(toBandMember).sort(sortByFrom);

      line.outcome = "enriched";
      line.memberCount = members.length;
      line.partOfCount = partOf.length;
      line.crossLinked = [...members, ...partOf].filter((m) => m.storedArtistSlug).length;

      if (!dryRun) {
        const updated = {
          ...artist,
          artistType: mb.type ?? artist.artistType,
          members,
          partOf,
          updatedAt: new Date().toISOString(),
        };
        await containers.artists.item(artist.slug, artist.slug).replace(updated);
      }
      results.push(line);
      console.log(
        `  ✓ ${artist.slug} (${mb.type ?? "?"}): ${members.length}m / ${partOf.length}p, ${line.crossLinked} cross-linked`,
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
  const totalMembers = results.reduce((n, r) => n + (r.memberCount ?? 0), 0);
  const totalCrossLinks = results.reduce((n, r) => n + (r.crossLinked ?? 0), 0);
  console.log("");
  console.log("summary:", counts, `totalMembers=${totalMembers} totalCrossLinks=${totalCrossLinks}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
