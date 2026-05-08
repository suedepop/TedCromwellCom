"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/blog", label: "Blog" },
  { href: "/concerts", label: "Concerts" },
  { href: "/travel", label: "Travel" },
  { href: "/resume", label: "Resume" },
  { href: "/search", label: "Search" },
  { href: "/vinyl", label: "Vinyl" },
  { href: "/experiments", label: "Experiments" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="border-b border-border">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-display text-xl hover:text-accent" onClick={() => setOpen(false)}>
          Ted Cromwell
        </Link>
        <ul className="hidden md:flex gap-5 text-sm text-muted">
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
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-muted hover:text-accent"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>
      {open && (
        <ul className="md:hidden border-t border-border bg-surface">
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
      )}
    </header>
  );
}
