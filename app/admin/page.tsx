import Link from "next/link";

const cards = [
  { title: "Blog", href: "/admin/blog", action: "New Post", actionHref: "/admin/blog/new" },
  { title: "Concerts", href: "/admin/concerts", action: "Run Import", actionHref: "/admin/concerts/import" },
  { title: "Travel", href: "/admin/travel", action: "Add Trip", actionHref: "/admin/travel/trips/new" },
  { title: "Resume", href: "/admin/resume", action: "Edit Resume", actionHref: "/admin/resume" },
];

export default function AdminDashboard() {
  return (
    <section className="space-y-6">
      <h1 className="font-display text-4xl">Dashboard</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map((c) => (
          <div key={c.title} className="border border-border bg-surface rounded p-5 flex flex-col">
            <Link href={c.href} className="font-display text-2xl hover:text-accent">
              {c.title}
            </Link>
            <p className="text-muted text-sm mt-2 flex-1">Summary coming soon.</p>
            <Link href={c.actionHref} className="text-sm text-accent mt-4">
              {c.action} →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
