/**
 * Scrapers for coaster-count.com.
 *
 * Three entry points:
 *  - parseRiddenIndex(html): yields the user's full ridden list as a structured
 *    tree: country → park (id + name) → coasters[] (id + name).
 *  - parsePark(html): yields location/geo + metadata from /park/<id>.
 *  - parseCoaster(html): yields manufacturer/type/year/stats from /coaster/<id>.
 *
 * The parsers are regex-based — coaster-count's HTML uses stable class names
 * (`coaster_row essential`, `data-park-id`, etc.) and there's no JSON-LD on
 * the page, so a tiny parser is more honest than pulling in cheerio.
 */

const COASTER_COUNT_BASE = "https://coaster-count.com";
const FETCH_HEADERS = {
  "User-Agent": "tedcromwell.com coaster importer (contact: ted@tedcromwell.com)",
};

// ─── Fetch helpers ──────────────────────────────────────────────────────────

export async function fetchRiddenIndex(userId: number): Promise<string> {
  const res = await fetch(`${COASTER_COUNT_BASE}/user/${userId}/ridden`, {
    headers: FETCH_HEADERS,
  });
  if (!res.ok) throw new Error(`coaster-count ridden page returned ${res.status}`);
  return res.text();
}

export async function fetchPark(parkId: number): Promise<string> {
  const res = await fetch(`${COASTER_COUNT_BASE}/park/${parkId}`, { headers: FETCH_HEADERS });
  if (!res.ok) throw new Error(`coaster-count park ${parkId} returned ${res.status}`);
  return res.text();
}

export async function fetchCoaster(coasterId: number): Promise<string> {
  const res = await fetch(`${COASTER_COUNT_BASE}/coaster/${coasterId}`, { headers: FETCH_HEADERS });
  if (!res.ok) throw new Error(`coaster-count coaster ${coasterId} returned ${res.status}`);
  return res.text();
}

// ─── Index page parser ─────────────────────────────────────────────────────

export interface RiddenEntry {
  coasterId: number;
  coasterName: string;
  parkId: number | null;     // null when coaster-count omits the data-park-id (rare)
  parkName: string;
  country: string;           // English country name as rendered in the country header
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&#039;": "'",
  "&nbsp;": " ",
};

function decodeEntities(s: string): string {
  return s.replace(/&[a-zA-Z0-9#]+;/g, (m) => ENTITIES[m] ?? m);
}

function clean(s: string): string {
  return decodeEntities(s)
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .replace(/\*+$/g, "") // coaster-count sometimes marks defunct items with *
    .trim();
}

/**
 * Walk the ridden HTML once, tracking the most recently seen country and park
 * header. Every coaster_row we encounter is attributed to those headers.
 */
export function parseRiddenIndex(html: string): RiddenEntry[] {
  const entries: RiddenEntry[] = [];
  let currentCountry = "";
  let currentParkId: number | null = null;
  let currentParkName = "";

  // A single regex enumerates every interesting element in document order:
  //  - country header:    <td id="xx" class="essential" ...><h3>…</h3>
  //  - park header:       <tr data-park-id="123">…<h3>…park name…</h3>
  //  - coaster row cell:  <td id="c123" class="coaster_row essential ...">…<span class="break_all">name</span>
  const pattern = new RegExp(
    [
      // Country header — coaster-count uses lowercase word IDs ("us", "uk",
      // "poland", "germany", etc.) on the country wrapper <td>.
      String.raw`<td\s+id="([a-z][a-z_]+)"\s+class="essential"[^>]*colspan="2"[^>]*>\s*<h3[^>]*>(.*?)<\/h3>`,
      // Park header
      String.raw`<tr\s+data-park-id="(\d+)"[^>]*>[\s\S]*?<h3[^>]*>(.*?)<\/h3>`,
      // Coaster row
      String.raw`<td\s+id="c(\d+)"\s+class="coaster_row[^"]*"[^>]*>[\s\S]*?<span\s+class="break_all">(.*?)<\/span>`,
    ].join("|"),
    "gi",
  );

  for (const m of html.matchAll(pattern)) {
    if (m[1] !== undefined && m[2] !== undefined) {
      // Country header
      currentCountry = clean(m[2]);
      currentParkId = null;
      currentParkName = "";
    } else if (m[3] !== undefined && m[4] !== undefined) {
      // Park header
      currentParkId = Number(m[3]);
      currentParkName = clean(m[4]);
    } else if (m[5] !== undefined && m[6] !== undefined) {
      // Coaster row
      const coasterId = Number(m[5]);
      const coasterName = clean(m[6]);
      if (!currentParkName) continue; // skip orphans before any park header
      entries.push({
        coasterId,
        coasterName,
        parkId: currentParkId,
        parkName: currentParkName,
        country: currentCountry,
      });
    }
  }

  return entries;
}

// ─── Park detail page parser ───────────────────────────────────────────────

export interface ParkDetails {
  name?: string;
  city?: string;
  state?: string;
  country?: string;
  lat?: number;
  lng?: number;
  websiteUrl?: string;
}

/**
 * Park detail pages embed geo in a hidden meta block (and on the embedded
 * map). Coordinates appear as `data-lat="..." data-lng="..."` on the map
 * widget, and the location string sits inside the address block.
 *
 * Detail-page selectors will be finalized in Phase 4 when we point the
 * sync job at a live page; this stub returns whatever we can spot today
 * and Phase 4 hardens it.
 */
export function parsePark(html: string): ParkDetails {
  const details: ParkDetails = {};

  const latLng = html.match(/data-lat="([-\d.]+)"\s+data-lng="([-\d.]+)"/);
  if (latLng) {
    details.lat = Number(latLng[1]);
    details.lng = Number(latLng[2]);
  }

  const website = html.match(/href="(https?:\/\/[^"]+)"[^>]*class="[^"]*park_website/);
  if (website) details.websiteUrl = website[1];

  return details;
}

// ─── Coaster detail page parser ────────────────────────────────────────────

export interface CoasterDetails {
  name?: string;
  manufacturer?: string;
  openedYear?: number;
  type?: string;               // raw type string from coaster-count (e.g. "Sit Down")
  heightFeet?: number;
  dropFeet?: number;
  lengthFeet?: number;
  topSpeedMph?: number;
  inversions?: number;
  durationSeconds?: number;
}

/**
 * Coaster detail pages use a fact table where each row has a label cell and
 * a value cell. The parser pulls values by their label text.
 *
 * As with parsePark, this is a Phase 1 stub — selectors will be tightened in
 * Phase 4 against a real fetched page.
 */
export function parseCoaster(html: string): CoasterDetails {
  const details: CoasterDetails = {};

  const fact = (label: string): string | undefined => {
    const re = new RegExp(
      `>\\s*${label}\\s*<[^>]*>[\\s\\S]*?<td[^>]*>([\\s\\S]*?)<\\/td>`,
      "i",
    );
    const m = html.match(re);
    return m ? clean(m[1]) : undefined;
  };

  const manufacturer = fact("Manufacturer");
  if (manufacturer) details.manufacturer = manufacturer;

  const opened = fact("Opened|Opening");
  if (opened) {
    const year = opened.match(/(\d{4})/);
    if (year) details.openedYear = Number(year[1]);
  }

  const height = fact("Height");
  if (height) {
    const ft = height.match(/([\d.]+)\s*ft/);
    if (ft) details.heightFeet = Number(ft[1]);
  }

  const drop = fact("Drop");
  if (drop) {
    const ft = drop.match(/([\d.]+)\s*ft/);
    if (ft) details.dropFeet = Number(ft[1]);
  }

  const length = fact("Length");
  if (length) {
    const ft = length.match(/([\d.]+)\s*ft/);
    if (ft) details.lengthFeet = Number(ft[1]);
  }

  const speed = fact("Top Speed|Speed");
  if (speed) {
    const mph = speed.match(/([\d.]+)\s*mph/);
    if (mph) details.topSpeedMph = Number(mph[1]);
  }

  const inversions = fact("Inversions");
  if (inversions) {
    const n = inversions.match(/^(\d+)/);
    if (n) details.inversions = Number(n[1]);
  }

  return details;
}
