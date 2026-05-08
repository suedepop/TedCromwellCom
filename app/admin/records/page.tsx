import Link from "next/link";
import { listRecords } from "@/lib/records";

export const dynamic = "force-dynamic";

export default async function AdminRecordsList() {
  const records = await listRecords({ includeHidden: true, sort: "added" });
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Vinyl</h1>
        <Link
          href="/admin/records/import"
          className="bg-accent text-bg px-3 py-1.5 rounded text-sm"
        >
          Import from Discogs
        </Link>
      </div>
      <p className="text-muted text-sm">{records.length} records.</p>
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-wider text-muted border-b border-border">
          <tr>
            <th className="py-2 w-16">Year</th>
            <th className="py-2">Title</th>
            <th className="py-2">Artist(s)</th>
            <th className="py-2 w-32">Format</th>
            <th className="py-2 w-16 text-right">State</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="border-b border-border/50">
              <td className="py-2 text-muted">{r.year ?? "—"}</td>
              <td className="py-2">
                <Link href={`/admin/records/${r.id}`} className="hover:text-accent">
                  {r.title}
                </Link>
              </td>
              <td className="py-2 text-muted truncate max-w-xs">
                {r.artists.map((a) => a.name).join(", ")}
              </td>
              <td className="py-2 text-muted text-xs">{r.primaryFormat}</td>
              <td className="py-2 text-right text-xs">
                {r.hidden ? <span className="text-red-400">Hidden</span> : <span className="text-muted">—</span>}
              </td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-muted text-center">
                No records yet — run an import.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
