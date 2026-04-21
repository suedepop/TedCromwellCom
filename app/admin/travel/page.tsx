import Link from "next/link";
import ExportButton from "./ExportButton";
import { listTravelEntries } from "@/lib/travel";

export const dynamic = "force-dynamic";

export default async function AdminTravelList() {
  const entries = await listTravelEntries();
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Travel entries</h1>
        <div className="flex gap-2">
          <ExportButton />
          <Link href="/admin/travel/new" className="bg-accent text-bg px-3 py-1.5 rounded text-sm">
            New entry
          </Link>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-wider text-muted border-b border-border">
          <tr>
            <th className="py-2">Location</th>
            <th className="py-2">Where</th>
            <th className="py-2 w-40">Dates</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id} className="border-b border-border/50">
              <td className="py-2">
                <Link href={`/admin/travel/${e.id}`} className="hover:text-accent">
                  {e.locationName}
                </Link>
              </td>
              <td className="py-2 text-muted">
                {[e.city, e.state, e.country].filter(Boolean).join(", ")}
              </td>
              <td className="py-2 text-muted">
                {e.startDate}
                {e.endDate && e.endDate !== e.startDate ? ` → ${e.endDate}` : ""}
              </td>
            </tr>
          ))}
          {entries.length === 0 && (
            <tr>
              <td colSpan={3} className="py-6 text-muted text-center">
                No travel entries yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
