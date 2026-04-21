import type { Metadata } from "next";
import dynamicImport from "next/dynamic";
import TravelInfiniteList from "./TravelInfiniteList";
import { listTravelEntries } from "@/lib/travel";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Travel — Ted Cromwell" };

const TravelMap = dynamicImport(() => import("@/components/travel/TravelMap"), {
  ssr: false,
  loading: () => <div className="h-[420px] bg-surface border border-border rounded" />,
});

const PAGE_SIZE = 12;

export default async function TravelPage() {
  const entries = await listTravelEntries();
  const countries = new Set(entries.map((e) => e.country));
  const initial = entries.slice(0, PAGE_SIZE);

  return (
    <section className="space-y-8">
      <header>
        <h1 className="font-display text-4xl">Travel</h1>
        <p className="text-muted mt-2">
          {entries.length} entries · {countries.size} countries.
        </p>
      </header>
      <TravelMap entries={entries} />
      {entries.length === 0 ? (
        <p className="text-muted">No travel entries yet.</p>
      ) : (
        <TravelInfiniteList initialItems={initial} total={entries.length} pageSize={PAGE_SIZE} />
      )}
    </section>
  );
}
