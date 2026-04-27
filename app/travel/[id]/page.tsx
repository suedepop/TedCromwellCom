import type { Metadata } from "next";
import dynamicImport from "next/dynamic";
import { notFound } from "next/navigation";
import Disqus from "@/components/comments/Disqus";
import PhotoLightbox from "@/components/media/PhotoLightbox";
import PostBody from "@/components/blog/PostBody";
import { findTravelEntryBySlugOrId } from "@/lib/travel";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

const TravelMap = dynamicImport(() => import("@/components/travel/TravelMap"), { ssr: false });

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const entry = await findTravelEntryBySlugOrId(params.id);
  if (!entry) return {};
  const where = [entry.city, entry.state, entry.country].filter(Boolean).join(", ");
  const dateRange =
    entry.endDate && entry.endDate !== entry.startDate
      ? `${entry.startDate} → ${entry.endDate}`
      : entry.startDate;
  const description = entry.content
    ? entry.content.replace(/[#>*_`\[\]\(\)!]/g, "").replace(/\s+/g, " ").trim().slice(0, 200)
    : `${dateRange} · ${where}`;
  const featured = entry.photos.find((p) => p.id === entry.featuredPhotoId) ?? entry.photos[0];
  return pageMetadata({
    title: entry.locationName,
    description,
    path: `/travel/${entry.slug ?? entry.id}`,
    imageUrl: featured?.blobUrl,
    imageAlt: entry.locationName,
    type: "article",
    publishedTime: entry.publishedAt ?? entry.startDate,
    modifiedTime: entry.updatedAt,
  });
}

export default async function TravelEntryPage({ params }: { params: { id: string } }) {
  const entry = await findTravelEntryBySlugOrId(params.id);
  if (!entry) notFound();
  const featured = entry.photos.find((p) => p.id === entry.featuredPhotoId) ?? entry.photos[0];
  const dateRange =
    entry.endDate && entry.endDate !== entry.startDate
      ? `${entry.startDate} → ${entry.endDate}`
      : entry.startDate;
  const others = entry.photos.filter((p) => p.id !== featured?.id);

  return (
    <article className="max-w-3xl mx-auto space-y-8">
      {featured && (
        <div className="relative left-1/2 -translate-x-1/2 w-screen h-[300px] -mt-10 mb-2 bg-black overflow-hidden">
          <img src={featured.blobUrl} alt="" className="w-full h-full object-cover opacity-90" />
        </div>
      )}
      <header className="space-y-2">
        <p className="text-sm text-muted">{dateRange}</p>
        <h1 className="font-display text-4xl md:text-5xl">{entry.locationName}</h1>
        <p className="text-muted">
          {[entry.city, entry.state, entry.country].filter(Boolean).join(", ")}
        </p>
      </header>
      <TravelMap entries={[entry]} height={280} initialZoom={6} />
      {entry.content && <PostBody content={entry.content} />}
      {others.length > 0 && (
        <section>
          <h2 className="font-display text-2xl mb-3">Photos</h2>
          <PhotoLightbox
            photos={entry.photos}
            excludeIds={featured ? [featured.id] : []}
          />
        </section>
      )}
      <Disqus
        identifier={`travel-${entry.id}`}
        title={entry.locationName}
        url={`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/travel/${entry.slug ?? entry.id}`}
      />
    </article>
  );
}
