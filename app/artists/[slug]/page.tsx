import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConcertCard from "@/components/concerts/ConcertCard";
import RecordCard from "@/components/vinyl/RecordCard";
import { getArtist } from "@/lib/artists";
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
    type: "profile",
  });
}

export default async function ArtistPage({ params }: { params: { slug: string } }) {
  const artist = await getArtist(params.slug);
  if (!artist) notFound();

  return (
    <article className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(artistMusicGroupJsonLd(artist)) }}
      />
      <header>
        <p className="text-xs uppercase tracking-wider text-muted">Artist</p>
        <h1 className="font-display text-4xl md:text-5xl">{artist.name}</h1>
        <p className="text-sm text-muted mt-2">
          {artist.concerts.length} {artist.concerts.length === 1 ? "concert" : "concerts"} ·{" "}
          {artist.records.length} {artist.records.length === 1 ? "record" : "records"}
        </p>
      </header>

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
