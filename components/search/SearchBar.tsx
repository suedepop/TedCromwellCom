"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const query = q.trim();
        if (!query) return;
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }}
      className="flex gap-2"
    >
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search blog, concerts, trips…"
        className="flex-1 bg-surface border border-border rounded px-3 py-2 text-sm"
      />
      <button className="bg-accent text-bg px-4 rounded text-sm">Search</button>
    </form>
  );
}
