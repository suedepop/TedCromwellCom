import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

/**
 * Walk every concert + vinyl record and create one stub Artist doc per
 * unique normalized slug. Discogs artist IDs are populated from the existing
 * record data (we already have them on `RecordArtist.id`). MusicBrainz +
 * setlist.fm IDs are left blank for the admin to fill in over time.
 *
 * Re-running this script is safe: existing Artist docs are *not* overwritten.
 * Pass --refill-discogs to update existing docs that are missing a discogsArtistId.
 */
async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const refillDiscogs = process.argv.includes("--refill-discogs");

  const { containers } = await import("../lib/cosmos");
  const { listConcerts } = await import("../lib/concerts");
  const { listRecords } = await import("../lib/records");
  const { listStoredArtists, buildArtistSlug } = await import("../lib/artists");

  const [concerts, records, existing] = await Promise.all([
    listConcerts(),
    listRecords(),
    listStoredArtists(),
  ]);

  const existingBySlug = new Map(existing.map((a) => [a.slug, a]));

  // Aggregate: slug -> { name, discogsId, sources }
  const aggregated = new Map<
    string,
    { name: string; discogsId?: number; concertCount: number; recordCount: number }
  >();

  function bump(rawName: string, discogsId: number | undefined, kind: "concert" | "record") {
    const slug = buildArtistSlug(rawName);
    const cur = aggregated.get(slug) ?? {
      name: rawName.trim(),
      discogsId: undefined,
      concertCount: 0,
      recordCount: 0,
    };
    if (discogsId && !cur.discogsId) cur.discogsId = discogsId;
    if (kind === "concert") cur.concertCount += 1;
    else cur.recordCount += 1;
    aggregated.set(slug, cur);
  }

  for (const c of concerts) {
    const seen = new Set<string>();
    for (const s of c.setlists) {
      if (!s.artist) continue;
      const slug = buildArtistSlug(s.artist);
      if (seen.has(slug)) continue;
      seen.add(slug);
      bump(s.artist, undefined, "concert");
    }
  }
  for (const r of records) {
    const seen = new Set<string>();
    for (const a of r.artists) {
      if (!a.name) continue;
      const slug = buildArtistSlug(a.name);
      if (seen.has(slug)) continue;
      seen.add(slug);
      bump(a.name, a.id, "record");
    }
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;
  const now = new Date().toISOString();

  for (const [slug, info] of aggregated) {
    const existingDoc = existingBySlug.get(slug);
    if (existingDoc) {
      // Only update existing docs when --refill-discogs is set AND they lack a discogs id.
      if (!refillDiscogs || existingDoc.discogsArtistId || !info.discogsId) {
        skipped += 1;
        continue;
      }
      const updatedDoc = {
        ...existingDoc,
        discogsArtistId: info.discogsId,
        updatedAt: now,
      };
      if (dryRun) {
        console.log(`◌ ${slug}: would set discogsArtistId=${info.discogsId}`);
      } else {
        await containers.artists.item(slug, slug).replace(updatedDoc);
        console.log(`✓ updated ${slug} (discogsArtistId=${info.discogsId})`);
      }
      updated += 1;
      continue;
    }
    const doc = {
      id: slug,
      slug,
      name: info.name,
      discogsArtistId: info.discogsId,
      createdAt: now,
      updatedAt: now,
    };
    if (dryRun) {
      console.log(
        `◌ ${slug}: would create (name="${info.name}", discogs=${info.discogsId ?? "—"}, ${info.concertCount}c/${info.recordCount}r)`,
      );
    } else {
      await containers.artists.items.create(doc);
      console.log(
        `✓ created ${slug} (name="${info.name}", discogs=${info.discogsId ?? "—"})`,
      );
    }
    created += 1;
  }

  console.log(`\nDone. created=${created} updated=${updated} skipped=${skipped} total=${aggregated.size}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
