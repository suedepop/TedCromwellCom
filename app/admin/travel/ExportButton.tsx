"use client";
import { useState } from "react";

export default function ExportButton() {
  const [busy, setBusy] = useState(false);

  async function download() {
    setBusy(true);
    try {
      // Request without offset/limit params to get full array
      const res = await fetch("/api/travel", { cache: "no-store" });
      if (!res.ok) throw new Error(`${res.status}`);
      const raw = await res.json();
      const data = Array.isArray(raw) ? raw : (raw.items ?? []);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `travel-entries-${stamp}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={download}
      disabled={busy}
      className="border border-border px-3 py-1.5 rounded text-sm hover:border-accent disabled:opacity-50"
    >
      {busy ? "Exporting…" : "Download JSON"}
    </button>
  );
}
