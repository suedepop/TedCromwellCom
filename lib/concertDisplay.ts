import type { Concert } from "./types";

export function concertBandLine(concert: Concert): string {
  const artists = [...concert.setlists]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((s) => s.artist);
  return artists.join(" · ") || concert.venueNameRaw || "Concert";
}
