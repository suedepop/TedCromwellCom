import Link from "next/link";
import type { VinylRecord } from "@/lib/types";

export default function RecordCard({ record }: { record: VinylRecord }) {
  const cover = record.coverImageUrl ?? record.thumbnailUrl;
  const artists = record.artists.map((a) => a.name).join(" · ") || "Various";
  return (
    <Link
      href={`/vinyl/${record.slug ?? record.id}`}
      className="flex flex-col h-full border border-border bg-surface rounded overflow-hidden hover:border-accent transition"
    >
      <div className="aspect-square shrink-0 w-full bg-black overflow-hidden">
        {cover ? (
          <img src={cover} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted font-display text-3xl">
            {record.year ?? "—"}
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-xs text-muted">
          {record.year ?? "—"}
          {record.primaryFormat ? ` · ${record.primaryFormat}` : ""}
        </div>
        <h3 className="font-display text-xl mt-1">{record.title}</h3>
        <p className="text-sm text-muted mt-1 line-clamp-2">{artists}</p>
      </div>
    </Link>
  );
}
