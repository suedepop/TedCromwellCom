/**
 * Populate artist.relatedArtists from MusicBrainz artist-artist
 * relationships that AREN'T "member of band" (that's Phase 3). We
 * capture collaborations, subgroups/offshoots, renames, supporting
 * musicians, voice actors — anything in RELATED_TYPES in
 * lib/musicbrainz.ts.
 *
 * Each entry is cross-linked to a stored artist page (via MBID → slug)
 * when we host that artist locally, so pages can render ★ links to
 * their collaborators, offshoots, and previous incarnations.
 *
 * Rate limit: 1.1s between MB fetches per artist. Idempotent — skips
 * artists whose relatedArtists[] is already populated unless --force.
 * Supports --dry-run, --limit, --slug.
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
  outcome: "skipped-has-related" | "no-mbid" | "no-relations" | "enriched" | "error";
  relatedCount?: number;
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
  const { fetchArtistFull, relatedArtistRelations } = await import("../lib/musicbrainz");

  const all = await listStoredArtists();
  const mbidToSlug = new Map<string, string>();
  for (const a of all) {
    if (a.musicbrainzId) mbidToSlug.set(a.musicbrainzId, a.slug);
  }
  console.log(`stored-artist index: ${all.length} artists, ${mbidToSlug.size} with MBIDs`);

  let artists = singleSlug ? all.filter((a) => a.slug === singleSlug) : all;
  artists = artists.slice(0, limit as number);
  console.log(
    `enriching related-artists for ${artists.length} artists — mode=${
      dryRun ? "dry-run" : "live"
    }${force ? " --force" : ""}`,
  );

  const results: Result[] = [];
  let mbCallsSinceSleep = 0;

  for (const artist of artists) {
    const line: Result = { slug: artist.slug, name: artist.name, outcome: "no-mbid" };

    if (!artist.musicbrainzId) {
      results.push(line);
      continue;
    }
    if (!force && artist.relatedArtists && artist.relatedArtists.length > 0) {
      line.outcome = "skipped-has-related";
      line.relatedCount = artist.relatedArtists.length;
      results.push(line);
      console.log(`  ↷ ${artist.slug}: has ${line.relatedCount} related already`);
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

      const rels = relatedArtistRelations(mb);
      const relatedArtists: import("../lib/types").RelatedArtist[] = rels.map((r) => {
        const otherMbid = r.artist?.id;
        // MB rel types are a controlled vocabulary — cast is safe within
        // the RELATED_TYPES set. Anything unexpected falls back to "other".
        const knownRelations = new Set([
          "collaboration",
          "subgroup",
          "supporting musician",
          "artist rename",
          "voice actor",
        ]);
        const relation = (
          knownRelations.has(r.type) ? r.type : "other"
        ) as import("../lib/types").RelatedArtistRelation;
        return {
          musicbrainzId: otherMbid,
          name: r.artist?.name ?? "",
          relation,
          direction: r.direction,
          from: yearFromMbDate(r.begin),
          to: yearFromMbDate(r.end),
          storedArtistSlug: otherMbid ? mbidToSlug.get(otherMbid) : undefined,
        };
      });

      // Sort: cross-linked entries first (they're the most valuable to
      // click), then by relation type, then by name.
      relatedArtists.sort((a, b) => {
        const aStar = a.storedArtistSlug ? 0 : 1;
        const bStar = b.storedArtistSlug ? 0 : 1;
        if (aStar !== bStar) return aStar - bStar;
        if (a.relation !== b.relation) return a.relation.localeCompare(b.relation);
        return a.name.localeCompare(b.name);
      });

      line.outcome = "enriched";
      line.relatedCount = relatedArtists.length;
      line.crossLinked = relatedArtists.filter((r) => r.storedArtistSlug).length;

      if (!dryRun) {
        const updated = {
          ...artist,
          relatedArtists,
          updatedAt: new Date().toISOString(),
        };
        await containers.artists.item(artist.slug, artist.slug).replace(updated);
      }
      results.push(line);
      console.log(
        `  ✓ ${artist.slug}: ${line.relatedCount} related (${line.crossLinked} cross-linked)`,
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
  const totalRelated = results.reduce((n, r) => n + (r.relatedCount ?? 0), 0);
  const totalCrossLinks = results.reduce((n, r) => n + (r.crossLinked ?? 0), 0);
  console.log("");
  console.log(
    "summary:",
    counts,
    `totalRelated=${totalRelated} totalCrossLinks=${totalCrossLinks}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
