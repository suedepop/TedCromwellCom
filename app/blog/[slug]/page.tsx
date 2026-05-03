import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cusdis from "@/components/comments/Cusdis";
import PostBody from "@/components/blog/PostBody";
import { findPostBySlug } from "@/lib/blog";
import { pageMetadata } from "@/lib/metadata";
import { blogPostJsonLdSpeakable, jsonLdScript } from "@/lib/jsonld";
import Breadcrumbs from "@/components/Breadcrumbs";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await findPostBySlug(params.slug);
  if (!post || post.status !== "published") return {};
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    imageUrl: post.coverImageUrl,
    imageAlt: post.title,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    tags: post.tags,
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await findPostBySlug(params.slug);
  if (!post || post.status !== "published") notFound();

  if (post.postType === "html" && post.htmlUrl) {
    return (
      <div className="relative left-1/2 -translate-x-1/2 w-screen -mt-10 -mb-10">
        <div className="sticky top-0 z-20 flex items-center justify-between bg-bg/95 backdrop-blur border-b border-border px-4 py-2 text-sm">
          <Link href="/blog" className="text-muted hover:text-accent">
            ← Back to blog
          </Link>
          <span className="font-display text-base truncate px-2">{post.title}</span>
          <a href={post.htmlUrl} target="_blank" rel="noreferrer" className="text-xs text-muted hover:text-accent">
            Open in new tab ↗
          </a>
        </div>
        <iframe
          src={post.htmlUrl}
          title={post.title}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          className="w-full border-0 bg-white"
          style={{ height: "calc(100vh - 3.5rem - 2.5rem)" }}
        />
      </div>
    );
  }

  const date = post.publishedAt ?? post.updatedAt;
  return (
    <article className="max-w-3xl mx-auto space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(blogPostJsonLdSpeakable(post)) }}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
      {post.coverImageUrl && (
        <div className="aspect-[16/9] bg-black rounded overflow-hidden">
          <img src={post.coverImageUrl} alt="" className="w-full h-full object-cover opacity-90" />
        </div>
      )}
      <header className="space-y-3">
        <h1 className="font-display text-4xl md:text-5xl">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted min-w-0">
          <time dateTime={date} className="whitespace-nowrap shrink-0">
            {new Date(date).toLocaleDateString()}
          </time>
          {post.tags.length > 0 && (
            <span className="flex gap-2 flex-nowrap overflow-hidden whitespace-nowrap min-w-0">
              {post.tags.map((t) => (
                <span key={t} className="text-accent truncate">
                  #{t}
                </span>
              ))}
            </span>
          )}
        </div>
      </header>
      <PostBody content={post.content} />
      <Cusdis
        pageId={`blog-${post.id}`}
        title={post.title}
        url={`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/blog/${post.slug}`}
      />
    </article>
  );
}
