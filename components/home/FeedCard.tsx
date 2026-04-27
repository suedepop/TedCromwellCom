import PostCard from "@/components/blog/PostCard";
import ConcertCard from "@/components/concerts/ConcertCard";
import TravelCard from "@/components/travel/TravelCard";
import type { FeedItem } from "@/lib/feed";

const LABEL: Record<FeedItem["type"], string> = {
  blog: "Blog",
  concert: "Concert",
  travel: "Travel",
};

export default function FeedCard({ item }: { item: FeedItem }) {
  return (
    <div className="relative">
      <span className="absolute top-2 left-2 z-10 text-[10px] uppercase tracking-wider font-medium bg-bg/85 text-accent border border-accent/40 rounded px-2 py-0.5 backdrop-blur-sm">
        {LABEL[item.type]}
      </span>
      {item.type === "blog" && <PostCard post={item.data} />}
      {item.type === "concert" && <ConcertCard concert={item.data} />}
      {item.type === "travel" && <TravelCard entry={item.data} />}
    </div>
  );
}
