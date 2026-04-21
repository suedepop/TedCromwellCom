import { createVenue, findVenueByAlias } from "./venues";
import { collectSetlistFmIds, newConcertId, upsertConcert } from "./concerts";
import type { Concert, Setlist, Song, Venue } from "./types";

const BASE = "https://api.setlist.fm/rest/1.0";

interface SetlistFmSong {
  name: string;
  info?: string;
  cover?: { name: string };
  tape?: boolean;
}
interface SetlistFmSet {
  song?: SetlistFmSong[];
}
interface SetlistFmArtist {
  mbid: string;
  name: string;
}
interface SetlistFmVenue {
  id: string;
  name: string;
  city: { name: string; state?: string; country: { code: string; name: string }; coords?: { lat: number; long: number } };
}
interface SetlistFmEntry {
  id: string;
  eventDate: string; // DD-MM-YYYY
  artist: SetlistFmArtist;
  venue: SetlistFmVenue;
  sets: { set: SetlistFmSet[] };
  info?: string;
}
interface SetlistFmResponse {
  setlist: SetlistFmEntry[];
  total: number;
  page: number;
  itemsPerPage: number;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchPage(
  username: string,
  apiKey: string,
  page: number,
): Promise<SetlistFmResponse> {
  const url = `${BASE}/user/${encodeURIComponent(username)}/attended?p=${page}`;
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, {
      headers: { "x-api-key": apiKey, Accept: "application/json" },
    });
    if (res.ok) return (await res.json()) as SetlistFmResponse;
    if (res.status === 429) {
      const retryAfter = Number(res.headers.get("retry-after")) || 2;
      await sleep(retryAfter * 1000 * (attempt + 1));
      continue;
    }
    throw new Error(`setlist.fm ${res.status}: ${await res.text()}`);
  }
  throw new Error("setlist.fm: too many 429s");
}

async function fetchAllAttended(
  username: string,
  apiKey: string,
): Promise<{ entries: SetlistFmEntry[]; total: number; pages: number }> {
  const out: SetlistFmEntry[] = [];
  let page = 1;
  let total = 0;
  for (;;) {
    const data = await fetchPage(username, apiKey, page);
    total = data.total;
    out.push(...data.setlist);
    if (out.length >= data.total || data.setlist.length === 0) break;
    page += 1;
    if (page > 500) break; // hard safety: 500 pages × 20 = 10k concerts
    await sleep(600); // ~1.6 req/sec, under setlist.fm's 2/sec limit
  }
  return { entries: out, total, pages: page };
}

function parseEventDate(ddmmyyyy: string): string {
  const [d, m, y] = ddmmyyyy.split("-");
  return `${y}-${m}-${d}`;
}

function flattenSongs(entry: SetlistFmEntry): Song[] {
  const sets = entry.sets?.set ?? [];
  const songs: Song[] = [];
  let order = 0;
  for (const set of sets) {
    for (const s of set.song ?? []) {
      songs.push({
        sortOrder: order++,
        name: s.name,
        info: s.info,
        cover: s.cover?.name,
        tape: s.tape,
      });
    }
  }
  return songs;
}

export interface ImportPreview {
  newConcerts: number;
  skipped: number;
  newVenues: number;
  concerts: Concert[];
  newVenueNames: string[];
  fetchedFromApi: number;
  apiReportedTotal: number;
  pagesFetched: number;
}

export async function runImport(opts: { commit: boolean }): Promise<ImportPreview> {
  const apiKey = process.env.SETLISTFM_API_KEY;
  const username = process.env.SETLISTFM_USERNAME;
  if (!apiKey || !username) throw new Error("SETLISTFM_API_KEY and SETLISTFM_USERNAME must be set");

  const { entries, total: apiReportedTotal, pages: pagesFetched } = await fetchAllAttended(
    username,
    apiKey,
  );
  const existingIds = await collectSetlistFmIds();

  // Group by date + setlist.fm venue id
  const groups = new Map<string, SetlistFmEntry[]>();
  for (const e of entries) {
    if (existingIds.has(e.id)) continue;
    const key = `${e.eventDate}__${e.venue.id}`;
    const arr = groups.get(key) ?? [];
    arr.push(e);
    groups.set(key, arr);
  }

  const venueCache = new Map<string, Venue>();
  const newVenueNames: string[] = [];
  const concerts: Concert[] = [];
  let skipped = entries.length - Array.from(groups.values()).reduce((n, a) => n + a.length, 0);

  for (const group of groups.values()) {
    const first = group[0];
    const rawName = first.venue.name;

    let venue = venueCache.get(rawName) ?? (await findVenueByAlias(rawName));
    if (!venue) {
      const coords = first.venue.city.coords;
      if (commitable(opts, venue)) {
        venue = await createVenue({
          canonicalName: rawName,
          city: first.venue.city.name,
          state: first.venue.city.state,
          country: first.venue.city.country.name,
          aliases: [rawName],
          lat: coords?.lat,
          lng: coords?.long,
        });
      } else {
        venue = {
          id: "pending-" + rawName,
          canonicalName: rawName,
          city: first.venue.city.name,
          state: first.venue.city.state,
          country: first.venue.city.country.name,
          aliases: [rawName],
          lat: coords?.lat,
          lng: coords?.long,
        };
      }
      newVenueNames.push(rawName);
    }
    venueCache.set(rawName, venue);

    // Build setlists sorted alphabetically by artist
    const sorted = [...group].sort((a, b) => a.artist.name.localeCompare(b.artist.name));
    const setlists: Setlist[] = sorted.map((e, i) => ({
      sortOrder: i,
      artist: e.artist.name,
      setlistFmId: e.id,
      songs: flattenSongs(e),
    }));

    const concert: Concert = {
      id: newConcertId(),
      pk: venue.id,
      venueId: venue.id,
      venueNameRaw: rawName,
      date: parseEventDate(first.eventDate),
      city: first.venue.city.name,
      country: first.venue.city.country.name,
      setlists,
      photos: [],
      videoUrls: [],
      ticketStubs: [],
      links: [],
      notes: "",
      setlistFmIds: group.map((e) => e.id),
      importedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (opts.commit && !venue.id.startsWith("pending-")) {
      await upsertConcert(concert);
    }
    concerts.push(concert);
  }

  return {
    newConcerts: concerts.length,
    skipped,
    newVenues: newVenueNames.length,
    concerts,
    newVenueNames,
    fetchedFromApi: entries.length,
    apiReportedTotal,
    pagesFetched,
  };
}

function commitable(opts: { commit: boolean }, venue: Venue | null): boolean {
  return opts.commit && !venue;
}
