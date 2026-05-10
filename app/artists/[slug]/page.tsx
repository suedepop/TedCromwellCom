import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConcertCard from "@/components/concerts/ConcertCard";
import RecordCard from "@/components/vinyl/RecordCard";
import PostBody from "@/components/blog/PostBody";
import {
  getArtist,
  musicbrainzUrl,
  setlistFmArtistUrl,
  discogsArtistUrl,
} from "@/lib/artists";
import { pageMetadata } from "@/lib/metadata";
import { artistMusicGroupJsonLd, jsonLdScript } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const artist = await getArtist(params.slug);
  if (!artist) return {};
  const parts: string[] = [];
  if (artist.concerts.length > 0)
    parts.push(`${artist.concerts.length} concert${artist.concerts.length === 1 ? "" : "s"}`);
  if (artist.records.length > 0)
    parts.push(`${artist.records.length} record${artist.records.length === 1 ? "" : "s"}`);
  return pageMetadata({
    title: artist.name,
    description: parts.length
      ? `${artist.name} — ${parts.join(" · ")} from my collection.`
      : artist.name,
    path: `/artists/${artist.slug}`,
    imageUrl: artist.stored?.imageUrl,
    type: "profile",
  });
}

export default async function ArtistPage({ params }: { params: { slug: string } }) {
  const artist = await getArtist(params.slug);
  if (!artist) notFound();

  const s = artist.stored;
  const links: { href: string; label: string }[] = [];
  const mb = musicbrainzUrl(s?.musicbrainzId);
  if (mb) links.push({ href: mb, label: "MusicBrainz" });
  const setlist = setlistFmArtistUrl(s?.setlistFmMbid, artist.name);
  if (setlist && s?.setlistFmMbid) links.push({ href: setlist, label: "setlist.fm" });
  const discogs = discogsArtistUrl(s?.discogsArtistId);
  if (discogs) links.push({ href: discogs, label: "Discogs" });

  return (
    <article className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            artistMusicGroupJsonLd({
              name: artist.name,
              slug: artist.slug,
              concerts: artist.concerts,
              records: artist.records,
              sameAs: [mb, setlist && s?.setlistFmMbid ? setlist : null, discogs].filter(
                (u): u is string => !!u,
              ),
              image: artist.stored?.imageUrl,
            }),
          ),
        }}
      />
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-muted">Artist</p>
        <h1 className="font-display text-4xl md:text-5xl">{artist.name}</h1>
        <p className="text-sm text-muted">
          {artist.concerts.length} {artist.concerts.length === 1 ? "concert" : "concerts"} ·{" "}
          {artist.records.length} {artist.records.length === 1 ? "record" : "records"}
        </p>
        {links.length > 0 && (
          <ul className="flex flex-wrap gap-3 text-xs pt-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-border rounded px-2 py-1 hover:border-accent hover:text-accent transition"
                >
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        )}
      </header>

      {s?.description && <PostBody content={s.description} />}

      {artist.concerts.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-2xl">Concerts</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {artist.concerts.map((c) => (
              <ConcertCard key={c.id} concert={c} />
            ))}
          </div>
        </section>
      )}

      {artist.records.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-2xl">Vinyl</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {artist.records.map((r) => (
              <RecordCard key={r.id} record={r} />
            ))}
          </div>
        </section>
      )}

      {artist.concerts.length === 0 && artist.records.length === 0 && (
        <p className="text-muted">No content yet for this artist.</p>
      )}
    </article>
  );
}
