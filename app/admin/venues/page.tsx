import Link from "next/link";
import { listVenues } from "@/lib/venues";

export const dynamic = "force-dynamic";

export default async function AdminVenuesList() {
  const venues = await listVenues();
  return (
    <section className="space-y-6">
      <h1 className="font-display text-3xl">Venues</h1>
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-wider text-muted border-b border-border">
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">City</th>
            <th className="py-2">Aliases</th>
            <th className="py-2">Coords</th>
          </tr>
        </thead>
        <tbody>
          {venues.map((v) => (
            <tr key={v.id} className="border-b border-border/50">
              <td className="py-2">
                <Link href={`/admin/venues/${v.id}`} className="hover:text-accent">
                  {v.canonicalName}
                </Link>
              </td>
              <td className="py-2 text-muted">{v.city}, {v.country}</td>
              <td className="py-2 text-muted text-xs">{v.aliases.length}</td>
              <td className="py-2 text-muted text-xs">
                {typeof v.lat === "number" ? `${v.lat.toFixed(2)}, ${v.lng?.toFixed(2)}` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
