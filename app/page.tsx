import Link from "next/link";
import PostCard from "@/components/blog/PostCard";
import ConcertCard from "@/components/concerts/ConcertCard";
import TravelCard from "@/components/travel/TravelCard";
import { listPosts } from "@/lib/blog";
import { listConcerts } from "@/lib/concerts";
import { listTravelEntries } from "@/lib/travel";
import { getResume } from "@/lib/resume";

export const revalidate = 3600;

export default async function HomePage() {
  const [posts, concerts, travel, resume] = await Promise.all([
    listPosts("published").catch(() => []),
    listConcerts().catch(() => []),
    listTravelEntries().catch(() => []),
    getResume().catch(() => null),
  ]);

  const recentPosts = posts.slice(0, 3);
  const recentConcerts = concerts.slice(0, 3);
  const recentTravel = travel.slice(0, 3);

  return (
    <div className="space-y-16">
      <section className="space-y-4">
        <h1 className="font-display text-5xl md:text-6xl">
          {resume?.name || "Ted Cromwell"}
        </h1>
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
          <Link href="/travel" className="border border-border hover:border-accent hover:text-accent px-3 py-1 rounded">Travel →</Link>
          <Link href="/resume" className="border border-border hover:border-accent hover:text-accent px-3 py-1 rounded">Resume →</Link>
        </nav>
      </section>

      {recentPosts.length > 0 && (
        <Section title="Recent writing" href="/blog">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recentPosts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </Section>
      )}

      {recentConcerts.length > 0 && (
        <Section title="Recent shows" href="/concerts">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recentConcerts.map((c) => (
              <ConcertCard key={c.id} concert={c} />
            ))}
          </div>
        </Section>
      )}

      {recentTravel.length > 0 && (
        <Section title="Recent travel" href="/travel">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recentTravel.map((e) => (
              <TravelCard key={e.id} entry={e} />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-3xl">{title}</h2>
        <Link href={href} className="text-sm text-muted hover:text-accent">
          View all →
        </Link>
      </div>
      {children}
    </section>
  );
}
