"use client";
import { useState } from "react";

interface BootstrapResult {
  ok: boolean;
  created: number;
  updated: number;
  skipped: number;
  totalSeen: number;
  newArtistNames: string[];
  log?: string[];
  error?: string;
  dryRun?: boolean;
}

interface SlugsResult {
  ok: boolean;
  concertsUpdated: number;
  travelUpdated: number;
  log?: string[];
  error?: string;
  dryRun?: boolean;
}

interface VerifyResult {
  ok: boolean;
  cosmos: { name: string; ok: boolean; partitionKey?: string[]; error?: string }[];
  blob: { name: string; ok: boolean; error?: string }[];
  storage?: { kind?: string; sku?: string };
  database?: string;
  error?: string;
}

export default function MaintenancePanel() {
  const [bootstrap, setBootstrap] = useState<BootstrapResult | null>(null);
  const [slugs, setSlugs] = useState<SlugsResult | null>(null);
  const [verify, setVerify] = useState<VerifyResult | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function runBootstrap(opts: { refillDiscogs?: boolean; dryRun?: boolean }) {
    setBusy("bootstrap");
    setBootstrap(null);
    const res = await fetch("/api/maintenance/bootstrap-artists", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(opts),
    });
    const data = await res.json();
    setBusy(null);
    setBootstrap(res.ok ? { ...data, dryRun: opts.dryRun } : { ok: false, ...data });
  }

  async function runSlugs(opts: { dryRun?: boolean }) {
    setBusy("slugs");
    setSlugs(null);
    const res = await fetch("/api/maintenance/backfill-slugs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(opts),
    });
    const data = await res.json();
    setBusy(null);
    setSlugs(res.ok ? { ...data, dryRun: opts.dryRun } : { ok: false, ...data });
  }

  async function runVerify() {
    setBusy("verify");
    setVerify(null);
    const res = await fetch("/api/maintenance/verify-connections");
    const data = await res.json();
    setBusy(null);
    setVerify(res.ok ? data : { ok: false, cosmos: [], blob: [], ...data });
  }

  return (
    <section className="space-y-8 max-w-3xl">
      <header>
        <h1 className="font-display text-3xl">Maintenance</h1>
        <p className="text-muted text-sm mt-1">
          Idempotent jobs for keeping data aligned. Safe to re-run.
        </p>
      </header>

      <Card
        title="Bootstrap artist docs"
        description="Walk concerts + records and create one Artist doc per unique normalized name. Pre-fills Discogs IDs from records when present."
      >
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => runBootstrap({ dryRun: true })}
            disabled={!!busy}
            className="border border-border px-3 py-1.5 rounded text-sm disabled:opacity-50"
          >
            Dry-run
          </button>
          <button
            onClick={() => runBootstrap({})}
            disabled={!!busy}
            className="bg-accent text-bg px-3 py-1.5 rounded text-sm disabled:opacity-50"
          >
            Run
          </button>
          <button
            onClick={() => runBootstrap({ refillDiscogs: true })}
            disabled={!!busy}
            className="border border-accent text-accent px-3 py-1.5 rounded text-sm disabled:opacity-50"
            title="Also fill missing Discogs IDs on existing Artist docs"
          >
            Run + refill Discogs IDs
          </button>
          {busy === "bootstrap" && <Spinner />}
        </div>
        {bootstrap && (
          <ResultBlock>
            {bootstrap.error ? (
              <p className="text-red-400">{bootstrap.error}</p>
            ) : (
              <>
                <p>
                  <strong>{bootstrap.created}</strong> created ·{" "}
                  <strong>{bootstrap.updated}</strong> updated ·{" "}
                  <strong>{bootstrap.skipped}</strong> skipped ·{" "}
                  <strong>{bootstrap.totalSeen}</strong> total seen
                </p>
                <p className="text-muted text-xs">
                  {bootstrap.dryRun ? "Dry-run only — nothing written." : "Saved to Cosmos."}
                </p>
                {bootstrap.newArtistNames.length > 0 && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted">
                      Show first {bootstrap.newArtistNames.length} new artists
                    </summary>
                    <ul className="list-disc ml-5 mt-1">
                      {bootstrap.newArtistNames.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </>
            )}
          </ResultBlock>
        )}
      </Card>

      <Card
        title="Backfill slugs"
        description="Generate URL slugs for any concerts and travel entries that don't have one. Useful right after a setlist.fm import."
      >
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => runSlugs({ dryRun: true })}
            disabled={!!busy}
            className="border border-border px-3 py-1.5 rounded text-sm disabled:opacity-50"
          >
            Dry-run
          </button>
          <button
            onClick={() => runSlugs({})}
            disabled={!!busy}
            className="bg-accent text-bg px-3 py-1.5 rounded text-sm disabled:opacity-50"
          >
            Run
          </button>
          {busy === "slugs" && <Spinner />}
        </div>
        {slugs && (
          <ResultBlock>
            {slugs.error ? (
              <p className="text-red-400">{slugs.error}</p>
            ) : (
              <>
                <p>
                  <strong>{slugs.concertsUpdated}</strong> concerts ·{" "}
                  <strong>{slugs.travelUpdated}</strong> travel entries got new slugs.
                </p>
                <p className="text-muted text-xs">
                  {slugs.dryRun ? "Dry-run only — nothing written." : "Saved to Cosmos."}
                </p>
              </>
            )}
          </ResultBlock>
        )}
      </Card>

      <Card
        title="Verify connections"
        description="Health-check every Cosmos container and Blob container."
      >
        <div className="flex flex-wrap gap-2">
          <button
            onClick={runVerify}
            disabled={!!busy}
            className="bg-accent text-bg px-3 py-1.5 rounded text-sm disabled:opacity-50"
          >
            Run check
          </button>
          {busy === "verify" && <Spinner />}
        </div>
        {verify && (
          <ResultBlock>
            {verify.error ? (
              <p className="text-red-400">{verify.error}</p>
            ) : (
              <>
                <p className={verify.ok ? "text-accent" : "text-red-400"}>
                  {verify.ok ? "All checks passed." : "Some checks failed."}
                </p>
                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="uppercase tracking-wider text-muted mb-1">Cosmos</p>
                    <ul className="space-y-0.5 font-mono">
                      {verify.cosmos.map((c) => (
                        <li key={c.name}>
                          <span className={c.ok ? "text-accent" : "text-red-400"}>
                            {c.ok ? "✓" : "✗"}
                          </span>{" "}
                          {c.name}
                          {c.partitionKey && (
                            <span className="text-muted"> ({c.partitionKey.join(",")})</span>
                          )}
                          {c.error && <span className="text-red-400"> — {c.error}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="uppercase tracking-wider text-muted mb-1">Blob</p>
                    <ul className="space-y-0.5 font-mono">
                      {verify.blob.map((b) => (
                        <li key={b.name}>
                          <span className={b.ok ? "text-accent" : "text-red-400"}>
                            {b.ok ? "✓" : "✗"}
                          </span>{" "}
                          {b.name}
                          {b.error && <span className="text-red-400"> — {b.error}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="text-muted text-xs">
                  Database: {verify.database ?? "—"} · Storage: {verify.storage?.kind ?? "—"} /{" "}
                  {verify.storage?.sku ?? "—"}
                </p>
              </>
            )}
          </ResultBlock>
        )}
      </Card>

      <p className="text-xs text-muted">
        These jobs also run automatically after the relevant imports — Discogs commit triggers a
        bootstrap, setlist.fm commit triggers a slug backfill plus a bootstrap. Buttons here are for
        ad-hoc runs, dry-runs, and the Discogs-ID refill.
      </p>
    </section>
  );
}

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <article className="border border-border bg-surface rounded p-5 space-y-3">
      <header>
        <h2 className="font-display text-xl">{title}</h2>
        <p className="text-sm text-muted">{description}</p>
      </header>
      {children}
    </article>
  );
}

function ResultBlock({ children }: { children: React.ReactNode }) {
  return <div className="border border-border bg-bg rounded p-3 text-sm space-y-2">{children}</div>;
}

function Spinner() {
  return (
    <span
      className="inline-block w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin self-center"
      aria-hidden
    />
  );
}
