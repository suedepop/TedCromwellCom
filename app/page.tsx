import Link from "next/link";
import HomeFeed from "./HomeFeed";
import { listFeedPage } from "@/lib/feed";
import { getResume } from "@/lib/resume";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export default async function HomePage() {
  const [page, resume] = await Promise.all([
    listFeedPage(0, PAGE_SIZE).catch(() => ({ items: [], total: 0, offset: 0, limit: PAGE_SIZE })),
    getResume().catch(() => null),
  ]);

  return (
    <div className="space-y-12">
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
          <Link href="/resume" className="border border-border hover:border-accent hover:text-accent px-3 py-1 rounded">Resume →</Link>
        </nav>
      </section>

      {page.total > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-3xl">Recent</h2>
          <HomeFeed initialItems={page.items} total={page.total} pageSize={PAGE_SIZE} />
        </section>
      )}
    </div>
  );
}
