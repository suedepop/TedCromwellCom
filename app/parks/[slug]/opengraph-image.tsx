import { ImageResponse } from "next/og";
import { getPark } from "@/lib/parks";
import { listCoasters } from "@/lib/coasters";
import { SITE_NAME } from "@/lib/metadata";

export const runtime = "nodejs";
export const alt = "Park preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0a0a0a";
const SURFACE = "#1a1a1a";
const ACCENT = "#e8a030";
const INK = "#f5f5f0";
const MUTED = "#9b958a";

export default async function ParkOG({ params }: { params: { slug: string } }) {
  const park = await getPark(params.slug).catch(() => null);
  const coasters = park ? await listCoasters({ parkId: park.id }).catch(() => []) : [];

  const name = park?.name ?? "Park";
  const where = park
    ? [park.city, park.state, park.country].filter(Boolean).join(", ")
    : "";
  const summary = `${coasters.length} ${coasters.length === 1 ? "coaster" : "coasters"} ridden`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: BG,
          color: INK,
          padding: "60px 70px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              backgroundColor: SURFACE,
              color: ACCENT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 32,
              letterSpacing: -1,
            }}
          >
            TC
          </div>
          <div style={{ color: MUTED, fontSize: 22, fontFamily: "sans-serif" }}>{SITE_NAME}</div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <div style={{ color: ACCENT, fontSize: 26, fontFamily: "sans-serif", letterSpacing: 4 }}>
            AMUSEMENT PARK
          </div>
          <div
            style={{
              fontSize: name.length > 28 ? 92 : 120,
              fontWeight: 400,
              lineHeight: 1.05,
              marginTop: 10,
            }}
          >
            {name}
          </div>
          {where && (
            <div style={{ fontSize: 38, color: INK, marginTop: 24, fontFamily: "sans-serif" }}>
              {where}
            </div>
          )}
        </div>

        <div
          style={{
            fontSize: 26,
            color: ACCENT,
            fontFamily: "sans-serif",
            letterSpacing: 1,
          }}
        >
          {summary}
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
