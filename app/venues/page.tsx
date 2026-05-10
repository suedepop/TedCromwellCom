import Link from "next/link";
import dynamicImport from "next/dynamic";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Venues",
  description: "Every place I've seen live music, on a map.",
  path: "/venues",
});
import { listVenues } from "@/lib/venues";
import { listConcerts } from "@/lib/concerts";

export const dynamic = "force-dynamic";

const VenueMap = dynamicImport(() => import("@/components/venues/VenueMap"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-surface border border-border rounded" />,
});

export default async function VenuesPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const [venues, concerts] = await Promise.all([listVenues(), listConcerts()]);
  const counts = new Map<string, number>();
  for (const c of concerts) counts.set(c.venueId, (counts.get(c.venueId) ?? 0) + 1);

  const pins = venues
    .filter((v) => typeof v.lat === "number" && typeof v.lng === "number")
    .map((v) => ({
      id: v.id,
      name: v.canonicalName,
      lat: v.lat!,
      lng: v.lng!,
      subtitle: `${counts.get(v.id) ?? 0} shows · ${v.city}`,
      href: `/venues/${v.id}`,
    }));

  const q = (searchParams.q ?? "").trim().toLowerCase();
  const filtered = q
    ? venues.filter(
        (v) =>
          v.canonicalName.toLowerCase().includes(q) ||
          v.city?.toLowerCase().includes(q) ||
          v.aliases?.some((a) => a.toLowerCase().includes(q)),
      )
    : venues;

  const sorted = [...filtered].sort(
    (a, b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0),
  );

  return (
    <section className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl">Venues</h1>
          <p className="text-muted mt-2">
            {q
              ? `${filtered.length} of ${venues.length} venues match "${searchParams.q}".`
              : `${venues.length} places I've seen music.`}
          </p>
        </div>
        <form className="flex gap-2 text-sm">
          <input
            name="q"
            placeholder="Filter by name or city…"
            defaultValue={searchParams.q ?? ""}
            className="bg-surface border border-border rounded px-2 py-1 w-56"
          />
          <button className="bg-accent text-bg px-3 rounded">Filter</button>
          {q && (
            <Link href="/venues" className="text-xs text-muted hover:text-accent self-center">
              Clear
            </Link>
          )}
        </form>
      </header>
      <VenueMap pins={pins} height={420} zoomBoost={4} />
      <ul className="grid sm:grid-cols-2 gap-3">
        {sorted.map((v) => (
          <li key={v.id} className="border border-border rounded p-4 bg-surface">
            <Link href={`/venues/${v.id}`} className="font-display text-lg hover:text-accent">
              {v.canonicalName}
            </Link>
            <div className="text-sm text-muted">
              {v.city}{v.state ? `, ${v.state}` : ""} · {v.country}
            </div>
            <div className="text-xs text-muted mt-1">{counts.get(v.id) ?? 0} shows</div>
          </li>
        ))}
        {sorted.length === 0 && (
          <li className="col-span-full text-muted text-sm">No venues match.</li>
        )}
      </ul>
    </section>
  );
}
