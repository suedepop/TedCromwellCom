import Link from "next/link";
import { listPosts } from "@/lib/blog";
import { listConcerts } from "@/lib/concerts";
import { listTravelEntries } from "@/lib/travel";
import { listVenues } from "@/lib/venues";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Content Update Dashboard — Experiments",
  description: "Frequency of content updates across blog, concerts, travel, and venues.",
  path: "/experiments/dashboard",
});
export const dynamic = "force-dynamic";

const COLOR_BLOG = "#e8a030";
const COLOR_CONCERT = "#60a5fa";
const COLOR_TRAVEL = "#34d399";
const COLOR_VENUE = "#c084fc";

type RangeKey = "60d" | "180d" | "1y" | "2y";

interface RangeSpec {
  key: RangeKey;
  label: string;
  granularity: "day" | "week" | "month";
  days?: number;
  weeks?: number;
  months?: number;
}

const RANGES: RangeSpec[] = [
  { key: "60d", label: "60 days", granularity: "day", days: 60 },
  { key: "180d", label: "6 months", granularity: "week", weeks: 26 },
  { key: "1y", label: "1 year", granularity: "month", months: 12 },
  { key: "2y", label: "2 years", granularity: "month", months: 24 },
];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function dayKey(iso?: string): string | null {
  if (!iso) return null;
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

function weekKey(iso?: string): string | null {
  // ISO week starting Monday — use the Monday's date as the bucket key.
  if (!iso) return null;
  const date = new Date(iso);
  if (isNaN(date.getTime())) return null;
  const day = (date.getUTCDay() + 6) % 7; // 0 = Mon, 6 = Sun
  const monday = new Date(date);
  monday.setUTCDate(date.getUTCDate() - day);
  return `${monday.getUTCFullYear()}-${pad(monday.getUTCMonth() + 1)}-${pad(monday.getUTCDate())}`;
}

function monthKey(iso?: string): string | null {
  if (!iso) return null;
  const m = iso.match(/^(\d{4})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}` : null;
}

function buildBucketKeys(spec: RangeSpec): string[] {
  const today = new Date();
  const out: string[] = [];
  if (spec.granularity === "day") {
    for (let i = (spec.days ?? 60) - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      out.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
    }
  } else if (spec.granularity === "week") {
    const dayOfWeek = (today.getDay() + 6) % 7;
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() - dayOfWeek);
    for (let i = (spec.weeks ?? 26) - 1; i >= 0; i--) {
      const d = new Date(thisMonday);
      d.setDate(thisMonday.getDate() - i * 7);
      out.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
    }
  } else {
    for (let i = (spec.months ?? 24) - 1; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      out.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}`);
    }
  }
  return out;
}

function bucketLabel(key: string, granularity: RangeSpec["granularity"]): string {
  if (granularity === "month") {
    const [y, m] = key.split("-");
    return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString(undefined, {
      month: "short",
      year: "2-digit",
    });
  }
  const [y, m, d] = key.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function keyOf(iso: string | undefined, granularity: RangeSpec["granularity"]): string | null {
  if (granularity === "month") return monthKey(iso);
  if (granularity === "week") return weekKey(iso);
  return dayKey(iso);
}

interface Bucket {
  key: string;
  blog: number;
  concert: number;
  travel: number;
  venue: number;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { range?: string };
}) {
  const spec =
    RANGES.find((r) => r.key === (searchParams.range as RangeKey)) ?? RANGES[0];

  const [posts, concerts, travel, venues] = await Promise.all([
    listPosts("published").catch(() => []),
    listConcerts().catch(() => []),
    listTravelEntries().catch(() => []),
    listVenues().catch(() => []),
  ]);

  const keys = buildBucketKeys(spec);
  const buckets: Record<string, Bucket> = {};
  for (const k of keys) buckets[k] = { key: k, blog: 0, concert: 0, travel: 0, venue: 0 };

  for (const p of posts) {
    const k = keyOf(p.updatedAt ?? p.publishedAt, spec.granularity);
    if (k && buckets[k]) buckets[k].blog += 1;
  }
  for (const c of concerts) {
    const k = keyOf(c.updatedAt ?? c.date, spec.granularity);
    if (k && buckets[k]) buckets[k].concert += 1;
  }
  for (const t of travel) {
    const k = keyOf(t.updatedAt ?? t.startDate, spec.granularity);
    if (k && buckets[k]) buckets[k].travel += 1;
  }
  // Venues don't currently track an updatedAt in our schema; use _ts when present
  // so backfilled venues show up. Otherwise they're omitted from the time series.
  for (const v of venues) {
    const ts = (v as unknown as { _ts?: number })._ts;
    if (typeof ts === "number") {
      const iso = new Date(ts * 1000).toISOString();
      const k = keyOf(iso, spec.granularity);
      if (k && buckets[k]) buckets[k].venue += 1;
    }
  }

  const series = keys.map((k) => buckets[k]);
  const maxTotal = Math.max(
    1,
    ...series.map((b) => b.blog + b.concert + b.travel + b.venue),
  );

  // Totals (visible window only)
  const inWindow = series.reduce(
    (acc, b) => {
      acc.blog += b.blog;
      acc.concert += b.concert;
      acc.travel += b.travel;
      acc.venue += b.venue;
      return acc;
    },
    { blog: 0, concert: 0, travel: 0, venue: 0 },
  );
  const grandInWindow = inWindow.blog + inWindow.concert + inWindow.travel + inWindow.venue;

  // Most-active bucket within the visible window
  const mostActive = series.reduce<Bucket | null>((best, b) => {
    const t = b.blog + b.concert + b.travel + b.venue;
    if (!best) return t > 0 ? b : null;
    const bt = best.blog + best.concert + best.travel + best.venue;
    return t > bt ? b : best;
  }, null);

  const barWidth = spec.granularity === "day" ? 14 : spec.granularity === "week" ? 22 : 28;

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <Link href="/experiments" className="text-xs text-muted hover:text-accent">
          ← Experiments
        </Link>
        <h1 className="font-display text-4xl">Content Update Dashboard</h1>
        <p className="text-muted">
          When am I actually adding to or editing the site? Each item is counted once in the bucket
          of its most recent update.
        </p>
      </header>

      <nav className="flex gap-2 text-xs">
        {RANGES.map((r) => (
          <Link
            key={r.key}
            href={`/experiments/dashboard?range=${r.key}`}
            className={`border px-3 py-1.5 rounded ${
              spec.key === r.key
                ? "border-accent text-accent"
                : "border-border text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {r.label}
          </Link>
        ))}
      </nav>

      <dl className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Stat label={`Updates · last ${spec.label}`} value={grandInWindow.toLocaleString()} />
        <Stat label="Blog" value={inWindow.blog.toLocaleString()} swatch={COLOR_BLOG} />
        <Stat label="Concerts" value={inWindow.concert.toLocaleString()} swatch={COLOR_CONCERT} />
        <Stat label="Travel" value={inWindow.travel.toLocaleString()} swatch={COLOR_TRAVEL} />
        <Stat label="Venues" value={inWindow.venue.toLocaleString()} swatch={COLOR_VENUE} />
      </dl>

      <section className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-display text-2xl">Updates per {spec.granularity}</h2>
          <Legend />
        </div>
        <div className="border border-border bg-surface rounded p-4 overflow-x-auto">
          <div className="flex items-stretch gap-1 h-48 min-w-max">
            {series.map((b) => {
              const total = b.blog + b.concert + b.travel + b.venue;
              const heightPct = (total / maxTotal) * 100;
              return (
                <div
                  key={b.key}
                  className="flex flex-col items-center justify-end gap-1 h-full"
                  style={{ width: barWidth }}
                >
                  <div className="text-[10px] text-muted h-3" title={`${total} items`}>
                    {total > 0 && total >= maxTotal * 0.4 ? total : ""}
                  </div>
                  <div
                    className="flex flex-col-reverse rounded overflow-hidden bg-bg"
                    style={{
                      width: Math.max(4, barWidth - 6),
                      height: `${Math.max(heightPct, total > 0 ? 2 : 0)}%`,
                      minHeight: total > 0 ? 4 : 0,
                    }}
                    title={`${bucketLabel(b.key, spec.granularity)} — Blog ${b.blog} · Concerts ${b.concert} · Travel ${b.travel} · Venues ${b.venue}`}
                  >
                    {b.blog > 0 && <div style={{ flex: b.blog, backgroundColor: COLOR_BLOG }} />}
                    {b.concert > 0 && (
                      <div style={{ flex: b.concert, backgroundColor: COLOR_CONCERT }} />
                    )}
                    {b.travel > 0 && (
                      <div style={{ flex: b.travel, backgroundColor: COLOR_TRAVEL }} />
                    )}
                    {b.venue > 0 && <div style={{ flex: b.venue, backgroundColor: COLOR_VENUE }} />}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-1 mt-2 min-w-max">
            {series.map((b, i) => {
              const labelEvery =
                spec.granularity === "day" ? 7 : spec.granularity === "week" ? 4 : 3;
              return (
                <div
                  key={b.key}
                  className="text-[10px] text-muted text-center"
                  style={{ width: barWidth }}
                >
                  {i % labelEvery === 0 ? bucketLabel(b.key, spec.granularity) : ""}
                </div>
              );
            })}
          </div>
        </div>
        {mostActive && (
          <p className="text-sm text-muted">
            Busiest in window: <strong className="text-ink">{bucketLabel(mostActive.key, spec.granularity)}</strong>
            {" "}with{" "}
            {mostActive.blog + mostActive.concert + mostActive.travel + mostActive.venue}
            {" "}items ({mostActive.blog} blog, {mostActive.concert} concerts, {mostActive.travel} travel, {mostActive.venue} venues).
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl">Raw counts</h2>
        <div className="overflow-x-auto border border-border rounded">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted bg-surface">
              <tr>
                <th className="px-3 py-2">{spec.granularity === "month" ? "Month" : spec.granularity === "week" ? "Week of" : "Date"}</th>
                <th className="px-3 py-2 text-right">Blog</th>
                <th className="px-3 py-2 text-right">Concerts</th>
                <th className="px-3 py-2 text-right">Travel</th>
                <th className="px-3 py-2 text-right">Venues</th>
                <th className="px-3 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {[...series].reverse().map((b) => {
                const total = b.blog + b.concert + b.travel + b.venue;
                if (total === 0) return null;
                return (
                  <tr key={b.key} className="border-t border-border">
                    <td className="px-3 py-1.5">{bucketLabel(b.key, spec.granularity)}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums">{b.blog || ""}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums">{b.concert || ""}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums">{b.travel || ""}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums">{b.venue || ""}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums font-medium">{total}</td>
                  </tr>
                );
              })}
              {grandInWindow === 0 && (
                <tr className="border-t border-border">
                  <td colSpan={6} className="px-3 py-4 text-center text-muted text-xs">
                    No activity in this window.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-xs text-muted">
        Each item is counted once on the bucket of its <code>updatedAt</code> (or fallback date if
        none). Multiple edits to the same item don&apos;t register as separate events — there&apos;s
        no audit trail in Cosmos. Venues use Cosmos&apos;s server-side <code>_ts</code> when an
        explicit update timestamp isn&apos;t stored.
      </p>
    </section>
  );
}

function Stat({ label, value, swatch }: { label: string; value: string; swatch?: string }) {
  return (
    <div className="border border-border rounded p-3 bg-surface">
      <dt className="text-xs uppercase tracking-wider text-muted flex items-center gap-2">
        {swatch && <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: swatch }} />}
        {label}
      </dt>
      <dd className="font-display text-2xl mt-1">{value}</dd>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex gap-3 text-xs flex-wrap">
      <Swatch color={COLOR_BLOG} label="Blog" />
      <Swatch color={COLOR_CONCERT} label="Concerts" />
      <Swatch color={COLOR_TRAVEL} label="Travel" />
      <Swatch color={COLOR_VENUE} label="Venues" />
    </div>
  );
}

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
      <span className="text-muted">{label}</span>
    </span>
  );
}
