"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import type { ArtistAggregate } from "@/lib/artists";

interface Props {
  artist: ArtistAggregate;
}

export default function ArtistEditor({ artist }: Props) {
  const router = useRouter();
  const s = artist.stored;
  const [name, setName] = useState(artist.name);
  const [aliasesText, setAliasesText] = useState((s?.aliases ?? []).join("\n"));
  const [musicbrainzId, setMusicbrainzId] = useState(s?.musicbrainzId ?? "");
  const [setlistFmMbid, setSetlistFmMbid] = useState(s?.setlistFmMbid ?? "");
  const [discogsArtistId, setDiscogsArtistId] = useState(
    s?.discogsArtistId ? String(s.discogsArtistId) : "",
  );
  const [description, setDescription] = useState(s?.description ?? "");
  const [imageUrl, setImageUrl] = useState(s?.imageUrl ?? "");
  const [notes, setNotes] = useState(s?.notes ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setError(null);
    const aliases = aliasesText
      .split(/\r?\n/)
      .map((a) => a.trim())
      .filter(Boolean);
    const res = await fetch(`/api/artists/${artist.slug}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        aliases,
        musicbrainzId: musicbrainzId.trim() || undefined,
        setlistFmMbid: setlistFmMbid.trim() || undefined,
        discogsArtistId: discogsArtistId.trim()
          ? Number(discogsArtistId.trim())
          : undefined,
        description,
        imageUrl: imageUrl.trim() || undefined,
        notes,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setError(`Save failed: ${res.status}`);
      return;
    }
    router.refresh();
  }

  async function onDelete() {
    if (!s) return;
    if (!confirm(`Delete the stored Artist doc for "${artist.name}"? Concerts/records aren't affected.`)) {
      return;
    }
    const res = await fetch(`/api/artists/${artist.slug}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/artists");
      router.refresh();
    }
  }

  // Useful lookup links — open the right search/result in a new tab.
  const mbSearchUrl = `https://musicbrainz.org/search?type=artist&query=${encodeURIComponent(artist.name)}`;
  const setlistSearchUrl = `https://www.setlist.fm/search?query=${encodeURIComponent(artist.name)}`;
  const discogsSearchUrl = `https://www.discogs.com/search/?type=artist&q=${encodeURIComponent(artist.name)}`;
  const mbResolvedUrl = musicbrainzId
    ? `https://musicbrainz.org/artist/${musicbrainzId}`
    : null;
  const setlistResolvedUrl = setlistFmMbid
    ? `https://www.setlist.fm/setlists/${setlistFmMbid}.html`
    : null;
  const discogsResolvedUrl = discogsArtistId
    ? `https://www.discogs.com/artist/${discogsArtistId}`
    : null;

  return (
    <section className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link href="/admin/artists" className="text-xs text-muted hover:text-accent">
            ← Artists
          </Link>
          <h1 className="font-display text-3xl mt-1">{artist.name}</h1>
          <p className="text-xs text-muted">
            {artist.concerts.length} concerts · {artist.records.length} records ·{" "}
            <Link href={`/artists/${artist.slug}`} target="_blank" className="text-accent">
              View public page ↗
            </Link>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={busy}
            className="bg-accent text-bg px-3 py-1.5 rounded text-sm disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save"}
          </button>
          {s && (
            <button
              onClick={onDelete}
              className="border border-red-500/50 text-red-400 px-3 py-1.5 rounded text-sm"
            >
              Delete doc
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {!s && (
        <p className="text-xs text-muted bg-surface border border-border rounded p-3">
          No stored Artist doc yet for this artist. Saving will create one.
        </p>
      )}

      <Field label="Canonical name (overrides the most-common derived name)">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-surface border border-border rounded px-3 py-2"
        />
      </Field>

      <Field label="Aliases (one per line — alternate spellings that should resolve to this artist)">
        <textarea
          rows={4}
          value={aliasesText}
          onChange={(e) => setAliasesText(e.target.value)}
          placeholder="Pixies (US)&#10;The Pixies"
          className="w-full bg-surface border border-border rounded px-3 py-2 text-sm font-mono"
        />
      </Field>

      <fieldset className="space-y-3 border border-border rounded p-4">
        <legend className="text-xs uppercase tracking-wider text-muted px-2">
          External IDs
        </legend>

        <IdField
          label="MusicBrainz ID (MBID, UUID format)"
          value={musicbrainzId}
          onChange={setMusicbrainzId}
          searchUrl={mbSearchUrl}
          resolvedUrl={mbResolvedUrl}
          searchLabel="Search MusicBrainz ↗"
          resolvedLabel="View on MusicBrainz ↗"
          placeholder="a74b1b7f-71a5-4011-9441-d0b5e4122711"
        />

        <IdField
          label="Setlist.fm artist MBID (typically same as the MusicBrainz one)"
          value={setlistFmMbid}
          onChange={setSetlistFmMbid}
          searchUrl={setlistSearchUrl}
          resolvedUrl={setlistResolvedUrl}
          searchLabel="Search setlist.fm ↗"
          resolvedLabel="View on setlist.fm ↗"
          placeholder="a74b1b7f-71a5-4011-9441-d0b5e4122711"
        />

        <IdField
          label="Discogs artist ID (numeric)"
          value={discogsArtistId}
          onChange={setDiscogsArtistId}
          searchUrl={discogsSearchUrl}
          resolvedUrl={discogsResolvedUrl}
          searchLabel="Search Discogs ↗"
          resolvedLabel="View on Discogs ↗"
          placeholder="12345"
          inputMode="numeric"
        />
      </fieldset>

      <Field label="Image URL (optional — artist portrait)">
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://…"
          className="w-full bg-surface border border-border rounded px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Description (markdown — public bio / write-up)">
        <textarea
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-surface border border-border rounded px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Notes (private — admin only)">
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-surface border border-border rounded px-3 py-2 text-sm"
        />
      </Field>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs uppercase tracking-wider text-muted">{label}</span>
      {children}
    </label>
  );
}

interface IdFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  searchUrl: string;
  resolvedUrl: string | null;
  searchLabel: string;
  resolvedLabel: string;
  placeholder?: string;
  inputMode?: "text" | "numeric";
}

function IdField({
  label,
  value,
  onChange,
  searchUrl,
  resolvedUrl,
  searchLabel,
  resolvedLabel,
  placeholder,
  inputMode = "text",
}: IdFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block">
        <span className="text-xs text-muted">{label}</span>
        <input
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-surface border border-border rounded px-3 py-2 text-sm font-mono mt-1"
        />
      </label>
      <div className="flex gap-3 text-xs">
        <a href={searchUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">
          {searchLabel}
        </a>
        {resolvedUrl && (
          <a
            href={resolvedUrl}
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            {resolvedLabel}
          </a>
        )}
      </div>
    </div>
  );
}
