"use client";
import { useState } from "react";

interface Props {
  type: "blog" | "concert" | "travel";
  id: string;
  /** Disable when the entity hasn't been saved yet, etc. */
  disabled?: boolean;
}

export default function FacebookPostButton({ type, id, disabled = false }: Props) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; postUrl?: string; error?: string; attached?: number } | null>(null);

  async function go() {
    if (
      !confirm(
        "Post this to Facebook? Body + link + all images will be sent to the configured Page.",
      )
    ) {
      return;
    }
    setBusy(true);
    setResult(null);
    const res = await fetch("/api/facebook/post", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type, id }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setResult({ ok: false, error: data.error ?? `HTTP ${res.status}` });
    } else {
      setResult({ ok: true, postUrl: data.postUrl, attached: data.attached });
    }
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={go}
        disabled={busy || disabled}
        className="border border-[#1877F2]/60 text-[#1877F2] px-3 py-1.5 rounded text-sm disabled:opacity-50"
        title="Post to the configured Facebook Page"
      >
        {busy ? "Posting…" : "Post to Facebook"}
      </button>
      {result?.ok && (
        <p className="text-xs text-accent">
          Posted ({result.attached ?? 0} images).{" "}
          {result.postUrl && (
            <a href={result.postUrl} target="_blank" rel="noreferrer" className="underline">
              View on Facebook ↗
            </a>
          )}
        </p>
      )}
      {result?.ok === false && <p className="text-xs text-red-400">Failed: {result.error}</p>}
    </div>
  );
}
