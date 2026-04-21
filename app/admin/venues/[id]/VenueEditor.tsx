"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Venue } from "@/lib/types";

const VenueLocationPicker = dynamic(() => import("@/components/venues/VenueLocationPicker"), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-surface border border-border rounded" />,
});

const VENUE_TYPES: Venue["venueType"][] = [
  undefined,
  "club",
  "theater",
  "arena",
  "stadium",
  "amphitheater",
  "festival",
  "bar",
  "other",
];

export default function VenueEditor({ venue, others }: { venue: Venue; others: Venue[] }) {
  const router = useRouter();
  const [canonicalName, setCanonicalName] = useState(venue.canonicalName);
  const [city, setCity] = useState(venue.city);
  const [state, setState] = useState(venue.state ?? "");
  const [country, setCountry] = useState(venue.country);
  const [lat, setLat] = useState(venue.lat?.toString() ?? "");
  const [lng, setLng] = useState(venue.lng?.toString() ?? "");
  const [aliases, setAliases] = useState(venue.aliases.join("\n"));
  const [url, setUrl] = useState(venue.url ?? "");
  const [notes, setNotes] = useState(venue.notes ?? "");
  const [description, setDescription] = useState(venue.description ?? "");
  const [venueType, setVenueType] = useState<Venue["venueType"]>(venue.venueType);
  const [capacity, setCapacity] = useState(venue.capacity?.toString() ?? "");
  const [openedYear, setOpenedYear] = useState(venue.openedYear?.toString() ?? "");
  const [closedYear, setClosedYear] = useState(venue.closedYear?.toString() ?? "");
  const [wikipediaUrl, setWikipediaUrl] = useState(venue.wikipediaUrl ?? "");
  const [mergeId, setMergeId] = useState("");
  const [busy, setBusy] = useState(false);
  const [researching, setResearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [researchMsg, setResearchMsg] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/venues/${venue.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        canonicalName,
        city,
        state: state || undefined,
        country,
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined,
        aliases: aliases.split("\n").map((s) => s.trim()).filter(Boolean),
        url: url || undefined,
        notes: notes || undefined,
        description: description || undefined,
        venueType: venueType || undefined,
        capacity: capacity ? Number(capacity) : undefined,
        openedYear: openedYear ? Number(openedYear) : undefined,
        closedYear: closedYear ? Number(closedYear) : undefined,
        wikipediaUrl: wikipediaUrl || undefined,
      }),
    });
    setBusy(false);
    if (!res.ok) return setError(`Save failed: ${res.status}`);
    router.refresh();
  }

  async function research() {
    setResearching(true);
    setResearchMsg(null);
    try {
      const qs = wikipediaUrl.trim() ? `?url=${encodeURIComponent(wikipediaUrl.trim())}` : "";
      const res = await fetch(`/api/venues/${venue.id}/research${qs}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setResearchMsg(data.error ?? "No result");
        return;
      }
      if (data.extract) setDescription(data.extract);
      if (data.url) setWikipediaUrl(data.url);
      setResearchMsg(`Found: ${data.title} — review and edit the description, then Save.`);
    } finally {
      setResearching(false);
    }
  }

  async function doMerge() {
    if (!mergeId) return;
    if (!confirm(`Merge selected venue INTO "${canonicalName}"? This moves all its concerts here and deletes the other venue.`)) return;
    setBusy(true);
    const res = await fetch(`/api/venues/merge`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ keepId: venue.id, mergeId }),
    });
    setBusy(false);
    if (!res.ok) return setError(`Merge failed: ${res.status}`);
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Edit Venue</h1>
        <button onClick={save} disabled={busy} className="bg-accent text-bg px-3 py-1.5 rounded text-sm disabled:opacity-50">
          Save
        </button>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <Field label="Canonical name">
        <input value={canonicalName} onChange={(e) => setCanonicalName(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2" />
      </Field>
      <div className="grid grid-cols-3 gap-4">
        <Field label="City">
          <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2" />
        </Field>
        <Field label="State">
          <input value={state} onChange={(e) => setState(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2" />
        </Field>
        <Field label="Country">
          <input value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2" />
        </Field>
      </div>

      <section className="border border-border rounded p-4 bg-surface space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg">About the venue</h2>
          <button
            onClick={research}
            disabled={researching}
            className="border border-border px-3 py-1 rounded text-xs hover:border-accent disabled:opacity-50"
            type="button"
          >
            {researching ? "Searching Wikipedia…" : "Fetch from Wikipedia"}
          </button>
        </div>
        {researchMsg && <p className="text-xs text-accent">{researchMsg}</p>}
        <Field label="Description (shown on the public venue page — markdown)">
          <textarea rows={8} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-bg border border-border rounded px-3 py-2 text-sm" />
        </Field>
        <div className="grid grid-cols-4 gap-3">
          <Field label="Type">
            <select value={venueType ?? ""} onChange={(e) => setVenueType((e.target.value || undefined) as Venue["venueType"])} className="w-full bg-bg border border-border rounded px-2 py-2 text-sm">
              {VENUE_TYPES.map((t) => (
                <option key={t ?? "none"} value={t ?? ""}>
                  {t ?? "—"}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Capacity">
            <input value={capacity} onChange={(e) => setCapacity(e.target.value)} className="w-full bg-bg border border-border rounded px-2 py-2 text-sm font-mono" placeholder="e.g. 1200" />
          </Field>
          <Field label="Opened year">
            <input value={openedYear} onChange={(e) => setOpenedYear(e.target.value)} className="w-full bg-bg border border-border rounded px-2 py-2 text-sm font-mono" placeholder="1975" />
          </Field>
          <Field label="Closed year (blank = open)">
            <input value={closedYear} onChange={(e) => setClosedYear(e.target.value)} className="w-full bg-bg border border-border rounded px-2 py-2 text-sm font-mono" placeholder="2019" />
          </Field>
        </div>
        <Field label="Wikipedia URL">
          <input value={wikipediaUrl} onChange={(e) => setWikipediaUrl(e.target.value)} className="w-full bg-bg border border-border rounded px-3 py-2 text-xs font-mono" />
        </Field>
      </section>

      <div className="space-y-2">
        <span className="block text-xs uppercase tracking-wider text-muted">Location</span>
        <p className="text-xs text-muted">Click on the map to place a pin, or drag the existing pin.</p>
        <VenueLocationPicker
          lat={lat ? Number(lat) : null}
          lng={lng ? Number(lng) : null}
          onChange={(newLat, newLng) => {
            setLat(newLat.toFixed(6));
            setLng(newLng.toFixed(6));
          }}
        />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Latitude">
            <input value={lat} onChange={(e) => setLat(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2 font-mono text-sm" />
          </Field>
          <Field label="Longitude">
            <input value={lng} onChange={(e) => setLng(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2 font-mono text-sm" />
          </Field>
        </div>
      </div>
      <Field label="Aliases (one per line)">
        <textarea rows={3} value={aliases} onChange={(e) => setAliases(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2 text-sm" />
      </Field>

      <div className="border border-border rounded p-4 bg-surface space-y-2">
        <h2 className="font-display text-lg">Split alias into its own venue</h2>
        <p className="text-xs text-muted">
          Turn one of the aliases above into a new venue. Any concerts currently on this venue whose raw name matches the alias will move with it.
        </p>
        <div className="flex flex-wrap gap-2">
          {aliases
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
            .filter((a) => a.toLowerCase() !== canonicalName.toLowerCase())
            .map((alias) => (
              <button
                key={alias}
                type="button"
                onClick={async () => {
                  if (!confirm(`Split "${alias}" into its own venue? This removes it from the alias list here and moves any of its concerts.`)) return;
                  setBusy(true);
                  setError(null);
                  const res = await fetch(`/api/venues/${venue.id}/split-alias`, {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ alias }),
                  });
                  const data = await res.json();
                  setBusy(false);
                  if (!res.ok) return setError(`Split failed: ${data.error ?? res.status}`);
                  alert(`Created new venue "${alias}" with ${data.movedConcerts} concert(s) moved.`);
                  router.refresh();
                }}
                disabled={busy}
                className="text-xs border border-border hover:border-accent px-2 py-1 rounded disabled:opacity-50"
              >
                ↗ Split out "{alias}"
              </button>
            ))}
          {aliases
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
            .filter((a) => a.toLowerCase() !== canonicalName.toLowerCase()).length === 0 && (
            <p className="text-xs text-muted">No splittable aliases.</p>
          )}
        </div>
      </div>
      <Field label="Website URL">
        <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2 text-sm" />
      </Field>
      <Field label="Private notes (not shown publicly)">
        <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2 text-sm" />
      </Field>

      <div className="border border-border rounded p-4 bg-surface space-y-3">
        <h2 className="font-display text-lg">Merge another venue into this one</h2>
        <div className="flex gap-2">
          <select value={mergeId} onChange={(e) => setMergeId(e.target.value)} className="flex-1 bg-bg border border-border rounded px-3 py-2 text-sm">
            <option value="">Select a venue to merge…</option>
            {others.map((v) => (
              <option key={v.id} value={v.id}>
                {v.canonicalName} — {v.city}
              </option>
            ))}
          </select>
          <button onClick={doMerge} disabled={!mergeId || busy} className="bg-accent text-bg px-3 rounded text-sm disabled:opacity-50">
            Merge
          </button>
        </div>
        <p className="text-xs text-muted">
          Concerts from the selected venue will move here; its name + aliases will be added to this venue's alias list; the old venue record will be deleted.
        </p>
      </div>
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
