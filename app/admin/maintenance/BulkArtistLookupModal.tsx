"use client";
import { useCallback, useEffect, useRef, useState } from "react";

interface QueueItem {
  slug: string;
  name: string;
  hasMusicbrainz: boolean;
  hasSetlistFm: boolean;
  hasDiscogs: boolean;
}

interface MbHit {
  id: string;
  name: string;
  score?: number;
  type?: string;
  country?: string;
  disambiguation?: string;
}

interface DiscogsHit {
  id: number;
  title: string;
  thumb?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

interface CandidatePack {
  mb: MbHit[];
  mbError: string | null;
  discogs: DiscogsHit[];
  discogsError: string | null;
}

export default function BulkArtistLookupModal({ open, onClose }: Props) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [index, setIndex] = useState(0);
  const [pack, setPack] = useState<CandidatePack | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickedMb, setPickedMb] = useState<MbHit | null>(null);
  const [pickedDiscogs, setPickedDiscogs] = useState<DiscogsHit | null>(null);
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState<{ saved: number; skipped: number; total: number } | null>(null);

  const savedCount = useRef(0);
  const skippedCount = useRef(0);

  const current = queue[index];

  const loadCandidates = useCallback(async (artist: QueueItem): Promise<CandidatePack> => {
    const out: CandidatePack = {
      mb: [],
      mbError: null,
      discogs: [],
      discogsError: null,
    };
    // Fetch in parallel
    const [mbRes, dRes] = await Promise.allSettled([
      artist.hasMusicbrainz
        ? Promise.resolve(null)
        : fetch(`/api/musicbrainz/search?q=${encodeURIComponent(artist.name)}`).then((r) =>
            r.ok ? r.json() : r.json().then((d) => Promise.reject(new Error(d.error ?? r.statusText))),
          ),
      artist.hasDiscogs
        ? Promise.resolve(null)
        : fetch(`/api/discogs/search?q=${encodeURIComponent(artist.name)}`).then((r) =>
            r.ok ? r.json() : r.json().then((d) => Promise.reject(new Error(d.error ?? r.statusText))),
          ),
    ]);
    if (mbRes.status === "fulfilled" && mbRes.value) {
      out.mb = ((mbRes.value as { artists?: MbHit[] }).artists ?? []).slice(0, 8);
    } else if (mbRes.status === "rejected") {
      out.mbError = mbRes.reason instanceof Error ? mbRes.reason.message : String(mbRes.reason);
    }
    if (dRes.status === "fulfilled" && dRes.value) {
      out.discogs = ((dRes.value as { artists?: DiscogsHit[] }).artists ?? []).slice(0, 8);
    } else if (dRes.status === "rejected") {
      out.discogsError = dRes.reason instanceof Error ? dRes.reason.message : String(dRes.reason);
    }
    return out;
  }, []);

  // Fetch queue when modal opens.
  useEffect(() => {
    if (!open) return;
    setBusy(true);
    setError(null);
    setQueue([]);
    setIndex(0);
    setSummary(null);
    savedCount.current = 0;
    skippedCount.current = 0;
    fetch("/api/maintenance/artist-queue")
      .then((r) => r.json())
      .then((d: { queue: QueueItem[]; total: number; error?: string }) => {
        if (d.error) throw new Error(d.error);
        setQueue(d.queue);
        setBusy(false);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : String(e));
        setBusy(false);
      });
  }, [open]);

  // Load candidates whenever current artist changes.
  useEffect(() => {
    if (!open || !current) return;
    let cancelled = false;
    setBusy(true);
    setPack(null);
    setPickedMb(null);
    setPickedDiscogs(null);
    loadCandidates(current)
      .then((p) => {
        if (cancelled) return;
        setPack(p);
        setBusy(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
        setBusy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, current, loadCandidates]);

  // ESC closes (only when not saving).
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !saving) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, saving, onClose]);

  function finishIfDone(nextIndex: number) {
    if (nextIndex >= queue.length) {
      setSummary({
        saved: savedCount.current,
        skipped: skippedCount.current,
        total: queue.length,
      });
    }
  }

  function skip() {
    if (!current) return;
    skippedCount.current += 1;
    const next = index + 1;
    setIndex(next);
    finishIfDone(next);
  }

  async function saveAndNext() {
    if (!current) return;
    if (!pickedMb && !pickedDiscogs) {
      // Nothing chosen — same as skip
      skip();
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const body: Record<string, unknown> = { name: current.name };
      if (pickedMb) {
        body.musicbrainzId = pickedMb.id;
        if (!current.hasSetlistFm) body.setlistFmMbid = pickedMb.id;
      }
      if (pickedDiscogs) {
        body.discogsArtistId = pickedDiscogs.id;
      }
      const res = await fetch(`/api/artists/${current.slug}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      savedCount.current += 1;
      const next = index + 1;
      setIndex(next);
      finishIfDone(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={() => !saving && onClose()}
    >
      <div
        className="bg-bg border border-border rounded-lg shadow-xl w-full max-w-4xl mt-8 mb-12"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-4 px-5 py-3 border-b border-border">
          <div>
            <h2 className="font-display text-xl">Artist Lookup</h2>
            {!summary && queue.length > 0 && (
              <p className="text-xs text-muted">
                {Math.min(index + 1, queue.length)} of {queue.length} · saved {savedCount.current} ·
                skipped {skippedCount.current}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className="text-muted hover:text-accent text-2xl leading-none disabled:opacity-50"
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="p-5">
          {error && (
            <p className="mb-3 text-sm text-red-400 break-all">{error}</p>
          )}

          {/* Initial load */}
          {busy && queue.length === 0 && (
            <p className="text-sm text-muted">Loading queue…</p>
          )}

          {/* Empty queue */}
          {!busy && !summary && queue.length === 0 && !error && (
            <p className="text-sm text-muted">
              No artists need lookup — every stored doc has both a MusicBrainz ID and a Discogs ID.
            </p>
          )}

          {/* Summary */}
          {summary && (
            <div className="space-y-2">
              <p className="text-accent font-medium">All done!</p>
              <p className="text-sm">
                Saved <strong>{summary.saved}</strong> · skipped{" "}
                <strong>{summary.skipped}</strong> of <strong>{summary.total}</strong> total.
              </p>
              <button
                onClick={onClose}
                className="bg-accent text-bg px-3 py-1.5 rounded text-sm mt-2"
              >
                Close
              </button>
            </div>
          )}

          {/* Current artist */}
          {!summary && current && (
            <div className="space-y-4">
              <div className="border-b border-border pb-2">
                <p className="font-display text-2xl">{current.name}</p>
                <p className="text-xs text-muted mt-1">
                  Currently:{" "}
                  {current.hasMusicbrainz ? (
                    <span className="text-accent">✓ MBID</span>
                  ) : (
                    <span className="text-muted">— MBID</span>
                  )}{" "}
                  ·{" "}
                  {current.hasDiscogs ? (
                    <span className="text-accent">✓ Discogs</span>
                  ) : (
                    <span className="text-muted">— Discogs</span>
                  )}
                </p>
              </div>

              {busy && <p className="text-sm text-muted">Searching MusicBrainz + Discogs…</p>}

              {!busy && pack && (
                <div className="grid md:grid-cols-2 gap-4">
                  <Column
                    title="MusicBrainz"
                    alreadyHas={current.hasMusicbrainz}
                    error={pack.mbError}
                  >
                    {pack.mb.map((a) => (
                      <CandidateRow
                        key={a.id}
                        selected={pickedMb?.id === a.id}
                        onClick={() => setPickedMb(a)}
                        name={a.name}
                        meta={[
                          typeof a.score === "number" ? `${a.score}` : "",
                          a.type ?? "",
                          a.country ?? "",
                          a.disambiguation ?? "",
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                        id={a.id}
                        externalUrl={`https://musicbrainz.org/artist/${a.id}`}
                      />
                    ))}
                    {pack.mb.length === 0 && !pack.mbError && (
                      <p className="text-xs text-muted">No MusicBrainz matches.</p>
                    )}
                  </Column>

                  <Column
                    title="Discogs"
                    alreadyHas={current.hasDiscogs}
                    error={pack.discogsError}
                  >
                    {pack.discogs.map((a) => (
                      <CandidateRow
                        key={a.id}
                        selected={pickedDiscogs?.id === a.id}
                        onClick={() => setPickedDiscogs(a)}
                        name={a.title}
                        thumb={a.thumb}
                        id={String(a.id)}
                        externalUrl={`https://www.discogs.com/artist/${a.id}`}
                      />
                    ))}
                    {pack.discogs.length === 0 && !pack.discogsError && (
                      <p className="text-xs text-muted">No Discogs matches.</p>
                    )}
                  </Column>
                </div>
              )}

              <footer className="flex items-center justify-between gap-2 pt-3 border-t border-border">
                <div className="text-xs text-muted">
                  {pickedMb && (
                    <span>
                      MBID <span className="text-accent">{pickedMb.id.slice(0, 8)}…</span>
                    </span>
                  )}
                  {pickedMb && pickedDiscogs && " · "}
                  {pickedDiscogs && (
                    <span>
                      Discogs <span className="text-accent">{pickedDiscogs.id}</span>
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={skip}
                    disabled={saving}
                    className="border border-border px-3 py-1.5 rounded text-sm disabled:opacity-50"
                  >
                    Skip
                  </button>
                  <button
                    onClick={saveAndNext}
                    disabled={saving || (!pickedMb && !pickedDiscogs)}
                    className="bg-accent text-bg px-3 py-1.5 rounded text-sm disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Save & next"}
                  </button>
                </div>
              </footer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Column({
  title,
  alreadyHas,
  error,
  children,
}: {
  title: string;
  alreadyHas: boolean;
  error: string | null;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border rounded p-3 bg-surface space-y-2">
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        {alreadyHas && <span className="text-[10px] text-accent uppercase tracking-wider">already set</span>}
      </header>
      {error ? (
        <p className="text-xs text-red-400 break-all">{error}</p>
      ) : alreadyHas ? (
        <p className="text-xs text-muted">This artist already has a {title} ID.</p>
      ) : (
        <ul className="space-y-1.5">{children}</ul>
      )}
    </section>
  );
}

function CandidateRow({
  selected,
  onClick,
  name,
  meta,
  id,
  thumb,
  externalUrl,
}: {
  selected: boolean;
  onClick: () => void;
  name: string;
  meta?: string;
  id: string;
  thumb?: string;
  externalUrl: string;
}) {
  return (
    <li
      className={`flex items-start gap-2 p-2 rounded cursor-pointer border ${
        selected ? "border-accent bg-bg" : "border-transparent hover:border-border/70 hover:bg-bg"
      }`}
      onClick={onClick}
    >
      {thumb && <img src={thumb} alt="" className="w-10 h-10 object-cover rounded shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${selected ? "text-accent font-medium" : ""}`}>{name}</p>
        {meta && <p className="text-[11px] text-muted mt-0.5">{meta}</p>}
        <p className="text-[10px] font-mono text-muted mt-0.5 truncate">{id}</p>
      </div>
      <a
        href={externalUrl}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="text-xs text-accent self-center"
        title="Open in a new tab"
      >
        ↗
      </a>
    </li>
  );
}
