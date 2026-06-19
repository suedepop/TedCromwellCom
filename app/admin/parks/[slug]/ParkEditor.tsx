"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Park } from "@/lib/types";

const VenueLocationPicker = dynamic(
  () => import("@/components/venues/VenueLocationPicker"),
  {
    ssr: false,
    loading: () => <div className="h-[300px] bg-surface border border-border rounded" />,
  },
);

export default function ParkEditor({ park }: { park: Park }) {
  const router = useRouter();
  const [name, setName] = useState(park.name);
  const [city, setCity] = useState(park.city ?? "");
  const [state, setState] = useState(park.state ?? "");
  const [country, setCountry] = useState(park.country);
  const [lat, setLat] = useState(park.lat?.toString() ?? "");
  const [lng, setLng] = useState(park.lng?.toString() ?? "");
  const [aliases, setAliases] = useState((park.aliases ?? []).join("\n"));
  const [url, setUrl] = useState(park.url ?? "");
  const [description, setDescription] = useState(park.description ?? "");
  const [imageUrl, setImageUrl] = useState(park.imageUrl ?? "");
  const [notes, setNotes] = useState(park.notes ?? "");
  const [closed, setClosed] = useState(Boolean(park.closed));
  const [closedYear, setClosedYear] = useState(park.closedYear?.toString() ?? "");
  const [coasterCountId, setCoasterCountId] = useState(
    park.externalIds?.coasterCountId?.toString() ?? "",
  );
  const [rcdbId, setRcdbId] = useState(park.externalIds?.rcdbId?.toString() ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enriching, setEnriching] = useState(false);
  const [enrichMsg, setEnrichMsg] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/parks/${park.slug}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        country,
        city: city || undefined,
        state: state || undefined,
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined,
        aliases: aliases
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        url: url || undefined,
        description: description || undefined,
        imageUrl: imageUrl || undefined,
        notes: notes || undefined,
        closed,
        closedYear: closedYear ? Number(closedYear) : undefined,
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

  async function enrichFromRcdb() {
    if (!rcdbId.trim()) {
      setEnrichMsg("Enter an RCDB id first.");
      return;
    }
    setEnriching(true);
    setEnrichMsg(null);
    try {
      const res = await fetch(`/api/parks/${park.slug}/enrich-rcdb`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rcdbId: Number(rcdbId) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEnrichMsg(data.error ?? `Enrich failed: ${res.status}`);
        return;
      }
      const d = (data.details ?? {}) as Record<string, string | number | undefined>;
      let applied = 0;
      if (d.name && !name.trim()) {
        setName(String(d.name));
        applied++;
      }
      if (d.city && !city.trim()) {
        setCity(String(d.city));
        applied++;
      }
      if (d.state && !state.trim()) {
        setState(String(d.state));
        applied++;
      }
      if (d.country && !country.trim()) {
        setCountry(String(d.country));
        applied++;
      }
      if (typeof d.lat === "number" && !lat.trim()) {
        setLat(String(d.lat));
        applied++;
      }
      if (typeof d.lng === "number" && !lng.trim()) {
        setLng(String(d.lng));
        applied++;
      }
      setEnrichMsg(
        `RCDB returned ${Object.keys(d).length} fields; filled ${applied} empty form fields. Review and Save.`,
      );
    } catch (err) {
      setEnrichMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setEnriching(false);
    }
  }

  async function remove() {
    if (!confirm(`Delete "${name}"? This does NOT delete its coasters.`)) return;
    setBusy(true);
    const res = await fetch(`/api/parks/${park.slug}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) {
      setError(`Delete failed: ${res.status}`);
      return;
    }
    router.push("/admin/parks");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Edit Park</h1>
        <div className="flex gap-2">
          <Link
            href={`/parks/${park.slug}`}
            className="text-xs text-muted hover:text-accent self-center"
          >
            View public ↗
          </Link>
          <button
            onClick={save}
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

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="City">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-surface border border-border rounded px-3 py-2"
          />
        </Field>
        <Field label="State/Region">
          <input
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full bg-surface border border-border rounded px-3 py-2"
          />
        </Field>
        <Field label="Country">
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-surface border border-border rounded px-3 py-2"
          />
        </Field>
      </div>

      <Field label="Location (click the map to set, or type below)">
        <VenueLocationPicker
          lat={lat ? Number(lat) : null}
          lng={lng ? Number(lng) : null}
          onChange={(la, lo) => {
            setLat(String(la));
            setLng(String(lo));
          }}
        />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <input
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="Latitude"
            className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm"
          />
          <input
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="Longitude"
            className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm"
          />
        </div>
      </Field>

      <Field label="External IDs">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">coaster-count.com ID</label>
            <input
              value={coasterCountId}
              onChange={(e) => setCoasterCountId(e.target.value)}
              placeholder="(numeric)"
              className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">RCDB ID</label>
            <div className="flex gap-2">
              <input
                value={rcdbId}
                onChange={(e) => setRcdbId(e.target.value)}
                placeholder="(numeric)"
                className="flex-1 bg-surface border border-border rounded px-2 py-1.5 text-sm"
              />
              <button
                onClick={enrichFromRcdb}
                disabled={enriching || !rcdbId.trim()}
                type="button"
                className="border border-accent text-accent px-2 py-1 rounded text-xs disabled:opacity-50"
              >
                {enriching ? "Fetching…" : "Enrich from RCDB"}
              </button>
            </div>
          </div>
        </div>
        {enrichMsg && <p className="text-xs text-muted mt-2">{enrichMsg}</p>}
      </Field>

      <Field label="Aliases (one per line)">
        <textarea
          value={aliases}
          onChange={(e) => setAliases(e.target.value)}
          rows={3}
          className="w-full bg-surface border border-border rounded px-3 py-2 font-mono text-xs"
        />
      </Field>

      <Field label="Website URL">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full bg-surface border border-border rounded px-3 py-2"
        />
      </Field>

      <Field label="Description (public, markdown)">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="w-full bg-surface border border-border rounded px-3 py-2"
        />
      </Field>

      <Field label="Image URL">
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full bg-surface border border-border rounded px-3 py-2"
        />
      </Field>

      <Field label="Notes (private)">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full bg-surface border border-border rounded px-3 py-2 text-xs"
        />
      </Field>

      <Field label="Status">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={closed} onChange={(e) => setClosed(e.target.checked)} />
          Park has permanently closed
        </label>
        {closed && (
          <input
            value={closedYear}
            onChange={(e) => setClosedYear(e.target.value)}
            placeholder="Closed year"
            className="mt-2 w-32 bg-surface border border-border rounded px-2 py-1.5 text-sm"
          />
        )}
      </Field>

      <div className="border-t border-border pt-4 flex justify-between">
        <button
          onClick={remove}
          disabled={busy}
          className="text-xs text-red-400 hover:underline"
        >
          Delete park
        </button>
        <button
          onClick={save}
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
