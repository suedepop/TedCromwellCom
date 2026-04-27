import PostCard from "@/components/blog/PostCard";
import { listPosts } from "@/lib/blog";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Blog",
  description: "Essays, notes, and writing.",
  path: "/blog",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogIndex() {
  const posts = await listPosts("published");
  return (
    <section className="space-y-8">
      <header>
        <h1 className="font-display text-4xl">Blog</h1>
        <p className="text-muted mt-2">Notes, essays, and long-form writing.</p>
      </header>
      {posts.length === 0 ? (
        <p className="text-muted">No posts yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </section>
  );
}
