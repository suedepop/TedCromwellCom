import Link from "next/link";
import { breadcrumbJsonLd, jsonLdScript, type BreadcrumbCrumb } from "@/lib/jsonld";

export default function Breadcrumbs({ crumbs }: { crumbs: BreadcrumbCrumb[] }) {
  if (crumbs.length === 0) return null;
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-1">
                {!last ? (
                  <Link href={c.path} className="hover:text-accent">
                    {c.name}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-ink">
                    {c.name}
                  </span>
                )}
                {!last && <span className="text-muted/60">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd(crumbs)) }}
      />
    </>
  );
}
