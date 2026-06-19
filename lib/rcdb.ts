/**
 * Minimal scraper for rcdb.com (Roller Coaster DataBase).
 *
 * Park detail pages (https://rcdb.com/<id>.htm) consistently include:
 *   <h1>Name</h1>
 *   <street line><br>
 *   <a href="/location.htm?id=...">City</a>,
 *   <a href="/location.htm?id=...">State/Region</a>,
 *   <a href="/location.htm?id=...">Country</a><br>
 * and a decimal lat/lng pair (e.g. "49.685887, 11.000093") elsewhere in
 * the body.
 *
 * The scraper is intentionally tolerant: it returns whatever fields it can
 * confidently extract and leaves the rest undefined for the admin to fill
 * in manually.
 */

const RCDB_BASE = "https://rcdb.com";
const FETCH_HEADERS = {
  "User-Agent": "tedcromwell.com coaster importer (contact: ted@tedcromwell.com)",
};

export async function fetchRcdb(id: number): Promise<string> {
  const res = await fetch(`${RCDB_BASE}/${id}.htm`, { headers: FETCH_HEADERS });
  if (!res.ok) throw new Error(`rcdb ${id} returned ${res.status}`);
  return res.text();
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

function clean(s: string): string {
  return s
    .replace(/&[a-zA-Z0-9#]+;/g, (m) => ENTITIES[m] ?? m)
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export interface RcdbParkDetails {
  name?: string;
  street?: string;        // first address line before the location chain (e.g. "Schlossplatz 4")
  city?: string;
  state?: string;
  country?: string;
  lat?: number;
  lng?: number;
}

export function parseRcdbPark(html: string): RcdbParkDetails {
  const out: RcdbParkDetails = {};

  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (h1) out.name = clean(h1[1]);

  // The address block is: <h1>...</h1><street><br>
  //   <a href="/location.htm?...">City</a>,
  //   <a href="/location.htm?...">State</a>,
  //   <a href="/location.htm?...">Country</a><br>
  // Allow an optional street line; capture the three location anchor texts.
  const block = html.match(
    /<\/h1>([\s\S]*?)(?:<a\s+href="\/location\.htm[^"]*">([^<]+)<\/a>,\s*)?<a\s+href="\/location\.htm[^"]*">([^<]+)<\/a>,\s*<a\s+href="\/location\.htm[^"]*">([^<]+)<\/a>/,
  );
  if (block) {
    const preamble = clean(block[1]).replace(/,$/, "").trim();
    if (preamble) out.street = preamble;
    // If only two anchors matched (no city), the captured groups shift:
    if (block[2] && block[3] && block[4]) {
      out.city = clean(block[2]);
      out.state = clean(block[3]);
      out.country = clean(block[4]);
    } else if (block[3] && block[4]) {
      out.state = clean(block[3]);
      out.country = clean(block[4]);
    }
  }

  // Coords appear as a plain "lat, lng" decimal pair in the body — the
  // first such pair on the page is the park's location.
  const coords = html.match(/(-?\d{1,3}\.\d{4,})\s*,\s*(-?\d{1,3}\.\d{4,})/);
  if (coords) {
    const lat = Number(coords[1]);
    const lng = Number(coords[2]);
    if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
      out.lat = lat;
      out.lng = lng;
    }
  }

  return out;
}

/** End-to-end: fetch and parse a park by RCDB id. */
export async function lookupRcdbPark(id: number): Promise<RcdbParkDetails> {
  const html = await fetchRcdb(id);
  return parseRcdbPark(html);
}
