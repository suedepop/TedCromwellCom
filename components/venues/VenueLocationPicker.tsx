"use client";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

interface Props {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
  height?: number;
}

function CenterReporter({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    moveend(e) {
      const c = e.target.getCenter();
      onChange(c.lat, c.lng);
    },
  });
  return null;
}

function ViewController({ lat, lng }: { lat: number | null; lng: number | null }) {
  const map = useMap();
  useEffect(() => {
    if (typeof lat !== "number" || typeof lng !== "number" || isNaN(lat) || isNaN(lng)) return;
    const current = map.getCenter();
    if (Math.abs(current.lat - lat) < 1e-6 && Math.abs(current.lng - lng) < 1e-6) return;
    map.setView([lat, lng], map.getZoom() < 13 ? 14 : map.getZoom());
  }, [lat, lng, map]);
  return null;
}

export default function VenueLocationPicker({ lat, lng, onChange, height = 300 }: Props) {
  const hasPoint = typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng);
  const center: [number, number] = hasPoint ? [lat!, lng!] : [39.5, -98];
  const zoom = hasPoint ? 14 : 3;

  return (
    <div style={{ height }} className="relative rounded overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        style={{ height: "100%", width: "100%", background: "#111" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CenterReporter onChange={onChange} />
        <ViewController lat={lat} lng={lng} />
      </MapContainer>
      {/* Center crosshair pin — absolutely positioned, ignores map panning */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-[500]">
        <div className="relative">
          <div className="w-4 h-4 rounded-full bg-accent border-2 border-bg shadow-lg" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-accent/40" />
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-2 left-2 z-[500] text-[10px] bg-black/70 text-muted px-2 py-1 rounded">
        Drag the map — the pin stays centered
      </div>
    </div>
  );
}
