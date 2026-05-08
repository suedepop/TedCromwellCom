"use client";
import { useEffect, useRef, useState } from "react";

interface Result {
  fetchedFromApi: number;
  apiReportedTotal: number;
  pagesFetched: number;
  newRecords: number;
  updatedRecords: number;
  newRecordTitles: string[];
  committed: boolean;
  error?: string;
}

export default function DiscogsImportPage() {
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"preview" | "commit" | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const startRef = useRef(0);

  useEffect(() => {
    if (!busy) return;
    startRef.current = Date.now();
    setElapsed(0);
    const id = setInterval(
      () => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)),
      250,
    );
    return () => clearInterval(id);
  }, [busy]);

  async function run(commit: boolean) {
    setBusy(true);
    setMode(commit ? "commit" : "preview");
    setResult(null);
    const res = await fetch("/api/discogs/import", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ commit }),
    });
    const data = await res.json();
    setBusy(false);
    setMode(null);
    setResult(
      res.ok
        ? data
        : { ...data, fetchedFromApi: 0, apiReportedTotal: 0, pagesFetched: 0, newRecords: 0, updatedRecords: 0, newRecordTitles: [], committed: false },
    );
  }

  return (
    <section className="space-y-6 max-w-2xl">
      <h1 className="font-display text-3xl">Discogs Import</h1>
      <p className="text-muted text-sm">
        Pulls your Discogs collection page-by-page (~1 page/sec to stay under the rate limit). Preview
        first to see counts; Commit upserts records into Cosmos. Existing records keep your private
        notes and hidden flag.
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
              {mode === "commit" ? "Committing" : "Previewing"} import…{" "}
              <span className="text-muted">({elapsed}s)</span>
            </div>
            <div className="text-xs text-muted">
              Discogs paginates 100 records per request; large collections take ~1s per page.
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
                <strong>{result.newRecords}</strong> new ·{" "}
                <strong>{result.updatedRecords}</strong> updated ·{" "}
                <strong>{result.fetchedFromApi}</strong> of {result.apiReportedTotal} fetched (
                {result.pagesFetched} pages)
              </p>
              <p className="text-muted text-xs">
                {result.committed ? "Committed to Cosmos." : "Preview only — nothing saved."}
              </p>
              {result.newRecordTitles.length > 0 && (
                <ul className="text-xs text-muted list-disc ml-5">
                  {result.newRecordTitles.map((t) => (
                    <li key={t}>{t}</li>
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
