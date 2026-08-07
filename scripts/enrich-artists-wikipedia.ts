/**
 * Populate wikipediaExtract / wikipediaUrl / wikipediaTitle on every stored
 * Artist doc, so the public /artists/<slug> page has substantive content
 * (fixes GSC "thin content" signals on the ~1000 one-record artist pages).
 *
 * Resolution strategy per artist:
 *   1) If we already have a MusicBrainz ID and no wikipediaUrl set: fetch
 *      the MB artist with URL relationships and pick the Wikipedia URL from
 *      there. Preferred because MB's link is human-curated.
 *   2) Else search Wikipedia by "{name} band" and take the top hit if its
 *      title looks like a band/musician page (heuristic: not obviously a
 *      disambiguation page, contains music-ish words in the snippet).
 *   3) Fetch /page/summary/{title} and store the extract.
 *
 * Idempotent: skips artists that already have a wikipediaExtract unless
 * --force is passed. Rate-limited: 1.1s between MusicBrainz calls (their
 * anonymous limit is 1 req/sec) and 0.2s between Wikipedia calls (their
 * limit is far higher; we're being extra polite).
 *
 * Usage:
 *   npx tsx scripts/enrich-artists-wikipedia.ts --dry-run           # preview
 *   npx tsx scripts/enrich-artists-wikipedia.ts --limit 20          # first 20
 *   npx tsx scripts/enrich-artists-wikipedia.ts --slug deep-purple  # single
 *   npx tsx scripts/enrich-artists-wikipedia.ts --force             # overwrite
 *   npx tsx scripts/enrich-artists-wikipedia.ts                     # all
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

const MB_DELAY_MS = 1100;
const WIKI_DELAY_MS = 200;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface Result {
  slug: string;
  name: string;
  outcome:
    | "skipped-has-extract"
    | "resolved-via-mb"
    | "resolved-via-search"
    | "no-mb-wiki-link"
    | "no-search-match"
    | "no-extract"
    | "error";
  wikipediaUrl?: string;
  wikipediaTitle?: string;
  extractLength?: number;
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
  const { fetchArtistWithUrls, wikipediaUrlFromMbArtist } = await import("../lib/musicbrainz");
  const { fetchWikipediaExtract, searchWikipedia, wikipediaTitleFromUrl } = await import(
    "../lib/wikipedia"
  );

  let artists = await listStoredArtists();
  if (singleSlug) artists = artists.filter((a) => a.slug === singleSlug);
  artists = artists.slice(0, limit as number);

  console.log(
    `enriching ${artists.length} artists — mode=${dryRun ? "dry-run" : "live"}${
      force ? " --force" : ""
    }`,
  );

  const results: Result[] = [];
  let mbCallsSinceSleep = 0;
  let wikiCallsSinceSleep = 0;

  for (const artist of artists) {
    const line: Result = { slug: artist.slug, name: artist.name, outcome: "no-search-match" };

    if (!force && artist.wikipediaExtract) {
      line.outcome = "skipped-has-extract";
      line.extractLength = artist.wikipediaExtract.length;
      results.push(line);
      console.log(`  ↷ ${artist.slug}: has extract (${line.extractLength} chars)`);
      continue;
    }

    // Build a candidate-title list. First candidate wins if it returns a
    // real (non-disambiguation) article; otherwise we walk the list.
    //   1) MB's Wikipedia URL if present (human-curated best signal)
    //   2) Exact artist name
    //   3) "{name} (band)" and "{name} (musician)" disambig suffixes
    //   4) Top hit from a Wikipedia search
    const candidates: { source: Result["outcome"]; title: string }[] = [];

    try {
      if (artist.wikipediaUrl) {
        const t = wikipediaTitleFromUrl(artist.wikipediaUrl);
        if (t) candidates.push({ source: "resolved-via-mb", title: t });
      }
      if (artist.musicbrainzId && candidates.length === 0) {
        if (mbCallsSinceSleep > 0) await sleep(MB_DELAY_MS);
        mbCallsSinceSleep++;
        const mb = await fetchArtistWithUrls(artist.musicbrainzId);
        if (mb) {
          const wikiUrl = wikipediaUrlFromMbArtist(mb);
          const t = wikiUrl ? wikipediaTitleFromUrl(wikiUrl) : null;
          if (t) candidates.push({ source: "resolved-via-mb", title: t });
          else line.outcome = "no-mb-wiki-link";
        }
      }

      // Always add name-based candidates as fallbacks after any MB hit.
      candidates.push({ source: "resolved-via-search", title: artist.name });
      candidates.push({ source: "resolved-via-search", title: `${artist.name} (band)` });
      candidates.push({ source: "resolved-via-search", title: `${artist.name} (musician)` });

      let picked: Awaited<ReturnType<typeof fetchWikipediaExtract>> = null;
      let pickedSource: Result["outcome"] = "no-search-match";

      for (const c of candidates) {
        if (wikiCallsSinceSleep > 0) await sleep(WIKI_DELAY_MS);
        wikiCallsSinceSleep++;
        const r = await fetchWikipediaExtract(c.title);
        if (r && !r.isDisambiguation && r.extract) {
          picked = r;
          pickedSource = c.source;
          break;
        }
      }

      // Search-based last resort — bias toward music with a "band" query.
      if (!picked) {
        if (wikiCallsSinceSleep > 0) await sleep(WIKI_DELAY_MS);
        wikiCallsSinceSleep++;
        const hits = await searchWikipedia(`${artist.name} band`, 3);
        if (hits[0]) {
          if (wikiCallsSinceSleep > 0) await sleep(WIKI_DELAY_MS);
          wikiCallsSinceSleep++;
          picked = await fetchWikipediaExtract(hits[0].title);
          if (picked) pickedSource = "resolved-via-search";
        }
      }

      if (!picked) {
        results.push(line);
        console.log(`  ✗ ${artist.slug}: ${line.outcome}`);
        continue;
      }

      line.outcome = pickedSource;
      line.wikipediaTitle = picked.title;
      line.wikipediaUrl = picked.url;
      line.extractLength = picked.extract.length;

      if (!dryRun) {
        const updated = {
          ...artist,
          wikipediaExtract: picked.extract,
          wikipediaUrl: picked.url,
          wikipediaTitle: picked.title,
          enrichedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await containers.artists.item(artist.slug, artist.slug).replace(updated);
      }
      results.push(line);
      console.log(
        `  ✓ ${artist.slug}: ${picked.title} (${picked.extract.length} chars) via ${pickedSource}`,
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
  console.log("");
  console.log("summary:", counts);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
