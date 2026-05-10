import Link from "next/link";
import { listConcerts } from "@/lib/concerts";
import { concertBandLine } from "@/lib/concertDisplay";
import FacebookPostedIcon from "@/components/admin/FacebookPostedIcon";

export const dynamic = "force-dynamic";

function TicketIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}

function CameraIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

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
            <th className="py-2 w-24">Media</th>
            <th className="py-2 w-8"></th>
          </tr>
        </thead>
        <tbody>
          {concerts.map((c) => {
            const stubCount = c.ticketStubs?.length ?? 0;
            const photoCount = c.photos?.length ?? 0;
            return (
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
                <td className="py-2">
                  <div className="flex items-center gap-3 text-muted">
                    {stubCount > 0 && (
                      <span
                        className="flex items-center gap-1 text-accent"
                        title={`${stubCount} ticket stub${stubCount === 1 ? "" : "s"}`}
                      >
                        <TicketIcon />
                      </span>
                    )}
                    {photoCount > 0 && (
                      <span
                        className="flex items-center gap-1 text-accent"
                        title={`${photoCount} photo${photoCount === 1 ? "" : "s"}`}
                      >
                        <CameraIcon />
                        <span className="text-xs font-mono">{photoCount}</span>
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2 text-right">
                  <FacebookPostedIcon
                    lastPostedAt={c.lastPostedToFacebookAt}
                    lastPostedUrl={c.lastPostedToFacebookUrl}
                  />
                </td>
              </tr>
            );
          })}
          {concerts.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-muted text-center">
                No concerts yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
