"use client";
import RecordCard from "@/components/vinyl/RecordCard";
import LoadMoreGrid from "@/components/ui/LoadMoreGrid";
import type { VinylRecord } from "@/lib/types";

interface Props {
  initialItems: VinylRecord[];
  total: number;
  pageSize: number;
}

export default function VinylInfiniteList({ initialItems, total, pageSize }: Props) {
  return (
    <LoadMoreGrid<VinylRecord>
      initialItems={initialItems}
      total={total}
      pageSize={pageSize}
      fetchUrl="/api/records?sort=artist"
      keyOf={(r) => r.id}
      gridClass="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      renderItem={(r) => <RecordCard record={r} />}
    />
  );
}
