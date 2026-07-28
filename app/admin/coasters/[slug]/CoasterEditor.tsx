"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Coaster, CoasterStatus, CoasterType, Park, Photo } from "@/lib/types";
import UploadDropzone, { type UploadResult } from "@/components/media/UploadDropzone";
import SortablePhotos from "@/components/media/SortablePhotos";
import MarkdownEditor, { type MarkdownEditorHandle } from "@/components/ui/MarkdownEditor";

const TYPES: CoasterType[] = [
  "steel", "wood", "hybrid", "kiddie", "powered", "launched", "inverted", "flying", "mountain", "water", "other",
];
const STATUSES: CoasterStatus[] = [
  "open", "closed", "sbno", "under-construction", "relocated",
];

export default function CoasterEditor({
  coaster,
  parks,
}: {
  coaster: Coaster;
  parks: Park[];
}) {
  const router = useRouter();
  const [name, setName] = useState(coaster.name);
  const [parkId, setParkId] = useState(coaster.parkId);
  const [manufacturer, setManufacturer] = useState(coaster.manufacturer ?? "");
  const [type, setType] = useState<CoasterType | "">(coaster.type ?? "");
  const [openedYear, setOpenedYear] = useState(coaster.openedYear?.toString() ?? "");
  const [status, setStatus] = useState<CoasterStatus | "">(coaster.status ?? "");
  const [heightFeet, setHeightFeet] = useState(coaster.stats?.heightFeet?.toString() ?? "");
  const [dropFeet, setDropFeet] = useState(coaster.stats?.dropFeet?.toString() ?? "");
  const [lengthFeet, setLengthFeet] = useState(coaster.stats?.lengthFeet?.toString() ?? "");
  const [topSpeedMph, setTopSpeedMph] = useState(coaster.stats?.topSpeedMph?.toString() ?? "");
  const [inversions, setInversions] = useState(coaster.stats?.inversions?.toString() ?? "");
  const [durationSeconds, setDurationSeconds] = useState(
    coaster.stats?.durationSeconds?.toString() ?? "",
  );
  const [maxG, setMaxG] = useState(coaster.stats?.maxG?.toString() ?? "");
  const [description, setDescription] = useState(coaster.description ?? "");
  const [writeUp, setWriteUp] = useState(coaster.writeUp ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(coaster.coverImageUrl ?? "");
  const [photos, setPhotos] = useState<Photo[]>(coaster.photos ?? []);
  const [featuredPhotoId, setFeaturedPhotoId] = useState<string | undefined>(
    coaster.featuredPhotoId,
  );
  const [notes, setNotes] = useState(coaster.notes ?? "");
  const [coasterCountId, setCoasterCountId] = useState(
    coaster.externalIds?.coasterCountId?.toString() ?? "",
  );
  const [rcdbId, setRcdbId] = useState(coaster.externalIds?.rcdbId?.toString() ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const descriptionRef = useRef<MarkdownEditorHandle>(null);
  const writeUpRef = useRef<MarkdownEditorHandle>(null);

  async function uploadCover(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload/coaster-image", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? `Upload failed: ${res.status}`);
        return;
      }
      setCoverImageUrl(data.blobUrl);
    } finally {
      setUploading(false);
    }
  }

  async function save(
    nextPhotos: Photo[] = photos,
    nextFeatured: string | undefined = featuredPhotoId,
  ) {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/coasters/${coaster.slug}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        parkId,
        manufacturer: manufacturer || undefined,
        type: type || undefined,
        openedYear: openedYear ? Number(openedYear) : undefined,
        status: status || undefined,
        stats: {
          heightFeet: heightFeet ? Number(heightFeet) : undefined,
          dropFeet: dropFeet ? Number(dropFeet) : undefined,
          lengthFeet: lengthFeet ? Number(lengthFeet) : undefined,
          topSpeedMph: topSpeedMph ? Number(topSpeedMph) : undefined,
          inversions: inversions ? Number(inversions) : undefined,
          durationSeconds: durationSeconds ? Number(durationSeconds) : undefined,
          maxG: maxG ? Number(maxG) : undefined,
        },
        description: description || undefined,
        writeUp: writeUp || undefined,
        coverImageUrl: coverImageUrl || undefined,
        photos: nextPhotos,
        featuredPhotoId:
          nextFeatured && nextPhotos.some((p) => p.id === nextFeatured) ? nextFeatured : undefined,
        notes: notes || undefined,
        externalIds: {
          coasterCountId: coasterCountId ? Number(coasterCountId) : undefined,
          rcdbId: rcdbId ? Number(rcdbId) : undefined,
        },
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? `Save failed: ${res.status}`);
      return;
    }
    router.refresh();
  }

  // Per-photo endpoint returns the newly-appended Photo. The dropzone
  // is set to concurrency=1 so uploads land one-by-one and a mid-batch
  // interruption preserves everything already saved.
  function onPhotoUploaded(r: UploadResult) {
    if (r.duplicate || !r.photo) return;
    const p = r.photo as Photo;
    setPhotos((prev) => (prev.some((x) => x.id === p.id) ? prev : [...prev, p]));
  }
  function chooseFeatured(id: string) {
    const next = featuredPhotoId === id ? undefined : id;
    setFeaturedPhotoId(next);
    save(photos, next);
  }
  function removePhoto(id: string) {
    const next = photos.filter((p) => p.id !== id);
    const nextFeatured = featuredPhotoId === id ? undefined : featuredPhotoId;
    setPhotos(next);
    setFeaturedPhotoId(nextFeatured);
    save(next, nextFeatured);
  }

  async function remove() {
    if (!confirm(`Delete "${name}"?`)) return;
    setBusy(true);
    const res = await fetch(`/api/coasters/${coaster.slug}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) {
      setError(`Delete failed: ${res.status}`);
      return;
    }
    router.push("/admin/coasters");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Edit Coaster</h1>
        <div className="flex gap-2">
          <Link
            href={`/coasters/${coaster.slug}`}
            className="text-xs text-muted hover:text-accent self-center"
          >
            View public ↗
          </Link>
          <button
            onClick={() => save()}
            disabled={busy}
            className="bg-accent text-bg px-3 py-1.5 rounded text-sm disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <Field label="Name">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-surface border border-border rounded px-3 py-2"
        />
      </Field>

      <Field label="Park">
        <select
          value={parkId}
          onChange={(e) => setParkId(e.target.value)}
          className="w-full bg-surface border border-border rounded px-3 py-2"
        >
          {parks.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Manufacturer">
          <input
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            placeholder="Bolliger & Mabillard"
            className="w-full bg-surface border border-border rounded px-3 py-2"
          />
        </Field>
        <Field label="Opened">
          <input
            value={openedYear}
            onChange={(e) => setOpenedYear(e.target.value)}
            placeholder="2003"
            className="w-full bg-surface border border-border rounded px-3 py-2"
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Type">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as CoasterType)}
            className="w-full bg-surface border border-border rounded px-3 py-2"
          >
            <option value="">—</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as CoasterStatus)}
            className="w-full bg-surface border border-border rounded px-3 py-2"
          >
            <option value="">—</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Stats">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatField label="Height (ft)" value={heightFeet} onChange={setHeightFeet} />
          <StatField label="Drop (ft)" value={dropFeet} onChange={setDropFeet} />
          <StatField label="Length (ft)" value={lengthFeet} onChange={setLengthFeet} />
          <StatField label="Top speed (mph)" value={topSpeedMph} onChange={setTopSpeedMph} />
          <StatField label="Inversions" value={inversions} onChange={setInversions} />
          <StatField label="Duration (s)" value={durationSeconds} onChange={setDurationSeconds} />
          <StatField label="Max G" value={maxG} onChange={setMaxG} />
        </div>
      </Field>

      <Field label="External IDs">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">coaster-count.com ID</label>
            <input
              value={coasterCountId}
              onChange={(e) => setCoasterCountId(e.target.value)}
              className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">RCDB ID</label>
            <input
              value={rcdbId}
              onChange={(e) => setRcdbId(e.target.value)}
              className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm"
            />
          </div>
        </div>
      </Field>

      <Field label="Description (public, markdown)">
        <MarkdownEditor ref={descriptionRef} value={description} onChange={setDescription} />
      </Field>

      <Field label="Write-up (personal voice, public, markdown)">
        <MarkdownEditor ref={writeUpRef} value={writeUp} onChange={setWriteUp} />
      </Field>

      <section className="space-y-2">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h2 className="font-display text-xl">Photos</h2>
          {photos.length > 1 && (
            <button
              type="button"
              onClick={() => {
                const sortKey = (p: Photo) => p.filename ?? p.uploadedAt ?? "";
                const next = [...photos].sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
                setPhotos(next);
                save(next, featuredPhotoId);
              }}
              className="text-xs border border-border hover:border-accent hover:text-accent rounded px-2 py-1"
              title="Sort by filename ascending (oldest camera photos first)"
            >
              Sort by filename ↑
            </button>
          )}
        </div>
        <UploadDropzone
          endpoint={`/api/coasters/${coaster.slug}/photos`}
          multiple
          concurrency={1}
          onUploaded={onPhotoUploaded}
          label="Upload photos (multi-select + drag supported)"
        />
        <p className="text-xs text-muted">
          Each photo is saved to the coaster as soon as it uploads — safe to close the tab mid-batch.
          Duplicate files (same content) are skipped automatically.
        </p>
        {photos.length > 0 && (
          <>
            <p className="text-xs text-muted">
              Click ★ to feature a photo as the hero image. Drag ⋮⋮ to reorder. Click ↳ Insert to embed at the cursor in the description or write-up.
            </p>
            <SortablePhotos
              photos={photos}
              featuredId={featuredPhotoId}
              onReorder={(next) => {
                setPhotos(next);
                save(next, featuredPhotoId);
              }}
              onSelectFeatured={chooseFeatured}
              onRemove={removePhoto}
              onInsert={(p) => {
                // Prefer inserting into whichever body is currently non-empty;
                // fall back to the description (main body). Both refs are wired.
                const target = writeUp.trim() && !description.trim() ? writeUpRef : descriptionRef;
                target.current?.insertImage(p.blobUrl);
              }}
            />
          </>
        )}
      </section>

      <Field label="Cover image URL (optional — leave blank to use the featured photo)">
        {coverImageUrl && (
          <img
            src={coverImageUrl}
            alt=""
            className="w-full max-w-md rounded border border-border mb-2"
          />
        )}
        <div className="flex gap-2 items-center">
          <input
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="Paste a URL, or upload below"
            className="flex-1 bg-surface border border-border rounded px-3 py-2 text-sm"
          />
          <label className="border border-accent text-accent px-3 py-2 rounded text-sm cursor-pointer hover:bg-accent hover:text-bg transition">
            {uploading ? "Uploading…" : "Upload"}
            <input
              type="file"
              accept="image/*"
              hidden
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadCover(f);
                e.target.value = "";
              }}
            />
          </label>
          {coverImageUrl && (
            <button
              type="button"
              onClick={() => setCoverImageUrl("")}
              className="text-xs text-muted hover:text-red-400"
            >
              Clear
            </button>
          )}
        </div>
      </Field>

      <Field label="Notes (private)">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full bg-surface border border-border rounded px-3 py-2 text-xs"
        />
      </Field>

      <div className="border-t border-border pt-4 flex justify-between">
        <button
          onClick={remove}
          disabled={busy}
          className="text-xs text-red-400 hover:underline"
        >
          Delete coaster
        </button>
        <button
          onClick={() => save()}
          disabled={busy}
          className="bg-accent text-bg px-3 py-1.5 rounded text-sm disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-muted mb-1">{label}</label>
      {children}
    </div>
  );
}

function StatField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm"
      />
    </div>
  );
}
