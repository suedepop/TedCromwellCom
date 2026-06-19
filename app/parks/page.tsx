import Link from "next/link";
import dynamicImport from "next/dynamic";
import { listParkAggregates } from "@/lib/parks";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Parks",
  description: "Every amusement park where I've ridden a coaster, on a map.",
  path: "/parks",
});
export const dynamic = "force-dynamic";

const VenueMap = dynamicImport(() => import("@/components/venues/VenueMap"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-surface border border-border rounded" />,
});

export default async function ParksIndex({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const aggregates = await listParkAggregates();

  const q = (searchParams.q ?? "").trim().toLowerCase();
  const filtered = q
    ? aggregates.filter(
        ({ park }) =>
          park.name.toLowerCase().includes(q) ||
          park.city?.toLowerCase().includes(q) ||
          park.country?.toLowerCase().includes(q) ||
          park.aliases?.some((a) => a.toLowerCase().includes(q)),
      )
    : aggregates;

  const pins = filtered
    .filter(({ park }) => typeof park.lat === "number" && typeof park.lng === "number")
    .map(({ park, coasterCount }) => ({
      id: park.id,
      name: park.name,
      lat: park.lat!,
      lng: park.lng!,
      subtitle: `${coasterCount} ${coasterCount === 1 ? "coaster" : "coasters"} · ${park.city ?? park.country}`,
      href: `/parks/${park.slug}`,
    }));

  // Sort by coaster count desc, then name.
  const sorted = [...filtered].sort((a, b) => {
    if (b.coasterCount !== a.coasterCount) return b.coasterCount - a.coasterCount;
    return a.park.name.localeCompare(b.park.name, undefined, { sensitivity: "base" });
  });

  const countryCount = new Set(aggregates.map((a) => a.park.country)).size;

  return (
    <section className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl">Parks</h1>
          <p className="text-muted mt-2">
            {q
              ? `${filtered.length} of ${aggregates.length} parks match "${searchParams.q}".`
              : `${aggregates.length} parks across ${countryCount} ${countryCount === 1 ? "country" : "countries"}.`}
          </p>
        </div>
        <form className="flex gap-2 text-sm">
          <input
            name="q"
            placeholder="Park, city, or country…"
            defaultValue={searchParams.q ?? ""}
            className="bg-surface border border-border rounded px-2 py-1 w-56"
          />
          <button className="bg-accent text-bg px-3 rounded">Filter</button>
          {q && (
            <Link href="/parks" className="text-xs text-muted hover:text-accent self-center">
              Clear
            </Link>
          )}
        </form>
      </header>
      <VenueMap pins={pins} height={420} zoomBoost={4} />
      <ul className="grid sm:grid-cols-2 gap-3">
        {sorted.map(({ park, coasterCount }) => (
          <li key={park.id} className="border border-border rounded p-4 bg-surface">
            <Link href={`/parks/${park.slug}`} className="font-display text-lg hover:text-accent">
              {park.name}
            </Link>
            <div className="text-sm text-muted">
              {park.city}{park.state ? `, ${park.state}` : ""}
              {park.country ? ` · ${park.country}` : ""}
            </div>
            <div className="text-xs text-muted mt-1">
              {coasterCount} {coasterCount === 1 ? "coaster" : "coasters"}
              {park.closed && " · closed"}
            </div>
          </li>
        ))}
        {sorted.length === 0 && (
          <li className="col-span-full text-muted text-sm">No parks match.</li>
        )}
      </ul>
    </section>
  );
}
