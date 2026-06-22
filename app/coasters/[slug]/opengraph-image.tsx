import { ImageResponse } from "next/og";
import { getCoaster } from "@/lib/coasters";
import { getPark } from "@/lib/parks";
import { SITE_NAME } from "@/lib/metadata";

export const runtime = "nodejs";
export const alt = "Coaster preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0a0a0a";
const SURFACE = "#1a1a1a";
const ACCENT = "#e8a030";
const INK = "#f5f5f0";
const MUTED = "#9b958a";

export default async function CoasterOG({ params }: { params: { slug: string } }) {
  const coaster = await getCoaster(params.slug).catch(() => null);
  const park = coaster ? await getPark(coaster.parkId).catch(() => null) : null;

  const name = coaster?.name ?? "Coaster";
  const parkName = park?.name ?? "";
  const where = park
    ? [park.city, park.state, park.country].filter(Boolean).join(", ")
    : "";
  const factsLine = [
    coaster?.manufacturer,
    coaster?.openedYear ? String(coaster.openedYear) : null,
    coaster?.stats?.heightFeet ? `${coaster.stats.heightFeet} ft` : null,
    coaster?.stats?.topSpeedMph ? `${coaster.stats.topSpeedMph} mph` : null,
    typeof coaster?.stats?.inversions === "number" ? `${coaster.stats.inversions} inv` : null,
  ]
    .filter(Boolean)
    .join("  ·  ");

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
            COASTER
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
          {parkName && (
            <div style={{ fontSize: 38, color: INK, marginTop: 24, fontFamily: "sans-serif" }}>
              {parkName}
            </div>
          )}
          {where && (
            <div style={{ fontSize: 26, color: MUTED, marginTop: 6, fontFamily: "sans-serif" }}>
              {where}
            </div>
          )}
        </div>

        {factsLine && (
          <div
            style={{
              fontSize: 22,
              color: ACCENT,
              fontFamily: "sans-serif",
              letterSpacing: 1,
            }}
          >
            {factsLine}
          </div>
        )}
      </div>
    ),
    {
      ...size,
    },
  );
}
