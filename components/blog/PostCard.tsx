import Link from "next/link";
import type { BlogPost } from "@/lib/types";

export default function PostCard({ post }: { post: BlogPost }) {
  const date = post.publishedAt ?? post.updatedAt;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="flex flex-col h-full border border-border bg-surface rounded overflow-hidden hover:border-accent transition"
    >
      <div className="aspect-[16/9] bg-black">
        {post.coverImageUrl && (
          <img
            src={post.coverImageUrl}
            alt=""
            className="w-full h-full object-cover opacity-90"
          />
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h2 className="font-display text-xl mb-2">{post.title}</h2>
        <p className="text-muted text-sm mb-3 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center justify-between gap-3 text-xs text-muted mt-auto min-w-0">
          <time dateTime={date} className="whitespace-nowrap shrink-0">
            {new Date(date).toLocaleDateString()}
          </time>
          {post.tags.length > 0 && (
            <div className="flex gap-2 flex-nowrap overflow-hidden whitespace-nowrap min-w-0 justify-end">
              {post.tags.slice(0, 3).map((t) => (
                <span key={t} className="text-accent truncate">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
