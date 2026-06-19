import Link from "next/link";
import { listCoasters } from "@/lib/coasters";
import { listParks } from "@/lib/parks";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Coasters",
  description: "Every roller coaster I've ridden, with stats and park groupings.",
  path: "/coasters",
});
export const dynamic = "force-dynamic";

export default async function CoastersIndex({
  searchParams,
}: {
  searchParams: { q?: string; park?: string; manufacturer?: string; type?: string; country?: string };
}) {
  const [allCoasters, allParks] = await Promise.all([listCoasters(), listParks()]);
  const parksById = new Map(allParks.map((p) => [p.id, p]));

  const q = (searchParams.q ?? "").trim().toLowerCase();
  const filtered = allCoasters.filter((c) => {
    const park = parksById.get(c.parkId);
    if (q) {
      const haystack = [c.name, park?.name, c.manufacturer, c.type]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (searchParams.park && c.parkId !== searchParams.park) return false;
    if (
      searchParams.manufacturer &&
      c.manufacturer?.toLowerCase() !== searchParams.manufacturer.toLowerCase()
    )
      return false;
    if (searchParams.type && c.type !== searchParams.type) return false;
    if (searchParams.country && park?.country !== searchParams.country) return false;
    return true;
  });

  // Group by country → park, alphabetical within each.
  const groups = new Map<string, Map<string, typeof filtered>>();
  for (const c of filtered) {
    const park = parksById.get(c.parkId);
    const country = park?.country ?? "Unknown";
    const parkLabel = park?.name ?? c.parkId;
    let byPark = groups.get(country);
    if (!byPark) {
      byPark = new Map();
      groups.set(country, byPark);
    }
    const arr = byPark.get(parkLabel) ?? [];
    arr.push(c);
    byPark.set(parkLabel, arr);
  }
  const countries = [...groups.keys()].sort();
  const countryCount = new Set(allParks.map((p) => p.country)).size;
  const parkCount = new Set(allCoasters.map((c) => c.parkId)).size;

  // Unique values for filter chips.
  const allManufacturers = Array.from(
    new Set(allCoasters.map((c) => c.manufacturer).filter(Boolean) as string[]),
  ).sort();

  return (
    <section className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl">Coasters</h1>
          <p className="text-muted mt-2">
            {q || searchParams.park || searchParams.manufacturer || searchParams.type || searchParams.country
              ? `${filtered.length} of ${allCoasters.length} coasters match.`
              : `${allCoasters.length} coasters across ${parkCount} parks in ${countryCount} ${countryCount === 1 ? "country" : "countries"}.`}
          </p>
        </div>
        <form className="flex gap-2 text-sm flex-wrap">
          <input
            name="q"
            placeholder="Coaster, park, manufacturer…"
            defaultValue={searchParams.q ?? ""}
            className="bg-surface border border-border rounded px-2 py-1 w-56"
          />
          <button className="bg-accent text-bg px-3 rounded">Filter</button>
          {(q || searchParams.park || searchParams.manufacturer || searchParams.type || searchParams.country) && (
            <Link href="/coasters" className="text-xs text-muted hover:text-accent self-center">
              Clear
            </Link>
          )}
        </form>
      </header>

      {allManufacturers.length > 1 && (
        <nav aria-label="Manufacturer" className="flex flex-wrap gap-1 text-xs">
          <span className="text-muted self-center mr-1">Manufacturer:</span>
          {allManufacturers.slice(0, 24).map((m) => {
            const active = searchParams.manufacturer?.toLowerCase() === m.toLowerCase();
            const href = active
              ? "/coasters"
              : `/coasters?manufacturer=${encodeURIComponent(m)}`;
            return (
              <Link
                key={m}
                href={href}
                className={`border rounded px-2 py-1 ${active ? "border-accent text-accent" : "border-border hover:border-accent hover:text-accent"}`}
              >
                {m}
              </Link>
            );
          })}
        </nav>
      )}

      <div className="space-y-8">
        {countries.map((country) => {
          const parks = [...groups.get(country)!.entries()].sort((a, b) =>
            a[0].localeCompare(b[0], undefined, { sensitivity: "base" }),
          );
          return (
            <section key={country} className="space-y-5">
              <h2 className="font-display text-2xl border-b border-border pb-2">{country}</h2>
              {parks.map(([parkLabel, coasters]) => {
                const park = parksById.get(coasters[0].parkId);
                return (
                  <div key={parkLabel} className="space-y-2">
                    <h3 className="text-lg">
                      {park ? (
                        <Link href={`/parks/${park.slug}`} className="hover:text-accent">
                          {parkLabel}
                        </Link>
                      ) : (
                        parkLabel
                      )}{" "}
                      <span className="text-xs text-muted">
                        {coasters.length} {coasters.length === 1 ? "coaster" : "coasters"}
                      </span>
                    </h3>
                    <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-sm">
                      {coasters
                        .sort((a, b) =>
                          a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
                        )
                        .map((c) => (
                          <li key={c.slug}>
                            <Link href={`/coasters/${c.slug}`} className="hover:text-accent">
                              {c.name}
                            </Link>
                            {c.openedYear && (
                              <span className="text-xs text-muted ml-2">({c.openedYear})</span>
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                );
              })}
            </section>
          );
        })}
        {filtered.length === 0 && <p className="text-muted text-sm">No coasters match.</p>}
      </div>
    </section>
  );
}
