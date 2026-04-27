"use client";
import FeedCard from "@/components/home/FeedCard";
import LoadMoreGrid from "@/components/ui/LoadMoreGrid";
import type { FeedItem } from "@/lib/feed";

interface Props {
  initialItems: FeedItem[];
  total: number;
  pageSize: number;
}

export default function HomeFeed({ initialItems, total, pageSize }: Props) {
  return (
    <LoadMoreGrid<FeedItem>
      initialItems={initialItems}
      total={total}
      pageSize={pageSize}
      fetchUrl="/api/feed"
      keyOf={(i) => i.key}
      gridClass="grid sm:grid-cols-2 md:grid-cols-3 gap-4"
      renderItem={(i) => <FeedCard item={i} />}
    />
  );
}
