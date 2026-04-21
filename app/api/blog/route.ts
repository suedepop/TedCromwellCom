import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { createPost, listPosts } from "@/lib/blog";
import { slugify } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") as "draft" | "published" | null;
  const isAdmin = !!requireAdminFromRequest(req);
  const effective = status ?? (isAdmin ? undefined : "published");
  if (effective === "draft" && !isAdmin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const posts = await listPosts(effective ?? undefined);
  const shape = isAdmin ? posts : posts.filter((p) => p.status === "published");
  return NextResponse.json(shape);
}

export async function POST(req: Request) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    coverImageUrl?: string;
    tags?: string[];
    status?: "draft" | "published";
    postType?: "markdown" | "html";
    htmlUrl?: string;
    publishedAt?: string;
  };
  if (!body.title || typeof body.content !== "string") {
    return NextResponse.json({ error: "title and content required" }, { status: 400 });
  }
  if (body.postType === "html" && !body.htmlUrl) {
    return NextResponse.json({ error: "htmlUrl required for html posts" }, { status: 400 });
  }
  const post = await createPost({
    title: body.title,
    slug: body.slug ? slugify(body.slug) : slugify(body.title),
    content: body.content,
    excerpt: body.excerpt,
    coverImageUrl: body.coverImageUrl,
    tags: body.tags,
    status: body.status,
    postType: body.postType,
    htmlUrl: body.htmlUrl,
    publishedAt: body.publishedAt,
  });
  return NextResponse.json(post, { status: 201 });
}
