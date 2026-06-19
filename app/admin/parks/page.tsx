import Link from "next/link";
import { listParkAggregates } from "@/lib/parks";
import NewParkForm from "./NewParkForm";

export const dynamic = "force-dynamic";

export default async function AdminParksList() {
  const aggregates = await listParkAggregates();
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <h1 className="font-display text-3xl">Parks</h1>
        <p className="text-xs text-muted">
          {aggregates.length} parks ·{" "}
          {aggregates.reduce((acc, a) => acc + a.coasterCount, 0)} coasters
        </p>
      </div>
      <NewParkForm />
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-wider text-muted border-b border-border">
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Location</th>
            <th className="py-2">Coasters</th>
            <th className="py-2">Coords</th>
            <th className="py-2">Ext IDs</th>
          </tr>
        </thead>
        <tbody>
          {aggregates.map(({ park, coasterCount }) => (
            <tr key={park.id} className="border-b border-border/50">
              <td className="py-2">
                <Link href={`/admin/parks/${park.slug}`} className="hover:text-accent">
                  {park.name}
                </Link>
                {park.closed && <span className="ml-2 text-xs text-red-400">closed</span>}
              </td>
              <td className="py-2 text-muted">
                {[park.city, park.state, park.country].filter(Boolean).join(", ")}
              </td>
              <td className="py-2 text-muted text-xs">{coasterCount}</td>
              <td className="py-2 text-muted text-xs">
                {typeof park.lat === "number"
                  ? `${park.lat.toFixed(2)}, ${park.lng?.toFixed(2)}`
                  : "—"}
              </td>
              <td className="py-2 text-muted text-xs">
                {park.externalIds?.coasterCountId && `cc:${park.externalIds.coasterCountId}`}
                {park.externalIds?.coasterCountId && park.externalIds?.rcdbId && " · "}
                {park.externalIds?.rcdbId && `rcdb:${park.externalIds.rcdbId}`}
              </td>
            </tr>
          ))}
          {aggregates.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-muted text-center">
                No parks yet — create one above or sync from coaster-count via Maintenance.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
