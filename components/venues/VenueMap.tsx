"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import L from "leaflet";

// Fix default marker icon under bundlers
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Pin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  subtitle?: string;
  href?: string;
}

interface Props {
  pins: Pin[];
  height?: number;
  zoom?: number;
  singleCenter?: boolean;
  /** After bounds auto-fit, zoom in this many extra levels. Ignored when singleCenter. */
  zoomBoost?: number;
}

function ZoomBoost({ levels }: { levels: number }) {
  const map = useMap();
  useEffect(() => {
    if (levels > 0) {
      map.setZoom(map.getZoom() + levels, { animate: false });
    }
  }, [map, levels]);
  return null;
}

export default function VenueMap({ pins, height = 400, singleCenter = false, zoom, zoomBoost = 0 }: Props) {
  const validPins = pins.filter((p) => typeof p.lat === "number" && typeof p.lng === "number");
  const bounds = useMemo<LatLngBoundsExpression | undefined>(() => {
    if (validPins.length < 2) return undefined;
    return validPins.map((p) => [p.lat, p.lng] as [number, number]);
  }, [validPins]);

  const center: [number, number] = validPins[0]
    ? [validPins[0].lat, validPins[0].lng]
    : [20, 0];

  useEffect(() => {
    // placeholder — hook in case we later need imperative actions
  }, []);

  return (
    <div style={{ height }} className="rounded overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={zoom ?? (singleCenter ? 14 : 2)}
        bounds={singleCenter ? undefined : bounds}
        scrollWheelZoom
        style={{ height: "100%", width: "100%", background: "#111" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!singleCenter && zoomBoost > 0 && <ZoomBoost levels={zoomBoost} />}
        {validPins.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{p.name}</div>
                {p.subtitle && <div className="text-muted">{p.subtitle}</div>}
                {p.href && (
                  <Link href={p.href} className="text-accent">
                    Open →
                  </Link>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
