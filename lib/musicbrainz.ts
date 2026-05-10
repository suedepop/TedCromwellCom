/**
 * MusicBrainz Web Service v2 helpers.
 * Anonymous endpoints; rate-limited to ~1 request/second by their docs.
 *
 * NOTE: HTTP header values must be ASCII — keep MB_USER_AGENT free of
 * non-ASCII characters (em-dashes, smart quotes, etc.).
 */

export const MB_BASE = "https://musicbrainz.org/ws/2/artist/";
export const MB_USER_AGENT =
  "TedCromwellCom/1.0 (+https://www.tedcromwell.com - personal-site artist alignment)";

export interface MbArtist {
  id: string;
  name: string;
  score: number;
  type?: string;
  country?: string;
  disambiguation?: string;
  aliases?: { name: string }[];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function searchArtists(name: string, limit = 10): Promise<MbArtist[]> {
  const q = `artist:"${name.replace(/"/g, "")}"`;
  const url = `${MB_BASE}?query=${encodeURIComponent(q)}&fmt=json&limit=${limit}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, {
      headers: { "User-Agent": MB_USER_AGENT, Accept: "application/json" },
    });
    if (res.ok) {
      const data = (await res.json()) as { artists?: MbArtist[] };
      return data.artists ?? [];
    }
    if (res.status === 503 || res.status === 429) {
      await sleep(2000 * (attempt + 1));
      continue;
    }
    throw new Error(`musicbrainz ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  throw new Error("musicbrainz: too many retries");
}
