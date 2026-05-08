"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import type { VinylRecord } from "@/lib/types";

export default function RecordEditor({ record }: { record: VinylRecord }) {
  const router = useRouter();
  const [notes, setNotes] = useState(record.notes ?? "");
  const [hidden, setHidden] = useState(!!record.hidden);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/records/${record.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ notes, hidden }),
    });
    setBusy(false);
    if (!res.ok) return setError(`Save failed: ${res.status}`);
    router.refresh();
  }

  async function onDelete() {
    if (!confirm("Delete this record from Cosmos? It will reappear on the next Discogs import.")) return;
    const res = await fetch(`/api/records/${record.id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
      router.replace("/admin/records");
    }
  }

  const artists = record.artists.map((a) => a.name).join(" · ");

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl">{record.title}</h1>
          <p className="text-muted mt-1">
            {artists} · {record.year ?? ""} · {record.primaryFormat}
          </p>
          <Link
            href={`/vinyl/${record.slug ?? record.id}`}
            target="_blank"
            className="text-xs text-accent"
          >
            View public page ↗
          </Link>
          {" · "}
          <a href={record.permalinkUrl} target="_blank" rel="noreferrer" className="text-xs text-accent">
            Discogs ↗
          </a>
        </div>
        <div className="flex gap-2">
          <button onClick={save} disabled={busy} className="bg-accent text-bg px-3 py-1.5 rounded text-sm disabled:opacity-50">
            Save
          </button>
          <button onClick={onDelete} className="border border-red-500/50 text-red-400 px-3 py-1.5 rounded text-sm">
            Delete
          </button>
        </div>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <p className="text-xs text-muted">
        Title, artists, year, label, format come from Discogs and are overwritten on each import. Use the
        fields below for site-specific data.
      </p>

      <label className="block space-y-1">
        <span className="text-xs uppercase tracking-wider text-muted">Notes (private)</span>
        <textarea
          rows={5}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-surface border border-border rounded px-3 py-2 text-sm"
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={hidden}
          onChange={(e) => setHidden(e.target.checked)}
        />
        Hide from public /vinyl listing
      </label>
    </div>
  );
}
