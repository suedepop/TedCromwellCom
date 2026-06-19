import Link from "next/link";
import { listCoasters } from "@/lib/coasters";
import { listParks } from "@/lib/parks";
import NewCoasterForm from "./NewCoasterForm";

export const dynamic = "force-dynamic";

export default async function AdminCoastersList({
  searchParams,
}: {
  searchParams: { park?: string; q?: string };
}) {
  const [allCoasters, allParks] = await Promise.all([listCoasters(), listParks()]);
  const parksById = new Map(allParks.map((p) => [p.id, p]));

  const q = (searchParams.q ?? "").trim().toLowerCase();
  const filtered = allCoasters.filter((c) => {
    if (searchParams.park && c.parkId !== searchParams.park) return false;
    if (q) {
      const haystack = [c.name, parksById.get(c.parkId)?.name, c.manufacturer]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <h1 className="font-display text-3xl">Coasters</h1>
        <p className="text-xs text-muted">
          {filtered.length}
          {filtered.length !== allCoasters.length && ` of ${allCoasters.length}`} coasters ·{" "}
          {allParks.length} parks
        </p>
      </div>
      <NewCoasterForm parks={allParks} />
      <form className="flex gap-2 text-sm">
        <input
          name="q"
          placeholder="Coaster, park, manufacturer…"
          defaultValue={searchParams.q ?? ""}
          className="flex-1 bg-surface border border-border rounded px-2 py-1.5"
        />
        <select
          name="park"
          defaultValue={searchParams.park ?? ""}
          className="bg-surface border border-border rounded px-2 py-1.5"
        >
          <option value="">All parks</option>
          {allParks.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button className="bg-accent text-bg px-3 rounded">Filter</button>
        {(q || searchParams.park) && (
          <Link href="/admin/coasters" className="text-xs text-muted self-center hover:text-accent">
            Clear
          </Link>
        )}
      </form>
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-wider text-muted border-b border-border">
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Park</th>
            <th className="py-2">Manufacturer</th>
            <th className="py-2">Year</th>
            <th className="py-2">Stats</th>
            <th className="py-2">Ext IDs</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c) => {
            const park = parksById.get(c.parkId);
            return (
              <tr key={c.id} className="border-b border-border/50">
                <td className="py-2">
                  <Link href={`/admin/coasters/${c.slug}`} className="hover:text-accent">
                    {c.name}
                  </Link>
                </td>
                <td className="py-2 text-muted">
                  {park ? (
                    <Link href={`/admin/parks/${park.slug}`} className="hover:text-accent">
                      {park.name}
                    </Link>
                  ) : (
                    <span className="text-red-400">{c.parkId}</span>
                  )}
                </td>
                <td className="py-2 text-muted text-xs">{c.manufacturer ?? "—"}</td>
                <td className="py-2 text-muted text-xs">{c.openedYear ?? "—"}</td>
                <td className="py-2 text-muted text-xs">
                  {[
                    c.stats?.heightFeet && `${c.stats.heightFeet}ft`,
                    c.stats?.topSpeedMph && `${c.stats.topSpeedMph}mph`,
                    typeof c.stats?.inversions === "number" && `${c.stats.inversions} inv`,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </td>
                <td className="py-2 text-muted text-xs">
                  {c.externalIds?.coasterCountId && `cc:${c.externalIds.coasterCountId}`}
                  {c.externalIds?.coasterCountId && c.externalIds?.rcdbId && " · "}
                  {c.externalIds?.rcdbId && `rcdb:${c.externalIds.rcdbId}`}
                </td>
              </tr>
            );
          })}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={6} className="py-6 text-muted text-center">
                No coasters yet — add one above or sync from coaster-count via Maintenance.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
