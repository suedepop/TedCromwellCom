import type { Metadata } from "next";
import dynamicImport from "next/dynamic";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ConcertCard from "@/components/concerts/ConcertCard";
import { listConcerts } from "@/lib/concerts";
import { getVenue } from "@/lib/venues";
import { pageMetadata } from "@/lib/metadata";
import type { Concert, Venue } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const venue = await getVenue(params.id);
  if (!venue) return {};
  const where = [venue.city, venue.state, venue.country].filter(Boolean).join(", ");
  const description =
    venue.description?.replace(/[#>*_`\[\]\(\)!]/g, "").replace(/\s+/g, " ").trim().slice(0, 200) ??
    `Concerts I've seen at ${venue.canonicalName} in ${where}.`;
  return pageMetadata({
    title: venue.canonicalName,
    description,
    path: `/venues/${venue.id}`,
    imageAlt: venue.canonicalName,
    type: "website",
  });
}

const VenueMap = dynamicImport(() => import("@/components/venues/VenueMap"), { ssr: false });

interface VenueStats {
  showsAttended: number;
  uniqueArtists: number;
  mostSeen: string[];
  mostSeenCount: number;
  firstYear: number | null;
  lastYear: number | null;
}

function calcStats(concerts: Concert[]): VenueStats {
  const showsAttended = concerts.length;
  const artistCounts = new Map<string, number>();
  const years: number[] = [];
  for (const c of concerts) {
    if (c.date) {
      const y = parseInt(c.date.slice(0, 4), 10);
      if (!isNaN(y)) years.push(y);
    }
    const seen = new Set<string>();
    for (const s of c.setlists) {
      if (!s.artist || seen.has(s.artist)) continue;
      seen.add(s.artist);
      artistCounts.set(s.artist, (artistCounts.get(s.artist) ?? 0) + 1);
    }
  }
  const uniqueArtists = artistCounts.size;
  const max = artistCounts.size > 0 ? Math.max(...artistCounts.values()) : 0;
  const mostSeen = Array.from(artistCounts.entries())
    .filter(([, n]) => n === max && n > 0)
    .map(([a]) => a)
    .sort();
  return {
    showsAttended,
    uniqueArtists,
    mostSeen,
    mostSeenCount: max,
    firstYear: years.length ? Math.min(...years) : null,
    lastYear: years.length ? Math.max(...years) : null,
  };
}

function attendeeBlurb(venue: Venue, stats: VenueStats): string {
  if (stats.showsAttended === 0) {
    return `I haven't caught a show at ${venue.canonicalName} yet.`;
  }
  const showsWord = stats.showsAttended === 1 ? "show" : "shows";
  const span =
    stats.firstYear && stats.lastYear && stats.firstYear !== stats.lastYear
      ? ` between ${stats.firstYear} and ${stats.lastYear}`
      : stats.firstYear
        ? ` in ${stats.firstYear}`
        : "";
  const opener =
    stats.showsAttended >= 5
      ? `I keep ending up back here.`
      : stats.showsAttended >= 2
        ? `I've been back more than once.`
        : ``;
  const base = `I've been to ${stats.showsAttended} ${showsWord} here${span}, across ${stats.uniqueArtists} different ${stats.uniqueArtists === 1 ? "artist" : "artists"}.`;
  const tail =
    stats.mostSeen.length === 0
      ? ""
      : stats.mostSeen.length === 1
        ? ` ${stats.mostSeen[0]} is the one I've seen the most here${stats.mostSeenCount > 1 ? ` (${stats.mostSeenCount} times)` : ""}.`
        : ` ${stats.mostSeen.join(" and ")} are tied at the top${stats.mostSeenCount > 1 ? ` with ${stats.mostSeenCount} each` : ""}.`;
  return [opener, base + tail].filter(Boolean).join(" ").trim();
}

function venueFacts(venue: Venue): string[] {
  const out: string[] = [];
  if (venue.venueType) out.push(venue.venueType.charAt(0).toUpperCase() + venue.venueType.slice(1));
  if (typeof venue.capacity === "number") out.push(`~${venue.capacity.toLocaleString()} capacity`);
  if (venue.openedYear && venue.closedYear) out.push(`${venue.openedYear}–${venue.closedYear} (closed)`);
  else if (venue.openedYear) out.push(`Opened ${venue.openedYear}`);
  else if (venue.closedYear) out.push(`Closed ${venue.closedYear}`);
  return out;
}

export default async function VenueDetail({ params }: { params: { id: string } }) {
  const venue = await getVenue(params.id);
  if (!venue) notFound();
  const concerts = await listConcerts({ venueId: venue.id });
  const stats = calcStats(concerts);
  const facts = venueFacts(venue);
  const hasCoords = typeof venue.lat === "number" && typeof venue.lng === "number";

  return (
    <section className="space-y-8">
      <header>
        <h1 className="font-display text-4xl">{venue.canonicalName}</h1>
        <p className="text-muted mt-1">
          {venue.city}
          {venue.state ? `, ${venue.state}` : ""} · {venue.country}
        </p>
        {facts.length > 0 && <p className="text-sm text-muted mt-2">{facts.join(" · ")}</p>}
      </header>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-5">
          {venue.description && (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{venue.description}</ReactMarkdown>
            </div>
          )}

          <div className={venue.description ? "border-t border-border pt-4" : ""}>
            <h2 className="text-xs uppercase tracking-wider text-muted mb-2">My experience</h2>
            <p className="text-ink leading-relaxed">{attendeeBlurb(venue, stats)}</p>
          </div>

          <dl className="grid grid-cols-3 gap-4 border-y border-border py-4 text-sm">
            <Stat label="Shows Attended" value={stats.showsAttended.toString()} />
            <Stat label="Bands" value={stats.uniqueArtists.toString()} />
            <Stat
              label="Most Seen"
              value={stats.mostSeen.length ? stats.mostSeen.join(" · ") : "—"}
              count={stats.mostSeenCount > 1 ? `${stats.mostSeenCount}×` : undefined}
            />
          </dl>

          <div className="flex gap-4 text-sm">
            {venue.url && (
              <a href={venue.url} target="_blank" rel="noreferrer" className="text-accent">
                Venue website ↗
              </a>
            )}
            {venue.wikipediaUrl && (
              <a href={venue.wikipediaUrl} target="_blank" rel="noreferrer" className="text-accent">
                Wikipedia ↗
              </a>
            )}
          </div>
        </div>
        <div className="md:col-span-1">
          {hasCoords ? (
            <VenueMap
              singleCenter
              zoom={12}
              height={320}
              pins={[{ id: venue.id, name: venue.canonicalName, lat: venue.lat!, lng: venue.lng! }]}
            />
          ) : (
            <div className="h-[320px] border border-border rounded bg-surface flex items-center justify-center text-muted text-sm">
              No location set
            </div>
          )}
        </div>
      </section>

      {concerts.length > 0 && (
        <section>
          <h2 className="font-display text-2xl mb-3">Concerts I've been to here</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {concerts.map((c) => (
              <ConcertCard key={c.id} concert={c} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}

function Stat({ label, value, count }: { label: string; value: string; count?: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted">{label}</dt>
      <dd className="font-display text-xl text-ink mt-1 leading-tight">
        {value}
        {count && <span className="text-sm text-muted ml-2">{count}</span>}
      </dd>
    </div>
  );
}
