import Link from "next/link";
import { listPosts } from "@/lib/blog";
import FacebookPostedIcon from "@/components/admin/FacebookPostedIcon";

export const dynamic = "force-dynamic";

export default async function AdminBlogList() {
  const posts = await listPosts();
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Blog Posts</h1>
        <Link href="/admin/blog/new" className="bg-accent text-bg px-3 py-1.5 rounded text-sm">
          New Post
        </Link>
      </div>
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-wider text-muted border-b border-border">
          <tr>
            <th className="py-2">Title</th>
            <th className="py-2 w-24">Status</th>
            <th className="py-2 w-32">Updated</th>
            <th className="py-2 w-8"></th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.id} className="border-b border-border/50">
              <td className="py-2">
                <Link href={`/admin/blog/${p.id}`} className="hover:text-accent">
                  {p.title}
                </Link>
              </td>
              <td className="py-2">
                <span className={p.status === "published" ? "text-accent" : "text-muted"}>{p.status}</span>
              </td>
              <td className="py-2 text-muted">{new Date(p.updatedAt).toLocaleDateString()}</td>
              <td className="py-2 text-right">
                <FacebookPostedIcon
                  lastPostedAt={p.lastPostedToFacebookAt}
                  lastPostedUrl={p.lastPostedToFacebookUrl}
                />
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-muted text-center">
                No posts yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
