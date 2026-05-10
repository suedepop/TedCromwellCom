"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BootstrapArtistsButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/maintenance/bootstrap-artists", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMsg(`Failed: ${data.error ?? res.status}`);
      return;
    }
    setMsg(`Created ${data.created}, skipped ${data.skipped}.`);
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={run}
        disabled={busy}
        className="bg-accent text-bg px-3 py-1.5 rounded text-sm disabled:opacity-50"
      >
        {busy ? "Bootstrapping…" : "Bootstrap stub docs"}
      </button>
      {msg && <p className="text-xs text-muted">{msg}</p>}
    </div>
  );
}
