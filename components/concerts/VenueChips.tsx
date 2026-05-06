import Link from "next/link";
import type { Venue } from "@/lib/types";

interface Props {
  venues: Venue[];
  showCounts?: Map<string, number>;
}

export default function VenueChips({ venues, showCounts }: Props) {
  if (venues.length === 0) return null;
  const sorted = showCounts
    ? [...venues].sort((a, b) => (showCounts.get(b.id) ?? 0) - (showCounts.get(a.id) ?? 0))
    : [...venues].sort((a, b) => a.canonicalName.localeCompare(b.canonicalName));

  return (
    <aside className="border border-border bg-surface rounded p-4">
      <div className="text-[10px] uppercase tracking-wider text-accent mb-1">Venues</div>
      <h2 className="font-display text-xl mb-3">{venues.length} places</h2>
      <ul className="flex flex-wrap gap-2">
        {sorted.map((v) => {
          const count = showCounts?.get(v.id);
          return (
            <li key={v.id}>
              <Link
                href={`/venues/${v.id}`}
                className="inline-flex items-center gap-1.5 border border-border rounded-full px-3 py-1 text-xs hover:border-accent hover:text-accent transition"
              >
                <span>{v.canonicalName}</span>
                {typeof count === "number" && count > 0 && (
                  <span className="text-muted">· {count}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
