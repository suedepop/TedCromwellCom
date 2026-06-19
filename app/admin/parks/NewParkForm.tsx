"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewParkForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    if (!name.trim() || !country.trim()) {
      setError("Name and country are required.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await fetch("/api/parks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: name.trim(), country: country.trim() }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? `${res.status}`);
      return;
    }
    const park = (await res.json()) as { slug: string };
    router.push(`/admin/parks/${park.slug}`);
  }

  return (
    <div className="border border-border rounded p-3 bg-surface flex flex-wrap gap-2 items-end">
      <div className="flex-1 min-w-48">
        <label className="block text-xs uppercase tracking-wider text-muted mb-1">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Cedar Point"
          className="w-full bg-bg border border-border rounded px-2 py-1.5 text-sm"
        />
      </div>
      <div className="flex-1 min-w-32">
        <label className="block text-xs uppercase tracking-wider text-muted mb-1">Country</label>
        <input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="United States"
          className="w-full bg-bg border border-border rounded px-2 py-1.5 text-sm"
        />
      </div>
      <button
        onClick={create}
        disabled={busy}
        className="bg-accent text-bg px-3 py-1.5 rounded text-sm disabled:opacity-50"
      >
        Add park
      </button>
      {error && <p className="w-full text-red-400 text-xs">{error}</p>}
    </div>
  );
}
