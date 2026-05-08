import Link from "next/link";
import { listArtists } from "@/lib/artists";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Artists",
  description:
    "Every artist whose music shows up on this site — combined view of concerts attended and records owned.",
  path: "/artists",
});
export const dynamic = "force-dynamic";

export default async function ArtistsIndex() {
  const artists = await listArtists();
  // Group alphabetically. Use first letter; numerics + symbols → "#".
  const groups = new Map<string, typeof artists>();
  for (const a of artists) {
    const ch = (a.name[0] ?? "#").toUpperCase();
    const key = /[A-Z]/.test(ch) ? ch : "#";
    const arr = groups.get(key) ?? [];
    arr.push(a);
    groups.set(key, arr);
  }
  const letters = [...groups.keys()].sort();

  return (
    <section className="space-y-8">
      <header>
        <h1 className="font-display text-4xl">Artists</h1>
        <p className="text-muted mt-2">
          {artists.length} artists across the concert + vinyl collections.
        </p>
      </header>

      <nav aria-label="A–Z" className="flex flex-wrap gap-1 text-xs">
        {letters.map((l) => (
          <a
            key={l}
            href={`#letter-${l}`}
            className="border border-border rounded px-2 py-1 hover:border-accent hover:text-accent"
          >
            {l}
          </a>
        ))}
      </nav>

      <div className="space-y-8">
        {letters.map((l) => (
          <section key={l} id={`letter-${l}`} className="scroll-mt-20 space-y-3">
            <h2 className="font-display text-2xl border-b border-border pb-2">{l}</h2>
            <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
              {(groups.get(l) ?? []).map((a) => (
                <li key={a.slug}>
                  <Link href={`/artists/${a.slug}`} className="hover:text-accent">
                    {a.name}
                  </Link>{" "}
                  <span className="text-muted text-xs">
                    {a.concerts.length > 0 && `${a.concerts.length} ${a.concerts.length === 1 ? "show" : "shows"}`}
                    {a.concerts.length > 0 && a.records.length > 0 && " · "}
                    {a.records.length > 0 && `${a.records.length} ${a.records.length === 1 ? "record" : "records"}`}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
