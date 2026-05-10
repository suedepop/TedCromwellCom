import Link from "next/link";
import { listArtists } from "@/lib/artists";

export const dynamic = "force-dynamic";

export default async function AdminArtistsList({
  searchParams,
}: {
  searchParams: { q?: string; filter?: string };
}) {
  const all = await listArtists();
  const q = (searchParams.q ?? "").trim().toLowerCase();
  const filter = searchParams.filter ?? ""; // "missing-mbid" | "missing-discogs" | "missing-doc" | "" (all)

  let filtered = all;
  if (q) filtered = filtered.filter((a) => a.name.toLowerCase().includes(q));
  if (filter === "missing-doc") filtered = filtered.filter((a) => !a.stored);
  if (filter === "missing-mbid")
    filtered = filtered.filter((a) => !a.stored?.musicbrainzId);
  if (filter === "missing-discogs")
    filtered = filtered.filter((a) => !a.stored?.discogsArtistId);

  const totals = {
    all: all.length,
    storedDocs: all.filter((a) => !!a.stored).length,
    missingDoc: all.filter((a) => !a.stored).length,
    missingMbid: all.filter((a) => !a.stored?.musicbrainzId).length,
    missingDiscogs: all.filter((a) => !a.stored?.discogsArtistId).length,
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-3xl">Artists</h1>
        <p className="text-xs text-muted">
          {totals.storedDocs} of {totals.all} have stored docs · {totals.missingMbid} missing MBID ·{" "}
          {totals.missingDiscogs} missing Discogs ID
        </p>
      </div>

      <form className="flex gap-2 text-sm flex-wrap">
        <input
          name="q"
          placeholder="Filter by name…"
          defaultValue={searchParams.q ?? ""}
          className="bg-surface border border-border rounded px-2 py-1 w-56"
        />
        <select
          name="filter"
          defaultValue={filter}
          className="bg-surface border border-border rounded px-2 py-1"
        >
          <option value="">All artists</option>
          <option value="missing-doc">Missing stored doc</option>
          <option value="missing-mbid">Missing MusicBrainz ID</option>
          <option value="missing-discogs">Missing Discogs ID</option>
        </select>
        <button className="bg-accent text-bg px-3 rounded">Filter</button>
        {(q || filter) && (
          <Link href="/admin/artists" className="text-xs text-muted hover:text-accent self-center">
            Clear
          </Link>
        )}
      </form>

      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-wider text-muted border-b border-border">
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2 w-20 text-right">Concerts</th>
            <th className="py-2 w-20 text-right">Records</th>
            <th className="py-2 w-20 text-center">MBID</th>
            <th className="py-2 w-20 text-center">Setlist</th>
            <th className="py-2 w-20 text-center">Discogs</th>
            <th className="py-2 w-24 text-center">Aliases</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((a) => {
            const s = a.stored;
            return (
              <tr key={a.slug} className="border-b border-border/50">
                <td className="py-2">
                  <Link href={`/admin/artists/${a.slug}`} className="hover:text-accent">
                    {a.name}
                  </Link>
                  {!s && (
                    <span className="ml-2 text-[10px] uppercase tracking-wider text-muted">
                      no doc
                    </span>
                  )}
                </td>
                <td className="py-2 text-right tabular-nums text-muted">{a.concerts.length || ""}</td>
                <td className="py-2 text-right tabular-nums text-muted">{a.records.length || ""}</td>
                <td className="py-2 text-center">
                  {s?.musicbrainzId ? (
                    <span className="text-accent">✓</span>
                  ) : (
                    <span className="text-muted">·</span>
                  )}
                </td>
                <td className="py-2 text-center">
                  {s?.setlistFmMbid ? (
                    <span className="text-accent">✓</span>
                  ) : (
                    <span className="text-muted">·</span>
                  )}
                </td>
                <td className="py-2 text-center">
                  {s?.discogsArtistId ? (
                    <span className="text-accent">✓</span>
                  ) : (
                    <span className="text-muted">·</span>
                  )}
                </td>
                <td className="py-2 text-center text-xs text-muted">
                  {s?.aliases?.length ?? 0}
                </td>
              </tr>
            );
          })}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={7} className="py-6 text-center text-muted">
                No artists match.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
