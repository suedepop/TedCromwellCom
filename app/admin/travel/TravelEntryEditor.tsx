"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Photo, TravelEntry } from "@/lib/types";
import UploadDropzone from "@/components/media/UploadDropzone";
import SortablePhotos from "@/components/media/SortablePhotos";
import FacebookPostButton from "@/components/admin/FacebookPostButton";

const MarkdownEditor = dynamic(() => import("@/components/ui/MarkdownEditor"), { ssr: false });
const LocationPicker = dynamic(() => import("@/components/travel/LocationPicker"), {
  ssr: false,
  loading: () => <div className="h-[320px] bg-surface border border-border rounded" />,
});

interface Props {
  entry?: TravelEntry;
}

export default function TravelEntryEditor({ entry }: Props) {
  const router = useRouter();
  const [locationName, setLocationName] = useState(entry?.locationName ?? "");
  const [startDate, setStartDate] = useState(entry?.startDate ?? "");
  const [endDate, setEndDate] = useState(entry?.endDate ?? "");
  const [city, setCity] = useState(entry?.city ?? "");
  const [stateName, setStateName] = useState(entry?.state ?? "");
  const [country, setCountry] = useState(entry?.country ?? "");
  const [lat, setLat] = useState<number | null>(entry?.lat ?? null);
  const [lng, setLng] = useState<number | null>(entry?.lng ?? null);
  const [content, setContent] = useState(entry?.content ?? "");
  const [photos, setPhotos] = useState<Photo[]>(entry?.photos ?? []);
  const [featuredPhotoId, setFeaturedPhotoId] = useState<string | undefined>(entry?.featuredPhotoId);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const batchDirtyRef = useRef(false);

  const canSave = !!locationName && !!startDate && !!country && lat != null && lng != null;

  async function save(
    nextPhotos = photos,
    nextFeatured: string | undefined = featuredPhotoId,
  ) {
    if (!canSave) {
      setError("Location name, start date, country, and map pin are required.");
      return;
    }
    setBusy(true);
    setError(null);
    const payload = {
      locationName,
      startDate,
      endDate: endDate || undefined,
      city: city || undefined,
      state: stateName || undefined,
      country,
      lat,
      lng,
      content,
      photos: nextPhotos,
      featuredPhotoId: nextFeatured,
    };
    const url = entry ? `/api/travel/${entry.id}` : "/api/travel";
    const method = entry ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!res.ok) {
      setError(`Save failed: ${res.status}`);
      return;
    }
    const saved = (await res.json()) as TravelEntry;
    if (!entry) router.push(`/admin/travel/${saved.id}`);
    else router.refresh();
  }

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
    setPhotos((current) => {
      save(current);
      return current;
    });
  }
  function removePhoto(id: string) {
    const next = photos.filter((p) => p.id !== id);
    const nextFeatured = featuredPhotoId === id ? undefined : featuredPhotoId;
    setPhotos(next);
    setFeaturedPhotoId(nextFeatured);
    save(next, nextFeatured);
  }
  function chooseFeatured(id: string) {
    const next = featuredPhotoId === id ? undefined : id;
    setFeaturedPhotoId(next);
    save(photos, next);
  }

  async function onDelete() {
    if (!entry) return;
    if (!confirm("Delete this entry?")) return;
    const res = await fetch(`/api/travel/${entry.id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
      router.replace("/admin/travel");
    }
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">{entry ? "Edit entry" : "New entry"}</h1>
        <div className="flex gap-2">
          <button onClick={() => save()} disabled={busy || !canSave} className="bg-accent text-bg px-3 py-1.5 rounded text-sm disabled:opacity-50">
            Save
          </button>
          {entry && (
            <button onClick={onDelete} className="border border-red-500/50 text-red-400 px-3 py-1.5 rounded text-sm">
              Delete
            </button>
          )}
        </div>
      </div>
      {entry && (
        <FacebookPostButton
          type="travel"
          id={entry.id}
          lastPostedAt={entry.lastPostedToFacebookAt}
          lastPostedUrl={entry.lastPostedToFacebookUrl}
        />
      )}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <Field label="Location name">
        <input className="w-full bg-surface border border-border rounded px-3 py-2 text-lg" value={locationName} onChange={(e) => setLocationName(e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Start date">
          <input type="date" className="w-full bg-surface border border-border rounded px-3 py-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </Field>
        <Field label="End date (blank = same as start)">
          <input type="date" className="w-full bg-surface border border-border rounded px-3 py-2" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="City">
          <input className="w-full bg-surface border border-border rounded px-3 py-2 text-sm" value={city} onChange={(e) => setCity(e.target.value)} />
        </Field>
        <Field label="State / Region">
          <input className="w-full bg-surface border border-border rounded px-3 py-2 text-sm" value={stateName} onChange={(e) => setStateName(e.target.value)} />
        </Field>
        <Field label="Country">
          <input className="w-full bg-surface border border-border rounded px-3 py-2 text-sm" value={country} onChange={(e) => setCountry(e.target.value)} />
        </Field>
      </div>

      <div className="space-y-2">
        <span className="block text-xs uppercase tracking-wider text-muted">Location pin</span>
        <p className="text-xs text-muted">Search a place to jump the map, then pan to center the pin on the exact spot.</p>
        <LocationPicker
          lat={lat}
          lng={lng}
          onChange={(newLat, newLng) => {
            setLat(Number(newLat.toFixed(6)));
            setLng(Number(newLng.toFixed(6)));
          }}
        />
        <div className="grid grid-cols-2 gap-4 text-xs font-mono text-muted">
          <div>Lat: {lat ?? "—"}</div>
          <div>Lng: {lng ?? "—"}</div>
        </div>
      </div>

      <Field label="Blog post (markdown)">
        <MarkdownEditor value={content} onChange={setContent} />
      </Field>

      <section className="space-y-2">
        <h2 className="font-display text-xl">Photos</h2>
        <UploadDropzone
          endpoint="/api/upload/trip-cover"
          multiple
          onUploaded={addPhoto}
          onBatchDone={flushPhotos}
          label="Upload photos (multi-select + drag supported)"
        />
        {photos.length > 0 && (
          <SortablePhotos
            photos={photos}
            featuredId={featuredPhotoId}
            onReorder={(next) => {
              setPhotos(next);
              save(next, featuredPhotoId);
            }}
            onSelectFeatured={chooseFeatured}
            onRemove={removePhoto}
          />
        )}
        <p className="text-xs text-muted">Drag the ⋮⋮ handle on top of any photo to reorder.</p>
      </section>
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
