import ConcertsInfiniteList from "./ConcertsInfiniteList";
import TodayInHistory from "@/components/concerts/TodayInHistory";
import VenueChips from "@/components/concerts/VenueChips";
import { listConcerts } from "@/lib/concerts";
import { listVenues } from "@/lib/venues";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Concerts",
  description: "Every concert I've been to — setlists, photos, and notes.",
  path: "/concerts",
});
export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export default async function ConcertsPage({
  searchParams,
}: {
  searchParams: { year?: string; artist?: string; venueId?: string };
}) {
  const filters = {
    venueId: searchParams.venueId,
    year: searchParams.year,
    artist: searchParams.artist,
  };
  const all = await listConcerts(filters);
  const initial = all.slice(0, PAGE_SIZE);
  const years = Array.from(
    new Set(all.map((c) => new Date(c.date).getFullYear().toString())),
  ).sort((a, b) => Number(b) - Number(a));

  const qs = new URLSearchParams();
  if (filters.venueId) qs.set("venueId", filters.venueId);
  if (filters.year) qs.set("year", filters.year);
  if (filters.artist) qs.set("artist", filters.artist);

  // "Today in concert history" — same MM-DD across years (uses full unfiltered set)
  const allUnfiltered = filters.year || filters.artist || filters.venueId
    ? await listConcerts()
    : all;
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayMmDd = `${mm}-${dd}`;
  const todayInHistory = allUnfiltered
    .filter((c) => c.date && c.date.slice(5) === todayMmDd)
    .sort((a, b) => b.date.localeCompare(a.date));

  const venues = await listVenues();
  const showCounts = new Map<string, number>();
  for (const c of allUnfiltered) {
    showCounts.set(c.venueId, (showCounts.get(c.venueId) ?? 0) + 1);
  }

  return (
    <section className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl">Concerts</h1>
          <p className="text-muted mt-2">{all.length} shows logged.</p>
        </div>
        <form className="flex gap-2 text-sm">
          <select
            name="year"
            defaultValue={searchParams.year ?? ""}
            className="bg-surface border border-border rounded px-2 py-1"
          >
            <option value="">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <input
            name="artist"
            placeholder="Artist…"
            defaultValue={searchParams.artist ?? ""}
            className="bg-surface border border-border rounded px-2 py-1"
          />
          <button className="bg-accent text-bg px-3 rounded">Filter</button>
        </form>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {all.length === 0 ? (
            <p className="text-muted">No concerts yet — run an import from the admin.</p>
          ) : (
            <ConcertsInfiniteList
              initialItems={initial}
              total={all.length}
              pageSize={PAGE_SIZE}
              queryString={qs.toString()}
            />
          )}
        </div>
        <div className="lg:col-span-1 space-y-6">
          <TodayInHistory concerts={todayInHistory} />
          <VenueChips venues={venues} showCounts={showCounts} />
        </div>
      </div>
    </section>
  );
}
