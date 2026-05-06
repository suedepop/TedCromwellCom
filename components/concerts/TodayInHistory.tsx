import Link from "next/link";
import type { Concert } from "@/lib/types";
import { concertBandLine } from "@/lib/concertDisplay";

function yearsAgo(showYear: number, currentYear: number): string {
  const diff = currentYear - showYear;
  if (diff <= 0) return "This year";
  if (diff === 1) return "1 Year Ago";
  return `${diff} Years Ago`;
}

export default function TodayInHistory({ concerts }: { concerts: Concert[] }) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const monthDay = today.toLocaleDateString(undefined, { month: "long", day: "numeric" });

  return (
    <aside className="border border-accent/30 bg-surface rounded p-4">
      <div className="text-[10px] uppercase tracking-wider text-accent mb-1">
        Today in Concert History
      </div>
      <h2 className="font-display text-xl mb-3">{monthDay}</h2>
      {concerts.length === 0 ? (
        <p className="text-muted text-sm">No shows on this day. Check back tomorrow.</p>
      ) : (
        <ul className="space-y-3">
          {concerts.map((c) => {
            const showYear = new Date(c.date).getFullYear();
            return (
              <li key={c.id} className="border-t border-border pt-3 first:border-t-0 first:pt-0">
                <Link href={`/concerts/${c.slug ?? c.id}`} className="block hover:text-accent">
                  <div className="text-xs uppercase tracking-wider text-accent font-medium">
                    {yearsAgo(showYear, currentYear)}
                  </div>
                  <div className="text-xs text-muted mt-0.5">{showYear}</div>
                  <div className="font-display text-base leading-tight mt-1">
                    {concertBandLine(c)}
                  </div>
                  <div className="text-xs text-muted mt-1">{c.venueNameRaw}</div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
