import Link from "next/link";
import type { TravelEntry } from "@/lib/types";

export default function TravelCard({ entry }: { entry: TravelEntry }) {
  const featured = entry.photos.find((p) => p.id === entry.featuredPhotoId) ?? entry.photos[0];
  const cover = featured?.thumbnailUrl ?? featured?.blobUrl;
  const dateRange =
    entry.endDate && entry.endDate !== entry.startDate
      ? `${entry.startDate} → ${entry.endDate}`
      : entry.startDate;
  return (
    <Link
      href={`/travel/${entry.slug ?? entry.id}`}
      className="flex flex-col h-full border border-border bg-surface rounded overflow-hidden hover:border-accent transition"
    >
      <div className="aspect-[16/9] bg-black">
        {cover ? (
          <img src={cover} alt="" className="w-full h-full object-cover opacity-90" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted font-display text-2xl">
            {entry.country}
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-display text-xl">{entry.locationName}</h3>
        <p className="text-xs text-muted mt-1">
          {[entry.city, entry.state, entry.country].filter(Boolean).join(", ")}
        </p>
        <p className="text-xs text-muted mt-1">{dateRange}</p>
      </div>
    </Link>
  );
}
