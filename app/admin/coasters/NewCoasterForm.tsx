"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Park } from "@/lib/types";

export default function NewCoasterForm({ parks }: { parks: Park[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [parkId, setParkId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    if (!name.trim() || !parkId) {
      setError("Name and park are required.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await fetch("/api/coasters", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: name.trim(), parkId }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? `${res.status}`);
      return;
    }
    const c = (await res.json()) as { slug: string };
    router.push(`/admin/coasters/${c.slug}`);
  }

  return (
    <div className="border border-border rounded p-3 bg-surface flex flex-wrap gap-2 items-end">
      <div className="flex-1 min-w-48">
        <label className="block text-xs uppercase tracking-wider text-muted mb-1">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Top Thrill Dragster"
          className="w-full bg-bg border border-border rounded px-2 py-1.5 text-sm"
        />
      </div>
      <div className="flex-1 min-w-48">
        <label className="block text-xs uppercase tracking-wider text-muted mb-1">Park</label>
        <select
          value={parkId}
          onChange={(e) => setParkId(e.target.value)}
          className="w-full bg-bg border border-border rounded px-2 py-1.5 text-sm"
        >
          <option value="">— pick a park —</option>
          {parks.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={create}
        disabled={busy}
        className="bg-accent text-bg px-3 py-1.5 rounded text-sm disabled:opacity-50"
      >
        Add coaster
      </button>
      {error && <p className="w-full text-red-400 text-xs">{error}</p>}
    </div>
  );
}
