"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import type { TravelEntry } from "@/lib/types";
import { useEffect, useMemo } from "react";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const amberIcon = L.divIcon({
  className: "",
  html: `<span style="display:block;width:14px;height:14px;border-radius:999px;background:#e8a030;border:2px solid #0a0a0a;box-shadow:0 0 0 2px #e8a030;"></span>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

interface Props {
  entries: TravelEntry[];
  height?: number;
  initialZoom?: number;
}

/** Re-fit the map to the current set of points whenever they change.
 *  Passing bounds as a prop on MapContainer only applies on initial mount and
 *  can conflict with center/zoom; using useMap.fitBounds is unambiguous and
 *  gives us control over padding so markers aren't clipped at the edges. */
function FitToPoints({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length < 2) return;
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10, animate: false });
  }, [map, points]);
  return null;
}

export default function TravelMap({ entries, height = 420, initialZoom }: Props) {
  const valid = entries.filter((e) => typeof e.lat === "number" && typeof e.lng === "number");
  const points = useMemo<[number, number][]>(
    () => valid.map((e) => [e.lat, e.lng] as [number, number]),
    [valid],
  );
  const center: [number, number] = valid[0] ? [valid[0].lat, valid[0].lng] : [20, 0];
  const zoom = initialZoom ?? (valid.length === 1 ? 6 : 2);

  return (
    <div style={{ height }} className="rounded overflow-hidden border border-border">
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
        <FitToPoints points={points} />
        {valid.map((e) => (
          <Marker key={e.id} position={[e.lat, e.lng]} icon={amberIcon}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{e.locationName}</div>
                <div className="text-muted text-xs">
                  {[e.city, e.state, e.country].filter(Boolean).join(", ")}
                </div>
                <div className="text-muted text-xs mt-1">
                  {e.startDate}
                  {e.endDate && e.endDate !== e.startDate ? ` – ${e.endDate}` : ""}
                </div>
                <Link href={`/travel/${e.slug ?? e.id}`} className="text-accent text-xs">
                  Read →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
