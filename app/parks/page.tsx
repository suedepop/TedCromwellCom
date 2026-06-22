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
  searchParams: { q?: string; country?: string };
}) {
  const aggregates = await listParkAggregates();

  const q = (searchParams.q ?? "").trim().toLowerCase();
  const selectedCountry = searchParams.country ?? "";
  const filtered = aggregates.filter(({ park }) => {
    if (selectedCountry && park.country !== selectedCountry) return false;
    if (q) {
      const hay =
        `${park.name} ${park.city ?? ""} ${park.country ?? ""} ${(park.aliases ?? []).join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  // Country chip data — count parks per country, sort by count desc then name.
  const byCountry = new Map<string, number>();
  for (const { park } of aggregates) {
    byCountry.set(park.country, (byCountry.get(park.country) ?? 0) + 1);
  }
  const countryChips = [...byCountry.entries()].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });

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
            {q || selectedCountry
              ? `${filtered.length} of ${aggregates.length} parks match.`
              : `${aggregates.length} parks across ${countryCount} ${countryCount === 1 ? "country" : "countries"}.`}
          </p>
        </div>
        <form className="flex gap-2 text-sm">
          {selectedCountry && (
            <input type="hidden" name="country" value={selectedCountry} />
          )}
          <input
            name="q"
            placeholder="Park, city, or country…"
            defaultValue={searchParams.q ?? ""}
            className="bg-surface border border-border rounded px-2 py-1 w-56"
          />
          <button className="bg-accent text-bg px-3 rounded">Filter</button>
          {(q || selectedCountry) && (
            <Link href="/parks" className="text-xs text-muted hover:text-accent self-center">
              Clear
            </Link>
          )}
        </form>
      </header>

      {countryChips.length > 1 && (
        <nav aria-label="Country" className="flex flex-wrap gap-1 text-xs">
          {countryChips.map(([country, count]) => {
            const active = selectedCountry === country;
            const href = active
              ? q
                ? `/parks?q=${encodeURIComponent(q)}`
                : "/parks"
              : `/parks?country=${encodeURIComponent(country)}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
            return (
              <Link
                key={country}
                href={href}
                className={`border rounded px-2 py-1 ${active ? "border-accent text-accent" : "border-border hover:border-accent hover:text-accent"}`}
              >
                {country} <span className="text-muted">({count})</span>
              </Link>
            );
          })}
        </nav>
      )}
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
