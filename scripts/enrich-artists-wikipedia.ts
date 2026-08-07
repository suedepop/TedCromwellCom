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

/**
 * Normalize both sides of a name comparison. Handles:
 *   - Curly quotes (U+2018/2019/201C/201D) → straight ASCII '/"
 *     (Discogs stores "Guns N' Roses" with a curly apostrophe;
 *     Wikipedia titles use straight)
 *   - Discogs disambiguator suffix "(N)" (e.g. "Europe (2)")
 *   - Trailing whitespace / repeated spaces
 */
export function normalizeName(s: string): string {
  return s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+\(\d+\)\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Insert spaces at camelCase and letter↔digit boundaries. "NewOrder" →
 *  "New Order", "Blink182" → "Blink 182". Used as an ADDITIONAL search
 *  variant when the split differs from the original (concatenated brand
 *  names are common in Discogs). */
export function splitConcatenated(s: string): string {
  return s
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([a-zA-Z])(\d)/g, "$1 $2")
    .replace(/(\d)([a-zA-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Reject search-based candidates whose article title doesn't overlap with
 * the artist name. Catches cases where the fallback search returned a
 * completely unrelated band (e.g. "Stone Horses" → "Band of Horses").
 *
 * Rule: after normalizing (curly quotes, disambiguators) and lowercasing,
 * the first two words of the artist name (or the one word if it's a
 * single-word name) must appear in sequence somewhere in the article
 * title, or the article title must be a prefix of the artist name.
 *
 * Only applied to search-derived candidates — MB-derived candidates are
 * human-curated and always trusted.
 */
/** Aggressive canonicalization for comparison: lowercase, strip "The "
 *  prefix, replace all non-alphanumeric with spaces, then collapse. */
function comparableForm(s: string): string {
  return normalizeName(s)
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Whitespace-free canonical form — folds "Blink182" and "Blink-182",
 *  "NewOrder" and "New Order", "The Misfits" and "Misfits" to the same
 *  string for equality checks. Runs through comparableForm first so
 *  the leading "The " gets stripped consistently. */
function fullyStripped(s: string): string {
  return comparableForm(s).replace(/[^a-z0-9]/g, "");
}

export function titleMatchesArtist(artistName: string, articleTitle: string): boolean {
  const aStripped = fullyStripped(artistName);
  const tStripped = fullyStripped(articleTitle);
  if (!aStripped || !tStripped) return false;
  // Exact stripped equality catches "Blink182" ↔ "Blink-182",
  // "NewOrder" ↔ "New Order", "Guns N' Roses" ↔ "Guns N' Roses" (curly vs
  // straight apostrophe), etc.
  if (aStripped === tStripped) return true;
  // Prefix-startsWith on stripped forms catches "NewOrder" ↔
  // "New Order (band)" and "Blink182" ↔ "Blink-182 (album)".
  if (tStripped.startsWith(aStripped) || aStripped.startsWith(tStripped)) return true;
  // First-two-words prefix check for multi-word artist names — catches
  // "Elvis Costello & The Imposters" ↔ "Elvis Costello discography".
  const words = comparableForm(artistName).split(" ").filter(Boolean);
  if (words.length >= 2) {
    const halfStripped = words.slice(0, 2).join("").replace(/[^a-z0-9]/g, "");
    if (halfStripped && tStripped.includes(halfStripped)) return true;
  }
  return false;
}

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
      // Use normalized name (straight quotes, no disambiguator suffix)
      // AND a camelCase-split variant when the artist name is concatenated.
      const norm = normalizeName(artist.name);
      const split = splitConcatenated(norm);
      const nameVariants = split !== norm ? [norm, split] : [norm];
      for (const v of nameVariants) {
        candidates.push({ source: "resolved-via-search", title: v });
        candidates.push({ source: "resolved-via-search", title: `${v} (band)` });
        candidates.push({ source: "resolved-via-search", title: `${v} (musician)` });
      }

      let picked: Awaited<ReturnType<typeof fetchWikipediaExtract>> = null;
      let pickedSource: Result["outcome"] = "no-search-match";

      for (const c of candidates) {
        if (wikiCallsSinceSleep > 0) await sleep(WIKI_DELAY_MS);
        wikiCallsSinceSleep++;
        const r = await fetchWikipediaExtract(c.title);
        if (!r || r.isDisambiguation || !r.extract) continue;
        // Trust MB URLs unconditionally; reject search-derived matches whose
        // title doesn't overlap with the artist name (catches wrong-band
        // hits like Stone Horses → Band of Horses).
        if (c.source !== "resolved-via-mb" && !titleMatchesArtist(artist.name, r.title)) {
          continue;
        }
        picked = r;
        pickedSource = c.source;
        break;
      }

      // Search-based last resort — bias toward music with a "band" query.
      if (!picked) {
        // Try both normalized and camelCase-split variants so
        // "NewOrder" gets searched as "New Order band" too.
        const norm2 = normalizeName(artist.name);
        const split2 = splitConcatenated(norm2);
        const queries = split2 !== norm2 ? [norm2, split2] : [norm2];
        for (const q of queries) {
          if (wikiCallsSinceSleep > 0) await sleep(WIKI_DELAY_MS);
          wikiCallsSinceSleep++;
          const hits = await searchWikipedia(`${q} band`, 3);
          for (const h of hits) {
            if (wikiCallsSinceSleep > 0) await sleep(WIKI_DELAY_MS);
            wikiCallsSinceSleep++;
            const r = await fetchWikipediaExtract(h.title);
            if (!r || r.isDisambiguation || !r.extract) continue;
            if (!titleMatchesArtist(artist.name, r.title)) continue;
            picked = r;
            pickedSource = "resolved-via-search";
            break;
          }
          if (picked) break;
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
