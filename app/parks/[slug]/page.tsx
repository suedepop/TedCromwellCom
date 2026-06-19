import type { Metadata } from "next";
import Link from "next/link";
import dynamicImport from "next/dynamic";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPark, coasterCountParkUrl, rcdbParkUrl } from "@/lib/parks";
import { listCoasters } from "@/lib/coasters";
import { pageMetadata } from "@/lib/metadata";
import { amusementParkJsonLd, jsonLdScript } from "@/lib/jsonld";
import Breadcrumbs from "@/components/Breadcrumbs";

export const revalidate = 3600;

const VenueMap = dynamicImport(() => import("@/components/venues/VenueMap"), { ssr: false });

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const park = await getPark(params.slug);
  if (!park) return {};
  const where = [park.city, park.state, park.country].filter(Boolean).join(", ");
  const description =
    park.description?.replace(/[#>*_`\[\]\(\)!]/g, "").replace(/\s+/g, " ").trim().slice(0, 200) ??
    `Coasters I've ridden at ${park.name}${where ? ` in ${where}` : ""}.`;
  return pageMetadata({
    title: park.name,
    description,
    path: `/parks/${park.slug}`,
    imageAlt: park.name,
    type: "website",
  });
}

export default async function ParkDetail({ params }: { params: { slug: string } }) {
  const park = await getPark(params.slug);
  if (!park) notFound();
  const coasters = await listCoasters({ parkId: park.id });
  const hasCoords = typeof park.lat === "number" && typeof park.lng === "number";
  const years = coasters
    .map((c) => c.openedYear)
    .filter((y): y is number => typeof y === "number")
    .sort((a, b) => a - b);
  const firstYear = years[0];
  const newestYear = years[years.length - 1];

  return (
    <section className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(amusementParkJsonLd(park, coasters.length)) }}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Parks", path: "/parks" },
          { name: park.name, path: `/parks/${park.slug}` },
        ]}
      />
      <header>
        <h1 className="font-display text-4xl">{park.name}</h1>
        <p className="text-muted mt-1">
          {[park.city, park.state, park.country].filter(Boolean).join(", ")}
          {park.closed && park.closedYear ? ` · closed ${park.closedYear}` : park.closed ? " · closed" : ""}
        </p>
      </header>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-5">
          {park.description && (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{park.description}</ReactMarkdown>
            </div>
          )}

          <dl className="grid grid-cols-3 gap-4 border-y border-border py-4 text-sm">
            <Stat label="Coasters Ridden" value={coasters.length.toString()} />
            <Stat
              label="Oldest"
              value={firstYear ? String(firstYear) : "—"}
            />
            <Stat
              label="Newest"
              value={newestYear ? String(newestYear) : "—"}
            />
          </dl>

          <div className="flex flex-wrap gap-4 text-sm">
            {park.url && (
              <a href={park.url} target="_blank" rel="noreferrer" className="text-accent">
                Park website ↗
              </a>
            )}
            {coasterCountParkUrl(park.externalIds?.coasterCountId) && (
              <a
                href={coasterCountParkUrl(park.externalIds?.coasterCountId)!}
                target="_blank"
                rel="noreferrer"
                className="text-accent"
              >
                coaster-count.com ↗
              </a>
            )}
            {rcdbParkUrl(park.externalIds?.rcdbId) && (
              <a
                href={rcdbParkUrl(park.externalIds?.rcdbId)!}
                target="_blank"
                rel="noreferrer"
                className="text-accent"
              >
                RCDB ↗
              </a>
            )}
          </div>
        </div>
        <div className="md:col-span-1">
          {hasCoords ? (
            <VenueMap
              singleCenter
              zoom={12}
              height={320}
              pins={[{ id: park.id, name: park.name, lat: park.lat!, lng: park.lng! }]}
            />
          ) : (
            <div className="h-[320px] border border-border rounded bg-surface flex items-center justify-center text-muted text-sm">
              No location set
            </div>
          )}
        </div>
      </section>

      {coasters.length > 0 && (
        <section>
          <h2 className="font-display text-2xl mb-3">Coasters I've ridden here</h2>
          <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-sm">
            {coasters
              .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
              .map((c) => (
                <li key={c.slug}>
                  <Link href={`/coasters/${c.slug}`} className="hover:text-accent">
                    {c.name}
                  </Link>
                  {c.manufacturer && (
                    <span className="text-xs text-muted ml-2">{c.manufacturer}</span>
                  )}
                  {c.openedYear && (
                    <span className="text-xs text-muted ml-2">({c.openedYear})</span>
                  )}
                </li>
              ))}
          </ul>
        </section>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted">{label}</dt>
      <dd className="font-display text-xl text-ink mt-1 leading-tight">{value}</dd>
    </div>
  );
}
