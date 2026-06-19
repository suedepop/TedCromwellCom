import Link from "next/link";
import type { Coaster, Park } from "@/lib/types";

export default function CoasterCard({
  coaster,
  park,
}: {
  coaster: Coaster;
  park?: Park | null;
}) {
  const cover = coaster.coverImageUrl;
  return (
    <Link
      href={`/coasters/${coaster.slug}`}
      className="flex flex-col h-full border border-border bg-surface rounded overflow-hidden hover:border-accent transition"
    >
      <div className="h-40 shrink-0 w-full bg-black overflow-hidden">
        {cover ? (
          <img src={cover} alt="" className="w-full h-full object-cover opacity-90" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted font-display text-lg px-4 text-center">
            {park?.name ?? "Coaster"}
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-display text-xl">{coaster.name}</h3>
        {park && (
          <p className="text-sm text-muted mt-1">
            {park.name}
            {park.city && ` · ${park.city}`}
            {park.country && ` · ${park.country}`}
          </p>
        )}
        <p className="text-xs text-muted mt-1">
          {[
            coaster.manufacturer,
            coaster.openedYear && `${coaster.openedYear}`,
            coaster.stats?.heightFeet && `${coaster.stats.heightFeet} ft`,
            coaster.stats?.topSpeedMph && `${coaster.stats.topSpeedMph} mph`,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
    </Link>
  );
}
