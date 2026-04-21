"use client";
import { useEffect, useRef, useState } from "react";

interface Result {
  newConcerts: number;
  skipped: number;
  newVenues: number;
  newVenueNames: string[];
  fetchedFromApi?: number;
  apiReportedTotal?: number;
  pagesFetched?: number;
  committed: boolean;
  error?: string;
}

export default function ImportPage() {
  const [busy, setBusy] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [mode, setMode] = useState<"preview" | "commit" | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!busy) return;
    startRef.current = Date.now();
    setElapsed(0);
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 250);
    return () => clearInterval(id);
  }, [busy]);

  async function run(commit: boolean) {
    setBusy(true);
    setMode(commit ? "commit" : "preview");
    setResult(null);
    const res = await fetch("/api/import", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ commit }),
    });
    const data = await res.json();
    setBusy(false);
    setMode(null);
    setResult(res.ok ? data : { ...data, newConcerts: 0, skipped: 0, newVenues: 0, newVenueNames: [], committed: false });
  }

  return (
    <section className="space-y-6 max-w-2xl">
      <h1 className="font-display text-3xl">Setlist.fm Import</h1>
      <p className="text-muted text-sm">
        Preview first to review new concerts and venues. Commit writes them to Cosmos.
      </p>
      <div className="flex gap-2 items-center">
        <button
          onClick={() => run(false)}
          disabled={busy}
          className="border border-border px-3 py-1.5 rounded text-sm disabled:opacity-50"
        >
          Preview
        </button>
        <button
          onClick={() => run(true)}
          disabled={busy}
          className="bg-accent text-bg px-3 py-1.5 rounded text-sm disabled:opacity-50"
        >
          Commit
        </button>
      </div>

      {busy && (
        <div className="border border-border bg-surface rounded p-4 flex items-center gap-3">
          <span
            className="inline-block w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"
            aria-hidden
          />
          <div className="text-sm">
            <div>
              {mode === "commit" ? "Committing" : "Previewing"} import… <span className="text-muted">({elapsed}s)</span>
            </div>
            <div className="text-xs text-muted">
              Paging through setlist.fm at ~1.6 req/s. Large histories can take 30–90s.
            </div>
          </div>
        </div>
      )}
      {result && (
        <div className="border border-border bg-surface rounded p-4 space-y-2 text-sm">
          {result.error ? (
            <p className="text-red-400">{result.error}</p>
          ) : (
            <>
              <p>
                <strong>{result.newConcerts}</strong> new concerts ·{" "}
                <strong>{result.skipped}</strong> already imported ·{" "}
                <strong>{result.newVenues}</strong> new venues
              </p>
              <p className="text-muted text-xs">
                {result.committed ? "Committed to Cosmos." : "Preview only — nothing saved."}
              </p>
              {typeof result.fetchedFromApi === "number" && (
                <p className="text-muted text-xs">
                  setlist.fm: fetched <strong>{result.fetchedFromApi}</strong> of{" "}
                  <strong>{result.apiReportedTotal}</strong> attended setlists across{" "}
                  {result.pagesFetched} pages
                  {result.fetchedFromApi < (result.apiReportedTotal ?? 0) && (
                    <span className="text-red-400"> — incomplete! See server logs.</span>
                  )}
                </p>
              )}
              {result.newVenueNames.length > 0 && (
                <ul className="text-xs text-muted list-disc ml-5">
                  {result.newVenueNames.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
