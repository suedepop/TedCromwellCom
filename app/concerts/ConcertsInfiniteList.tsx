"use client";
import ConcertCard from "@/components/concerts/ConcertCard";
import LoadMoreGrid from "@/components/ui/LoadMoreGrid";
import type { Concert } from "@/lib/types";

interface Props {
  initialItems: Concert[];
  total: number;
  pageSize: number;
  queryString: string; // e.g. "year=2024&artist=foo"
}

export default function ConcertsInfiniteList({ initialItems, total, pageSize, queryString }: Props) {
  const fetchUrl = `/api/concerts${queryString ? `?${queryString}` : ""}`;
  return (
    <LoadMoreGrid<Concert>
      initialItems={initialItems}
      total={total}
      pageSize={pageSize}
      fetchUrl={fetchUrl}
      keyOf={(c) => c.id}
      gridClass="grid sm:grid-cols-2 md:grid-cols-3 gap-4"
      renderItem={(c) => <ConcertCard concert={c} />}
    />
  );
}
