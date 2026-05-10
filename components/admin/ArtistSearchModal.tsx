"use client";
import { useEffect, useState } from "react";

export interface ModalCandidate {
  id: string; // mbid (UUID) or stringified Discogs numeric id
  name: string;
  /** Optional bits to display under the name. */
  meta?: string;
  /** External URL for the candidate (opens in a new tab on click of the icon). */
  externalUrl?: string;
  thumb?: string;
}

interface Props {
  /** Modal open / close */
  open: boolean;
  onClose: () => void;
  /** Title shown at the top of the modal. */
  title: string;
  /** Initial query (typically the artist name). */
  initialQuery: string;
  /** Where to fetch search results — must accept `?q=…` and return `{ artists: [...] }`. */
  searchUrl: string;
  /** Map a raw API result into a ModalCandidate. */
  mapResult: (raw: unknown) => ModalCandidate;
  /** Called with the chosen candidate when the user clicks one. */
  onPick: (c: ModalCandidate) => void;
}

export default function ArtistSearchModal({
  open,
  onClose,
  title,
  initialQuery,
  searchUrl,
  mapResult,
  onPick,
}: Props) {
  const [q, setQ] = useState(initialQuery);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ModalCandidate[]>([]);

  // Reset query whenever the modal re-opens against a different initial value.
  useEffect(() => {
    if (open) {
      setQ(initialQuery);
      setResults([]);
      setError(null);
      // Auto-search on open if there's a meaningful initial query.
      if (initialQuery.trim()) void runSearch(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialQuery]);

  // ESC closes the modal.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function runSearch(query: string) {
    if (!query.trim()) return;
    setBusy(true);
    setError(null);
    setResults([]);
    try {
      const url = `${searchUrl}?q=${encodeURIComponent(query.trim())}`;
      const res = await fetch(url);
      const data = (await res.json()) as { artists?: unknown[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setResults((data.artists ?? []).map(mapResult));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-bg border border-border rounded-lg shadow-xl w-full max-w-2xl mt-12 mb-12"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-4 px-5 py-3 border-b border-border">
          <h2 className="font-display text-xl">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-accent text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void runSearch(q);
          }}
          className="px-5 py-3 border-b border-border flex gap-2"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className="flex-1 bg-surface border border-border rounded px-3 py-2 text-sm focus:border-accent outline-none"
            autoFocus
          />
          <button
            type="submit"
            disabled={busy}
            className="bg-accent text-bg px-4 rounded text-sm disabled:opacity-50"
          >
            {busy ? "Searching…" : "Search"}
          </button>
        </form>

        <div className="max-h-[60vh] overflow-y-auto">
          {error && (
            <p className="px-5 py-3 text-red-400 text-sm">Error: {error}</p>
          )}
          {!error && !busy && results.length === 0 && (
            <p className="px-5 py-6 text-muted text-sm text-center">
              {q.trim() ? "No results." : "Enter a query and press Search."}
            </p>
          )}
          <ul className="divide-y divide-border/50">
            {results.map((r) => (
              <li key={r.id} className="flex items-start gap-3 px-5 py-3 hover:bg-surface">
                {r.thumb && (
                  <img
                    src={r.thumb}
                    alt=""
                    className="w-12 h-12 object-cover rounded shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      onPick(r);
                      onClose();
                    }}
                    className="block text-left font-medium hover:text-accent"
                  >
                    {r.name}
                  </button>
                  {r.meta && <p className="text-xs text-muted mt-0.5">{r.meta}</p>}
                  <p className="text-[10px] font-mono text-muted mt-0.5 truncate">{r.id}</p>
                </div>
                {r.externalUrl && (
                  <a
                    href={r.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-accent self-center"
                    title="Open in a new tab"
                  >
                    ↗
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
