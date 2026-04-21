"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import SearchBar from "@/components/search/SearchBar";
import type { SearchIndexEntry } from "@/lib/types";
const fuseOptions = {
  keys: [
    { name: "title", weight: 0.5 },
    { name: "body", weight: 0.4 },
    { name: "date", weight: 0.1 },
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2,
};

const TYPE_LABEL: Record<SearchIndexEntry["type"], string> = {
  post: "Post",
  concert: "Concert",
  trip: "Trip",
};

export default function SearchClient() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const [index, setIndex] = useState<SearchIndexEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/search-index")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: SearchIndexEntry[]) => {
        if (!cancelled) setIndex(data);
      })
      .catch((e) => !cancelled && setError(String(e)));
    return () => {
      cancelled = true;
    };
  }, []);

  const fuse = useMemo(() => (index ? new Fuse(index, fuseOptions) : null), [index]);
  const results = useMemo(() => {
    if (!fuse || !q) return [];
    return fuse.search(q).slice(0, 50);
  }, [fuse, q]);

  return (
    <section className="space-y-6 max-w-3xl">
      <h1 className="font-display text-4xl">Search</h1>
      <SearchBar initialQuery={q} />
      {error && <p className="text-red-400 text-sm">Failed to load index: {error}</p>}
      {!index && !error && <p className="text-muted text-sm">Loading index…</p>}
      {index && !q && (
        <p className="text-muted text-sm">Type a query — searches {index.length} items across blog, concerts, and trips.</p>
      )}
      {index && q && results.length === 0 && <p className="text-muted text-sm">No matches for "{q}".</p>}
      <ul className="space-y-3">
        {results.map(({ item }) => (
          <li key={`${item.type}-${item.id}`} className="border border-border rounded p-4 bg-surface">
            <Link href={item.url} className="block hover:text-accent">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-wider text-accent">{TYPE_LABEL[item.type]}</span>
                {item.date && <span className="text-xs text-muted">{item.date}</span>}
              </div>
              <h2 className="font-display text-xl">{item.title}</h2>
              <p className="text-sm text-muted mt-1 line-clamp-2">{item.body}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
