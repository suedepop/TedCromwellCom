import Link from "next/link";
import type { Concert } from "@/lib/types";
import { concertBandLine } from "@/lib/concertDisplay";

export default function ConcertCard({ concert }: { concert: Concert }) {
  const bands = concertBandLine(concert);
  const featured =
    concert.photos.find((p) => p.id === concert.featuredPhotoId) ?? concert.photos[0];
  const cover = featured?.thumbnailUrl ?? featured?.blobUrl;
  return (
    <Link
      href={`/concerts/${concert.slug ?? concert.id}`}
      className="flex flex-col h-full border border-border bg-surface rounded overflow-hidden hover:border-accent transition"
    >
      <div className="h-48 shrink-0 w-full bg-black overflow-hidden flex items-center justify-center">
        {cover ? (
          <img src={cover} alt="" className="w-full h-full object-cover opacity-90" />
        ) : (
          <span className="font-display text-3xl text-muted">
            {new Date(concert.date).getFullYear()}
          </span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-xs text-muted">
          {new Date(concert.date).toLocaleDateString()} · {concert.city}
        </div>
        {concert.eventName && (
          <div className="text-xs text-accent mt-1 uppercase tracking-wider">{concert.eventName}</div>
        )}
        <h3 className="font-display text-xl mt-1">{bands}</h3>
        <p className="text-sm text-muted mt-1">{concert.venueNameRaw}</p>
      </div>
    </Link>
  );
}
