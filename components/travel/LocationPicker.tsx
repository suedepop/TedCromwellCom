"use client";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { LatLng, LeafletEvent, Map as LeafletMap } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Props {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
  height?: number;
  allowSearch?: boolean;
}

interface SearchHit {
  label: string;
  lat: number;
  lng: number;
}

function CenterReporter({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  const map = useMapEvents({
    moveend: () => {
      const c = map.getCenter();
      onChange(c.lat, c.lng);
    },
  });
  return null;
}

function MapBinder({
  target,
  onReady,
}: {
  target: { lat: number; lng: number } | null;
  onReady: (m: LeafletMap) => void;
}) {
  const map = useMap();
  useEffect(() => {
    onReady(map);
  }, [map, onReady]);
  useEffect(() => {
    if (!target) return;
    if (
      Math.abs(map.getCenter().lat - target.lat) > 1e-6 ||
      Math.abs(map.getCenter().lng - target.lng) > 1e-6
    ) {
      map.setView([target.lat, target.lng], Math.max(map.getZoom(), 10));
    }
  }, [map, target?.lat, target?.lng]);
  return null;
}

export default function LocationPicker({ lat, lng, onChange, height = 320, allowSearch = true }: Props) {
  const initial: [number, number] = lat != null && lng != null ? [lat, lng] : [39.8283, -98.5795];
  const initialZoom = lat != null && lng != null ? 12 : 3;
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [busy, setBusy] = useState(false);
  const mapRef = useRef<LeafletMap | null>(null);

  async function doSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setHits(data.results ?? []);
    } finally {
      setBusy(false);
    }
  }

  function selectHit(h: SearchHit) {
    setHits([]);
    setQ(h.label);
    onChange(h.lat, h.lng);
    mapRef.current?.setView([h.lat, h.lng], 12);
  }

  return (
    <div className="space-y-2">
      {allowSearch && (
        <form onSubmit={doSearch} className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search a place (city, landmark)…"
            className="flex-1 bg-surface border border-border rounded px-3 py-2 text-sm"
          />
          <button disabled={busy} className="bg-accent text-bg px-3 rounded text-sm disabled:opacity-50">
            {busy ? "…" : "Find"}
          </button>
        </form>
      )}
      {hits.length > 0 && (
        <ul className="border border-border rounded bg-surface divide-y divide-border text-sm">
          {hits.map((h, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => selectHit(h)}
                className="w-full text-left px-3 py-2 hover:bg-bg truncate"
                title={h.label}
              >
                {h.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div style={{ height }} className="rounded overflow-hidden border border-border relative">
        <MapContainer
          center={initial}
          zoom={initialZoom}
          scrollWheelZoom
          style={{ height: "100%", width: "100%", background: "#111" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <CenterReporter onChange={onChange} />
          <MapBinder
            target={lat != null && lng != null ? { lat, lng } : null}
            onReady={(m) => (mapRef.current = m)}
          />
        </MapContainer>
        {/* Center marker — tip sits exactly on map center */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full"
          style={{ zIndex: 1000 }}
        >
          <svg width="28" height="40" viewBox="0 0 28 40" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14 0 C6 0 0 6 0 14 C0 24 14 40 14 40 C14 40 28 24 28 14 C28 6 22 0 14 0 Z"
              fill="#e8a030"
              stroke="#0a0a0a"
              strokeWidth="2"
            />
            <circle cx="14" cy="14" r="4" fill="#0a0a0a" />
          </svg>
        </div>
        {/* Precision dot at true center */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent ring-1 ring-black"
          style={{ zIndex: 1000 }}
        />
        <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono bg-black/70 text-ink px-2 py-0.5 rounded">
          {lat != null && lng != null ? `${lat.toFixed(5)}, ${lng.toFixed(5)}` : "Pan to set"}
        </div>
      </div>
    </div>
  );
}
