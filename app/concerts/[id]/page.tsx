import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/metadata";
import { concertEventJsonLd, jsonLdScript } from "@/lib/jsonld";
import Breadcrumbs from "@/components/Breadcrumbs";
import PhotoLightbox from "@/components/media/PhotoLightbox";
import PostBody from "@/components/blog/PostBody";
import SetlistBlock from "@/components/concerts/SetlistBlock";
import { findConcertBySlugOrId } from "@/lib/concerts";
import { getVenue } from "@/lib/venues";
import { concertBandLine } from "@/lib/concertDisplay";
import { youtubeEmbedUrl } from "@/lib/youtube";
import { listRecords } from "@/lib/records";
import { buildArtistSlug } from "@/lib/artists";
import RecordCard from "@/components/vinyl/RecordCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const concert = await findConcertBySlugOrId(params.id);
  if (!concert) return {};
  const bands = concertBandLine(concert);
  const date = new Date(concert.date).toLocaleDateString(undefined, { dateStyle: "long" });
  const title = concert.eventName ? `${concert.eventName} — ${bands}` : bands;
  const description = `${date} · ${concert.venueNameRaw} · ${concert.city}, ${concert.country}`;
  const featured =
    concert.photos.find((p) => p.id === concert.featuredPhotoId) ?? concert.photos[0];
  return pageMetadata({
    title,
    description,
    path: `/concerts/${concert.slug ?? concert.id}`,
    imageUrl: featured?.blobUrl,
    imageAlt: title,
    type: "article",
    publishedTime: concert.date,
    modifiedTime: concert.updatedAt,
  });
}

export default async function ConcertDetail({ params }: { params: { id: string } }) {
  const concert = await findConcertBySlugOrId(params.id);
  if (!concert) notFound();
  const venue = await getVenue(concert.venueId);
  const featured =
    concert.photos.find((p) => p.id === concert.featuredPhotoId) ?? concert.photos[0];

  // Records in the collection by any artist who played this show.
  const bandSlugs = new Set(
    concert.setlists
      .map((s) => s.artist)
      .filter(Boolean)
      .map((n) => buildArtistSlug(n)),
  );
  const allRecords = bandSlugs.size > 0 ? await listRecords().catch(() => []) : [];
  const matchedRecords = allRecords
    .filter((r) =>
      r.artists.some((a) => bandSlugs.has(buildArtistSlug(a.name))),
    )
    // Sort by primary artist (in setlist order if possible), then year desc
    .sort((a, b) => {
      const an = (a.artists[0]?.name ?? "").toLowerCase();
      const bn = (b.artists[0]?.name ?? "").toLowerCase();
      if (an !== bn) return an.localeCompare(bn);
      return (b.year ?? 0) - (a.year ?? 0);
    });

  return (
    <article className="space-y-8 max-w-3xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(concertEventJsonLd(concert, venue)) }}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Concerts", path: "/concerts" },
          {
            name: concertBandLine(concert),
            path: `/concerts/${concert.slug ?? concert.id}`,
          },
        ]}
      />
      {featured && (
        <div className="relative left-1/2 -translate-x-1/2 w-screen h-[250px] -mt-10 mb-2 bg-black overflow-hidden">
          <img
            src={featured.blobUrl}
            alt={featured.caption ?? ""}
            className="w-full h-full object-cover opacity-90"
          />
        </div>
      )}
      <header className="space-y-2">
        <div className="text-sm text-muted">
          {new Date(concert.date).toLocaleDateString(undefined, {
            dateStyle: "full",
          })}
        </div>
        {concert.eventName && (
          <div className="text-sm text-accent uppercase tracking-wider">{concert.eventName}</div>
        )}
        <h1 className="font-display text-4xl">{concertBandLine(concert)}</h1>
        <p className="text-muted">
          {venue ? (
            <Link href={`/venues/${venue.id}`} className="hover:text-accent">
              {venue.canonicalName}
            </Link>
          ) : (
            concert.venueNameRaw
          )}{" "}
          · {concert.city}, {concert.country}
        </p>
      </header>

      {concert.writeUp && <PostBody content={concert.writeUp} />}

      <section className="space-y-8">
        {concert.setlists
          .slice()
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((s) => (
            <SetlistBlock key={s.setlistFmId} setlist={s} />
          ))}
      </section>

      {concert.videoUrls && concert.videoUrls.length > 0 && (
        <section>
          <h2 className="font-display text-2xl mb-3">Video</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {concert.videoUrls.map((url) => {
              const embed = youtubeEmbedUrl(url);
              if (!embed) return null;
              return (
                <div key={url} className="aspect-video rounded overflow-hidden border border-border bg-black">
                  <iframe
                    src={embed}
                    title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {concert.photos.filter((p) => p.id !== featured?.id).length > 0 && (
        <section>
          <h2 className="font-display text-2xl mb-3">Photos</h2>
          <PhotoLightbox
            photos={concert.photos}
            excludeIds={featured ? [featured.id] : []}
          />
        </section>
      )}

      {concert.ticketStubs.length > 0 && (
        <section>
          <h2 className="font-display text-2xl mb-3">Ticket Stubs</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {concert.ticketStubs.map((s) => (
              <figure key={s.id}>
                <img src={s.thumbnailUrl ?? s.blobUrl} alt={s.label ?? "stub"} className="rounded" />
                {s.label && <figcaption className="text-xs text-muted mt-1">{s.label}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      )}

      {concert.links.length > 0 && (
        <section>
          <h2 className="font-display text-2xl mb-3">Links</h2>
          <ul className="space-y-1 text-sm">
            {concert.links.map((l) => (
              <li key={l.url}>
                <a href={l.url} className="text-accent" target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {concert.notes && (
        <section>
          <h2 className="font-display text-2xl mb-3">Notes</h2>
          <p className="whitespace-pre-wrap text-sm">{concert.notes}</p>
        </section>
      )}

      {matchedRecords.length > 0 && (
        <section>
          <h2 className="font-display text-2xl mb-1">From My Collection</h2>
          <p className="text-sm text-muted mb-3">
            {matchedRecords.length} {matchedRecords.length === 1 ? "record" : "records"} in my vinyl
            collection by{" "}
            {concert.setlists.length === 1 ? "this artist" : "these artists"}.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {matchedRecords.map((r) => (
              <RecordCard key={r.id} record={r} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
