import type { Metadata } from "next";
import Link from "next/link";
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
import type { DiscographyRelease, DiscographyReleaseType } from "@/lib/types";

export const revalidate = 3600;

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
      <header className="flex items-start gap-5 flex-wrap">
        {s?.imageUrl && (
          <img
            src={s.imageUrl}
            alt={artist.name}
            className="w-32 h-32 md:w-40 md:h-40 rounded object-cover border border-border shrink-0"
          />
        )}
        <div className="space-y-2 flex-1 min-w-0">
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
        </div>
      </header>

      {(() => {
        // Prefer whichever body is longer — Wikipedia's extract when present,
        // otherwise the manually-authored / encyclopedic description. Both
        // render through PostBody so the same markdown pipeline handles them.
        const wiki = s?.wikipediaExtract?.trim() ?? "";
        const own = s?.description?.trim() ?? "";
        const body = wiki.length > own.length ? wiki : own;
        if (!body) return null;
        return (
          <div className="space-y-2">
            <PostBody content={body} />
            {body === wiki && s?.wikipediaUrl && (
              <p className="text-xs text-muted">
                Extract from{" "}
                <a
                  href={s.wikipediaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent underline"
                >
                  Wikipedia
                </a>
                {s.wikipediaTitle ? `: “${s.wikipediaTitle}”` : ""} (
                <a
                  href="https://creativecommons.org/licenses/by-sa/4.0/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent underline"
                >
                  CC BY-SA 4.0
                </a>
                ).
              </p>
            )}
          </div>
        );
      })()}

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

      {s?.discography && s.discography.length > 0 && (
        <DiscographySection releases={s.discography} />
      )}

      {artist.concerts.length === 0 && artist.records.length === 0 && (
        <p className="text-muted">No content yet for this artist.</p>
      )}
    </article>
  );
}

// Order in which release-type groups appear on the page. Primary works
// (Album/EP) up top; supplementary material (Compilations, Live, etc.)
// grouped inside a collapsed <details> so long discographies stay readable.
const PRIMARY_TYPES: DiscographyReleaseType[] = ["Album", "EP", "Single"];
const SECONDARY_TYPES: DiscographyReleaseType[] = [
  "Live",
  "Soundtrack",
  "Compilation",
  "Remix",
  "Broadcast",
  "Demo",
  "Other",
];

function DiscographySection({ releases }: { releases: DiscographyRelease[] }) {
  const groups = new Map<DiscographyReleaseType, DiscographyRelease[]>();
  for (const r of releases) {
    const list = groups.get(r.type) ?? [];
    list.push(r);
    groups.set(r.type, list);
  }
  const ownedCount = releases.filter((r) => r.ownedRecordSlug).length;
  return (
    <section className="space-y-4">
      <header className="flex items-baseline justify-between flex-wrap gap-2">
        <h2 className="font-display text-2xl">Discography</h2>
        <p className="text-xs text-muted">
          {releases.length} releases from MusicBrainz
          {ownedCount > 0 && (
            <>
              {" "}
              · <span className="text-accent">★</span> {ownedCount} in my collection
            </>
          )}
        </p>
      </header>
      {PRIMARY_TYPES.map((t) => {
        const list = groups.get(t);
        if (!list || list.length === 0) return null;
        return <DiscographyGroup key={t} type={t} releases={list} />;
      })}
      {SECONDARY_TYPES.some((t) => (groups.get(t)?.length ?? 0) > 0) && (
        <details className="text-sm">
          <summary className="cursor-pointer text-muted hover:text-accent">
            More: singles, compilations, live &amp; other releases
          </summary>
          <div className="mt-3 space-y-4">
            {SECONDARY_TYPES.map((t) => {
              const list = groups.get(t);
              if (!list || list.length === 0) return null;
              return <DiscographyGroup key={t} type={t} releases={list} />;
            })}
          </div>
        </details>
      )}
    </section>
  );
}

function DiscographyGroup({
  type,
  releases,
}: {
  type: DiscographyReleaseType;
  releases: DiscographyRelease[];
}) {
  const label = type === "EP" ? "EPs" : `${type}s`;
  return (
    <div className="space-y-1">
      <h3 className="font-display text-lg">{label} ({releases.length})</h3>
      <ul className="text-sm">
        {releases.map((r) => (
          <li key={r.musicbrainzId} className="flex items-baseline gap-2 py-0.5">
            <span className="text-muted font-mono text-xs w-12 shrink-0">{r.year ?? "—"}</span>
            <span className="flex-1 min-w-0">
              {r.ownedRecordSlug ? (
                <Link
                  href={`/vinyl/${r.ownedRecordSlug}`}
                  className="text-accent hover:underline"
                  title="In my collection — open the vinyl page"
                >
                  <span className="mr-1">★</span>
                  {r.title}
                </Link>
              ) : (
                <span>{r.title}</span>
              )}
              {r.disambiguation && (
                <span className="text-muted text-xs"> — {r.disambiguation}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
