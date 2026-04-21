"use client";
import { useCallback, useEffect, useRef, useState } from "react";

interface Page<T> {
  items: T[];
  total: number;
}

interface Props<T> {
  initialItems: T[];
  total: number;
  pageSize: number;
  fetchUrl: string; // will be called with appended ?offset=&limit=
  renderItem: (item: T) => React.ReactNode;
  keyOf: (item: T) => string;
  gridClass: string;
}

export default function LoadMoreGrid<T>({
  initialItems,
  total,
  pageSize,
  fetchUrl,
  renderItem,
  keyOf,
  gridClass,
}: Props<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const hasMore = items.length < total;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    const sep = fetchUrl.includes("?") ? "&" : "?";
    const url = `${fetchUrl}${sep}offset=${items.length}&limit=${pageSize}`;
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`${res.status}`);
      const page = (await res.json()) as Page<T>;
      setItems((prev) => [...prev, ...page.items]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [fetchUrl, items.length, loading, hasMore, pageSize]);

  // Auto-load when sentinel scrolls into view
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore();
      },
      { rootMargin: "400px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div className="space-y-6">
      <div className={gridClass}>
        {items.map((item) => (
          <div key={keyOf(item)}>{renderItem(item)}</div>
        ))}
      </div>
      {error && <p className="text-red-400 text-sm">Load failed: {error}. Try again.</p>}
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-4">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="border border-border px-4 py-2 rounded text-sm hover:border-accent disabled:opacity-50"
          >
            {loading ? "Loading…" : `Load more (${total - items.length} left)`}
          </button>
        </div>
      )}
      {!hasMore && items.length > pageSize && (
        <p className="text-center text-xs text-muted py-2">All {items.length} loaded.</p>
      )}
    </div>
  );
}
