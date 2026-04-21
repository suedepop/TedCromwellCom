import Link from "next/link";
import { listConcerts } from "@/lib/concerts";
import { concertBandLine } from "@/lib/concertDisplay";

export const dynamic = "force-dynamic";

export default async function AdminConcertsList() {
  const concerts = await listConcerts();
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Concerts</h1>
        <Link
          href="/admin/concerts/import"
          className="bg-accent text-bg px-3 py-1.5 rounded text-sm"
        >
          Run Import
        </Link>
      </div>
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-wider text-muted border-b border-border">
          <tr>
            <th className="py-2 w-28">Date</th>
            <th className="py-2">Artist(s)</th>
            <th className="py-2">Venue</th>
          </tr>
        </thead>
        <tbody>
          {concerts.map((c) => (
            <tr key={c.id} className="border-b border-border/50">
              <td className="py-2 text-muted">{c.date}</td>
              <td className="py-2">
                <Link href={`/admin/concerts/${c.id}`} className="hover:text-accent">
                  {c.eventName ? (
                    <>
                      <span className="text-accent">{c.eventName}</span>
                      <span className="text-muted"> — {concertBandLine(c)}</span>
                    </>
                  ) : (
                    concertBandLine(c)
                  )}
                </Link>
              </td>
              <td className="py-2 text-muted">{c.venueNameRaw}</td>
            </tr>
          ))}
          {concerts.length === 0 && (
            <tr>
              <td colSpan={3} className="py-6 text-muted text-center">
                No concerts yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
