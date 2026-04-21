"use client";
import TravelCard from "@/components/travel/TravelCard";
import LoadMoreGrid from "@/components/ui/LoadMoreGrid";
import type { TravelEntry } from "@/lib/types";

interface Props {
  initialItems: TravelEntry[];
  total: number;
  pageSize: number;
}

export default function TravelInfiniteList({ initialItems, total, pageSize }: Props) {
  return (
    <LoadMoreGrid<TravelEntry>
      initialItems={initialItems}
      total={total}
      pageSize={pageSize}
      fetchUrl="/api/travel"
      keyOf={(e) => e.id}
      gridClass="grid sm:grid-cols-2 md:grid-cols-3 gap-4"
      renderItem={(e) => <TravelCard entry={e} />}
    />
  );
}
