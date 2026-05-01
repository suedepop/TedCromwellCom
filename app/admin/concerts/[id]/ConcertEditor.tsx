"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Concert, Photo, Setlist, TicketStub, Venue } from "@/lib/types";
import SortablePhotos from "@/components/media/SortablePhotos";
import UploadDropzone from "@/components/media/UploadDropzone";
import SetlistSortable from "@/components/concerts/SetlistSortable";

const MarkdownEditor = dynamic(() => import("@/components/ui/MarkdownEditor"), { ssr: false });

export interface MergeCandidate {
  id: string;
  label: string;
  sameDateAndVenue: boolean;
}

export default function ConcertEditor({
  concert,
  venues,
  mergeCandidates = [],
}: {
  concert: Concert;
  venues: Venue[];
  mergeCandidates?: MergeCandidate[];
}) {
  const router = useRouter();
  const [mergeId, setMergeId] = useState("");
  const [mergeError, setMergeError] = useState<string | null>(null);

  async function doMerge() {
    if (!mergeId) return;
    const target = mergeCandidates.find((c) => c.id === mergeId);
    const note = target?.sameDateAndVenue
      ? "Combine setlists, photos, stubs, links, and notes from this duplicate into the current concert? The other concert will be deleted."
      : "Merge the selected concert into THIS concert? The other concert will be deleted.";
    if (!confirm(note)) return;
    setMergeError(null);
    const res = await fetch("/api/concerts/merge", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ keepId: concert.id, mergeId }),
    });
    if (!res.ok) {
      setMergeError(`Merge failed: ${res.status}`);
      return;
    }
    router.refresh();
  }
  const [eventName, setEventName] = useState(concert.eventName ?? "");
  const [date, setDate] = useState(concert.date);
  const [city, setCity] = useState(concert.city);
  const [country, setCountry] = useState(concert.country);
  const [venueId, setVenueId] = useState(concert.venueId);
  const [notes, setNotes] = useState(concert.notes);
  const [writeUp, setWriteUp] = useState(concert.writeUp ?? "");
  const [linksText, setLinksText] = useState(
    concert.links.map((l) => `${l.label} | ${l.url}`).join("\n"),
  );
  const [photos, setPhotos] = useState<Photo[]>(concert.photos);
  const [featuredPhotoId, setFeaturedPhotoId] = useState<string | undefined>(concert.featuredPhotoId);
  const [videoUrlsText, setVideoUrlsText] = useState((concert.videoUrls ?? []).join("\n"));
  const [stubs, setStubs] = useState<TicketStub[]>(concert.ticketStubs);
  const [setlists, setSetlists] = useState<Setlist[]>(concert.setlists);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(
    nextPhotos = photos,
    nextStubs = stubs,
    nextSetlists = setlists,
    nextFeatured: string | undefined = featuredPhotoId,
  ) {
    setBusy(true);
    setError(null);
    const links = linksText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, url] = line.split("|").map((s) => s.trim());
        return { label: label ?? url, url: url ?? "" };
      })
      .filter((l) => l.url);
    const res = await fetch(`/api/concerts/${concert.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        eventName: eventName.trim() || undefined,
        date,
        city,
        country,
        venueId,
        notes,
        writeUp: writeUp.trim() || undefined,
        links,
        photos: nextPhotos,
        featuredPhotoId: nextFeatured && nextPhotos.some((p) => p.id === nextFeatured) ? nextFeatured : undefined,
        videoUrls: videoUrlsText.split("\n").map((s) => s.trim()).filter(Boolean),
        ticketStubs: nextStubs,
        setlists: nextSetlists,
      }),
    });
    setBusy(false);
    if (!res.ok) return setError(`Save failed: ${res.status}`);
    router.refresh();
  }

  const batchDirtyRef = useRef(false);
  function addPhoto(r: { blobUrl: string; thumbnailUrl?: string }) {
    const photo: Photo = {
      id: crypto.randomUUID(),
      blobUrl: r.blobUrl,
      thumbnailUrl: r.thumbnailUrl ?? r.blobUrl,
      uploadedAt: new Date().toISOString(),
    };
    batchDirtyRef.current = true;
    setPhotos((prev) => [...prev, photo]);
  }
  function flushPhotos() {
    if (!batchDirtyRef.current) return;
    batchDirtyRef.current = false;
    // Save using the latest photos via functional setter (no stale closure)
    setPhotos((current) => {
      save(current);
      return current;
    });
  }
  function addStub(r: { blobUrl: string; thumbnailUrl?: string }) {
    const next: TicketStub[] = [
      ...stubs,
      {
        id: crypto.randomUUID(),
        blobUrl: r.blobUrl,
        thumbnailUrl: r.thumbnailUrl ?? r.blobUrl,
        uploadedAt: new Date().toISOString(),
      },
    ];
    setStubs(next);
    save(photos, next);
  }
  function removePhoto(id: string) {
    const next = photos.filter((p) => p.id !== id);
    const nextFeatured = featuredPhotoId === id ? undefined : featuredPhotoId;
    setPhotos(next);
    setFeaturedPhotoId(nextFeatured);
    save(next, stubs, setlists, nextFeatured);
  }
  function chooseFeatured(id: string) {
    const next = featuredPhotoId === id ? undefined : id;
    setFeaturedPhotoId(next);
    save(photos, stubs, setlists, next);
  }
  function removeStub(id: string) {
    const next = stubs.filter((s) => s.id !== id);
    setStubs(next);
    save(photos, next);
  }
  function onSetlistsReordered(next: Setlist[]) {
    setSetlists(next);
    save(photos, stubs, next);
  }

  async function onDelete() {
    if (!confirm("Delete this concert?")) return;
    const res = await fetch(`/api/concerts/${concert.id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/concerts");
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Edit Concert</h1>
        <div className="flex gap-2">
          <button onClick={() => save()} disabled={busy} className="bg-accent text-bg px-3 py-1.5 rounded text-sm disabled:opacity-50">
            Save
          </button>
          <button onClick={onDelete} className="border border-red-500/50 text-red-400 px-3 py-1.5 rounded text-sm">
            Delete
          </button>
        </div>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <p className="text-xs text-muted">
        Artists & songs are imported from setlist.fm — re-import to refresh. Editable fields below.
      </p>
      <Field label="Tour / event name (optional — shown above the band list)">
        <input
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="e.g. Lollapalooza 2024, The Renaissance World Tour"
          className="w-full bg-surface border border-border rounded px-3 py-2"
        />
      </Field>
      <Field label="Date">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-surface border border-border rounded px-3 py-2" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="City">
          <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2" />
        </Field>
        <Field label="Country">
          <input value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2" />
        </Field>
      </div>
      <Field label="Venue">
        <select value={venueId} onChange={(e) => setVenueId(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2">
          {venues.map((v) => (
            <option key={v.id} value={v.id}>
              {v.canonicalName} — {v.city}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Links (one per line: Label | URL)">
        <textarea rows={4} value={linksText} onChange={(e) => setLinksText(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2 font-mono text-xs" />
      </Field>
      <Field label="Write-up (markdown — shown above the setlist on the public page)">
        <MarkdownEditor value={writeUp} onChange={setWriteUp} />
      </Field>
      <Field label="Notes (short, plain text — appears at the bottom of the public page)">
        <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2 text-sm" />
      </Field>

      <section className="space-y-2">
        <h2 className="font-display text-xl">Band order</h2>
        <p className="text-xs text-muted">
          Drag to reorder. This controls the order of setlists on the concert page and the fallback title when no display name is set.
        </p>
        <SetlistSortable setlists={setlists} onChange={onSetlistsReordered} />
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl">Photos</h2>
        <UploadDropzone
          endpoint="/api/upload/photo"
          multiple
          onUploaded={addPhoto}
          onBatchDone={flushPhotos}
          label="Drop photos here or click to upload"
        />
        {photos.length > 0 && (
          <>
            <p className="text-xs text-muted">
              Click the ★ to feature a photo on the concert list card. Drag the ⋮⋮ handle to reorder.
            </p>
            <SortablePhotos
              photos={photos}
              featuredId={featuredPhotoId}
              onReorder={(next) => {
                setPhotos(next);
                save(next, stubs, setlists, featuredPhotoId);
              }}
              onSelectFeatured={chooseFeatured}
              onRemove={removePhoto}
            />
          </>
        )}
      </section>

      <Field label="YouTube video URLs (one per line)">
        <textarea
          rows={4}
          value={videoUrlsText}
          onChange={(e) => setVideoUrlsText(e.target.value)}
          placeholder={"https://www.youtube.com/watch?v=…\nhttps://youtu.be/…"}
          className="w-full bg-surface border border-border rounded px-3 py-2 font-mono text-xs"
        />
      </Field>

      <section className="space-y-2">
        <h2 className="font-display text-xl">Ticket Stubs</h2>
        <UploadDropzone endpoint="/api/upload/stub" onUploaded={addStub} label="Upload ticket stub" />
        {stubs.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {stubs.map((s) => (
              <div key={s.id} className="relative group">
                <img src={s.thumbnailUrl} alt="" className="rounded border border-border" />
                <button onClick={() => removeStub(s.id)} className="absolute top-1 right-1 text-xs bg-red-600/80 text-white px-1.5 rounded opacity-0 group-hover:opacity-100">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {mergeCandidates.length > 0 && (
        <section className="border border-border rounded p-4 bg-surface space-y-3">
          <h2 className="font-display text-lg">Merge another concert into this one</h2>
          {mergeCandidates.some((c) => c.sameDateAndVenue) && (
            <p className="text-xs text-accent">
              ⚠ Possible duplicate detected (same date + venue) — listed first.
            </p>
          )}
          <div className="flex gap-2">
            <select
              value={mergeId}
              onChange={(e) => setMergeId(e.target.value)}
              className="flex-1 bg-bg border border-border rounded px-3 py-2 text-sm"
            >
              <option value="">Select a concert to merge…</option>
              {mergeCandidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.sameDateAndVenue ? "★ " : ""}
                  {c.label}
                </option>
              ))}
            </select>
            <button
              onClick={doMerge}
              disabled={!mergeId}
              className="bg-accent text-bg px-3 rounded text-sm disabled:opacity-50"
            >
              Merge
            </button>
          </div>
          {mergeError && <p className="text-xs text-red-400">{mergeError}</p>}
          <p className="text-xs text-muted">
            Combines setlists, photos, ticket stubs, links, video URLs, and notes from the other
            concert into this one. The other concert is then deleted.
          </p>
        </section>
      )}
    </div>
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
