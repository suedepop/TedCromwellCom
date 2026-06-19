import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  getCoaster,
  listCoasters,
  coasterCountCoasterUrl,
  rcdbCoasterUrl,
} from "@/lib/coasters";
import { getPark } from "@/lib/parks";
import { pageMetadata } from "@/lib/metadata";
import { coasterJsonLd, jsonLdScript } from "@/lib/jsonld";
import Breadcrumbs from "@/components/Breadcrumbs";
import type { Coaster, CoasterStats } from "@/lib/types";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const coaster = await getCoaster(params.slug);
  if (!coaster) return {};
  const park = await getPark(coaster.parkId);
  const where = park ? `${park.name} (${[park.city, park.state, park.country].filter(Boolean).join(", ")})` : null;
  const description =
    coaster.description?.replace(/[#>*_`\[\]\(\)!]/g, "").replace(/\s+/g, " ").trim().slice(0, 200) ??
    [coaster.manufacturer, coaster.type, coaster.openedYear ? `opened ${coaster.openedYear}` : null]
      .filter(Boolean)
      .join(" · ") + (where ? ` — at ${where}.` : ".");
  return pageMetadata({
    title: coaster.name,
    description,
    path: `/coasters/${coaster.slug}`,
    imageAlt: coaster.name,
    type: "website",
  });
}

function statsFacts(stats: CoasterStats | undefined): { label: string; value: string }[] {
  if (!stats) return [];
  const out: { label: string; value: string }[] = [];
  if (typeof stats.heightFeet === "number") out.push({ label: "Height", value: `${stats.heightFeet} ft` });
  if (typeof stats.dropFeet === "number") out.push({ label: "Drop", value: `${stats.dropFeet} ft` });
  if (typeof stats.topSpeedMph === "number") out.push({ label: "Top Speed", value: `${stats.topSpeedMph} mph` });
  if (typeof stats.lengthFeet === "number")
    out.push({ label: "Length", value: `${stats.lengthFeet.toLocaleString()} ft` });
  if (typeof stats.inversions === "number") out.push({ label: "Inversions", value: String(stats.inversions) });
  if (typeof stats.durationSeconds === "number") {
    const m = Math.floor(stats.durationSeconds / 60);
    const s = stats.durationSeconds % 60;
    out.push({ label: "Duration", value: m ? `${m}:${String(s).padStart(2, "0")}` : `${s}s` });
  }
  if (typeof stats.maxG === "number") out.push({ label: "Max G", value: `${stats.maxG} G` });
  return out;
}

function coasterHeaderFacts(c: Coaster): string[] {
  const out: string[] = [];
  if (c.type) out.push(c.type.charAt(0).toUpperCase() + c.type.slice(1));
  if (c.manufacturer) out.push(c.manufacturer);
  if (c.openedYear) out.push(`Opened ${c.openedYear}`);
  if (c.status === "closed") out.push("Closed");
  else if (c.status === "sbno") out.push("SBNO");
  else if (c.status === "under-construction") out.push("Under construction");
  return out;
}

export default async function CoasterDetail({ params }: { params: { slug: string } }) {
  const coaster = await getCoaster(params.slug);
  if (!coaster) notFound();
  const park = await getPark(coaster.parkId);
  const siblings = (await listCoasters({ parkId: coaster.parkId })).filter(
    (c) => c.slug !== coaster.slug,
  );
  const facts = coasterHeaderFacts(coaster);
  const stats = statsFacts(coaster.stats);

  return (
    <section className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(coasterJsonLd(coaster, park)) }}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Coasters", path: "/coasters" },
          ...(park ? [{ name: park.name, path: `/parks/${park.slug}` }] : []),
          { name: coaster.name, path: `/coasters/${coaster.slug}` },
        ]}
      />
      <header>
        <h1 className="font-display text-4xl">{coaster.name}</h1>
        {park && (
          <p className="text-muted mt-1">
            at{" "}
            <Link href={`/parks/${park.slug}`} className="hover:text-accent">
              {park.name}
            </Link>
            {park.city && ` · ${park.city}`}
            {park.state && `, ${park.state}`}
            {park.country && ` · ${park.country}`}
          </p>
        )}
        {facts.length > 0 && <p className="text-sm text-muted mt-2">{facts.join(" · ")}</p>}
      </header>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-5">
          {coaster.coverImageUrl && (
            <img
              src={coaster.coverImageUrl}
              alt={coaster.name}
              className="w-full rounded border border-border"
            />
          )}
          {coaster.description && (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{coaster.description}</ReactMarkdown>
            </div>
          )}
          {coaster.writeUp && (
            <div className="border-t border-border pt-4 prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{coaster.writeUp}</ReactMarkdown>
            </div>
          )}
        </div>
        <div className="md:col-span-1 space-y-4">
          {stats.length > 0 && (
            <dl className="grid grid-cols-2 gap-3 border border-border rounded p-4 text-sm bg-surface">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs uppercase tracking-wider text-muted">{s.label}</dt>
                  <dd className="font-display text-lg text-ink mt-0.5 leading-tight">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="space-y-1 text-sm">
            {coasterCountCoasterUrl(coaster.externalIds?.coasterCountId) && (
              <a
                href={coasterCountCoasterUrl(coaster.externalIds?.coasterCountId)!}
                target="_blank"
                rel="noreferrer"
                className="block text-accent"
              >
                coaster-count.com ↗
              </a>
            )}
            {rcdbCoasterUrl(coaster.externalIds?.rcdbId) && (
              <a
                href={rcdbCoasterUrl(coaster.externalIds?.rcdbId)!}
                target="_blank"
                rel="noreferrer"
                className="block text-accent"
              >
                RCDB ↗
              </a>
            )}
          </div>
        </div>
      </section>

      {siblings.length > 0 && park && (
        <section>
          <h2 className="font-display text-2xl mb-3">
            More at{" "}
            <Link href={`/parks/${park.slug}`} className="hover:text-accent">
              {park.name}
            </Link>
          </h2>
          <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-sm">
            {siblings.map((c) => (
              <li key={c.slug}>
                <Link href={`/coasters/${c.slug}`} className="hover:text-accent">
                  {c.name}
                </Link>
                {c.openedYear && <span className="text-xs text-muted ml-2">({c.openedYear})</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}
