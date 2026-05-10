"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/blog", label: "Blog" },
  { href: "/concerts", label: "Concerts" },
  { href: "/travel", label: "Travel" },
  { href: "/resume", label: "Resume" },
  { href: "/vinyl", label: "Vinyl" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <header className="border-b border-border">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link
          href="/"
          className="font-display text-xl hover:text-accent shrink-0"
          onClick={() => setOpen(false)}
        >
          Ted Cromwell
        </Link>
        <ul className="hidden md:flex gap-5 text-sm text-muted ml-2">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={pathname.startsWith(l.href) ? "text-accent" : "hover:text-accent"}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <form onSubmit={submitSearch} className="hidden md:flex flex-1 justify-end">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            aria-label="Search the site"
            className="bg-surface border border-border rounded px-3 py-1.5 text-sm w-48 focus:w-64 focus:border-accent transition-all outline-none"
          />
        </form>
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-muted hover:text-accent ml-auto"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>
      {open && (
        <div className="md:hidden border-t border-border bg-surface">
          <form onSubmit={submitSearch} className="px-4 py-3 border-b border-border/50">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              aria-label="Search the site"
              className="w-full bg-bg border border-border rounded px-3 py-2 text-sm focus:border-accent outline-none"
            />
          </form>
          <ul>
            {links.map((l) => (
              <li key={l.href} className="border-b border-border/50">
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm hover:text-accent"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
