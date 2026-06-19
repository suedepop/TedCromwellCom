import Link from "next/link";
import HomeFeed from "./HomeFeed";
import CoasterCard from "@/components/coasters/CoasterCard";
import { listFeedPage } from "@/lib/feed";
import { listCoasters } from "@/lib/coasters";
import { listParks } from "@/lib/parks";
import { getResume } from "@/lib/resume";
import { jsonLdScript, siteJsonLd } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;
const RECENT_COASTERS = 4;

export default async function HomePage() {
  const [page, resume, allCoasters, allParks] = await Promise.all([
    listFeedPage(0, PAGE_SIZE).catch(() => ({ items: [], total: 0, offset: 0, limit: PAGE_SIZE })),
    getResume().catch(() => null),
    listCoasters().catch(() => []),
    listParks().catch(() => []),
  ]);

  const parksById = new Map(allParks.map((p) => [p.id, p]));
  const recentCoasters = [...allCoasters]
    .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""))
    .slice(0, RECENT_COASTERS);

  return (
    <div className="space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(siteJsonLd(resume)) }}
      />
      <section className="space-y-4">
        <h1 className="font-display text-5xl md:text-6xl">{resume?.name || "Ted Cromwell"}</h1>
        {resume?.tagline ? (
          <p className="text-accent text-xl">{resume.tagline}</p>
        ) : (
          <p className="text-muted max-w-2xl">
            Writing, concerts, travel, and work — a personal archive.
          </p>
        )}
        <nav className="flex flex-wrap gap-4 text-sm pt-2">
          <Link href="/blog" className="border border-border hover:border-accent hover:text-accent px-3 py-1 rounded">Blog →</Link>
          <Link href="/concerts" className="border border-border hover:border-accent hover:text-accent px-3 py-1 rounded">Concerts →</Link>
          <Link href="/venues" className="border border-border hover:border-accent hover:text-accent px-3 py-1 rounded">Venues →</Link>
          <Link href="/travel" className="border border-border hover:border-accent hover:text-accent px-3 py-1 rounded">Travel →</Link>
          <Link href="/coasters" className="border border-border hover:border-accent hover:text-accent px-3 py-1 rounded">Coasters →</Link>
          <Link href="/resume" className="border border-border hover:border-accent hover:text-accent px-3 py-1 rounded">Resume →</Link>
        </nav>
      </section>

      {page.total > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-3xl">Recent</h2>
          <HomeFeed initialItems={page.items} total={page.total} pageSize={PAGE_SIZE} />
        </section>
      )}

      {recentCoasters.length > 0 && (
        <section className="space-y-4">
          <header className="flex items-end justify-between flex-wrap gap-3">
            <h2 className="font-display text-3xl">Recent coasters</h2>
            <p className="text-xs text-muted">
              {allCoasters.length} coasters across {allParks.length} parks ·{" "}
              <Link href="/coasters" className="hover:text-accent">All coasters →</Link>{" "}
              <Link href="/parks" className="hover:text-accent">All parks →</Link>
            </p>
          </header>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {recentCoasters.map((c) => (
              <CoasterCard key={c.id} coaster={c} park={parksById.get(c.parkId)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
