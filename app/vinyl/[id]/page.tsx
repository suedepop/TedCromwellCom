import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { findRecordBySlugOrId } from "@/lib/records";
import { pageMetadata } from "@/lib/metadata";
import { buildArtistSlug } from "@/lib/artists";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const record = await findRecordBySlugOrId(params.id);
  if (!record) return {};
  const artists = record.artists.map((a) => a.name).join(" · ");
  return pageMetadata({
    title: `${artists} — ${record.title}`,
    description: `${record.year ?? ""} · ${record.primaryFormat}`.trim(),
    path: `/vinyl/${record.slug ?? record.id}`,
    imageUrl: record.coverImageUrl,
    imageAlt: `${artists} — ${record.title} cover`,
    type: "article",
  });
}

export default async function RecordDetail({ params }: { params: { id: string } }) {
  const record = await findRecordBySlugOrId(params.id);
  if (!record || record.hidden) notFound();
  const artists = record.artists.map((a) => a.name).join(" · ");

  return (
    <article className="space-y-8 max-w-3xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-black rounded overflow-hidden border border-border">
          {record.coverImageUrl ? (
            <img src={record.coverImageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted font-display text-4xl">
              {record.year ?? "—"}
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted">{record.year ?? ""}</p>
            <h1 className="font-display text-3xl md:text-4xl mt-1">{record.title}</h1>
            <p className="text-lg text-muted mt-2">
              {record.artists.map((a, i) => (
                <span key={`${a.id}-${i}`}>
                  {i > 0 && " · "}
                  <Link href={`/artists/${buildArtistSlug(a.name)}`} className="hover:text-accent">
                    {a.name}
                  </Link>
                </span>
              ))}
            </p>
          </div>

          <dl className="space-y-1 text-sm">
            {record.primaryFormat && (
              <div>
                <dt className="inline text-xs uppercase tracking-wider text-muted">Format: </dt>
                <dd className="inline">{record.primaryFormat}</dd>
              </div>
            )}
            {record.labels.length > 0 && (
              <div>
                <dt className="inline text-xs uppercase tracking-wider text-muted">Label: </dt>
                <dd className="inline">
                  {record.labels.map((l) => `${l.name}${l.catno ? ` (${l.catno})` : ""}`).join(", ")}
                </dd>
              </div>
            )}
            {record.genres.length > 0 && (
              <div>
                <dt className="inline text-xs uppercase tracking-wider text-muted">Genre: </dt>
                <dd className="inline">{record.genres.join(", ")}</dd>
              </div>
            )}
            {record.styles.length > 0 && (
              <div>
                <dt className="inline text-xs uppercase tracking-wider text-muted">Style: </dt>
                <dd className="inline">{record.styles.join(", ")}</dd>
              </div>
            )}
            {record.addedToCollectionAt && (
              <div>
                <dt className="inline text-xs uppercase tracking-wider text-muted">Added: </dt>
                <dd className="inline">{record.addedToCollectionAt.slice(0, 10)}</dd>
              </div>
            )}
          </dl>

          {record.notes && (
            <div>
              <h2 className="text-xs uppercase tracking-wider text-muted mb-1">Notes</h2>
              <p className="text-sm whitespace-pre-wrap">{record.notes}</p>
            </div>
          )}

          <a
            href={record.permalinkUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-sm text-accent"
          >
            View on Discogs ↗
          </a>
        </div>
      </div>
    </article>
  );
}
