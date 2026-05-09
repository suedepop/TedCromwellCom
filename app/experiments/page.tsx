import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Experiments",
  description: "Microsites and one-off projects. Things I'm tinkering with.",
  path: "/experiments",
});

interface Experiment {
  slug: string;
  title: string;
  description: string;
  date: string;
}

const experiments: Experiment[] = [
  {
    slug: "dashboard",
    title: "Content update dashboard",
    description:
      "When am I actually adding to this site? A bar chart of blog posts, concerts, travel entries, venues, and vinyl records grouped by time.",
    date: "2026-05",
  },
];

export default function ExperimentsIndex() {
  return (
    <section className="space-y-8">
      <header>
        <h1 className="font-display text-4xl">Experiments</h1>
        <p className="text-muted mt-2 max-w-2xl">
          Small projects, dashboards, and microsites that don&apos;t fit anywhere else on the site. Some
          are one-offs; some get expanded later.
        </p>
      </header>
      <ul className="grid sm:grid-cols-2 gap-4">
        {experiments.map((e) => (
          <li key={e.slug}>
            <Link
              href={`/experiments/${e.slug}`}
              className="block h-full border border-border bg-surface rounded p-5 hover:border-accent transition"
            >
              <div className="text-xs uppercase tracking-wider text-muted">{e.date}</div>
              <h2 className="font-display text-xl mt-1">{e.title}</h2>
              <p className="text-sm text-muted mt-2">{e.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
