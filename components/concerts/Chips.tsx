"use client";
import Link from "next/link";
import { useState } from "react";

export interface Chip {
  href: string;
  label: string;
  count?: number;
}

interface Props {
  title: string;
  total: number;
  totalLabel: string;
  chips: Chip[];
  initiallyVisible?: number;
}

export default function Chips({
  title,
  total,
  totalLabel,
  chips,
  initiallyVisible = 20,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? chips : chips.slice(0, initiallyVisible);
  const hasMore = chips.length > initiallyVisible;

  if (chips.length === 0) return null;

  return (
    <aside className="border border-border bg-surface rounded p-4">
      <div className="text-[10px] uppercase tracking-wider text-accent mb-1">{title}</div>
      <h2 className="font-display text-xl mb-3">
        {total} {totalLabel}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {visible.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              className="inline-flex items-center gap-1.5 border border-border rounded-full px-3 py-1 text-xs hover:border-accent hover:text-accent transition"
            >
              <span>{c.label}</span>
              {typeof c.count === "number" && c.count > 0 && (
                <span className="text-muted">· {c.count}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="text-xs text-accent hover:underline mt-3"
        >
          {expanded ? "Show fewer" : `Show all ${chips.length} →`}
        </button>
      )}
    </aside>
  );
}
