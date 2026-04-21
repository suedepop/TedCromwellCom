import { randomUUID } from "node:crypto";
import { containers } from "./cosmos";
import type { BlogPost } from "./types";

export interface BlogCreateInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  postType?: "markdown" | "html";
  htmlUrl?: string;
  coverImageUrl?: string;
  tags?: string[];
  status?: "draft" | "published";
  publishedAt?: string;
}

export interface BlogUpdateInput extends Partial<BlogCreateInput> {}

export async function listPosts(status?: "draft" | "published"): Promise<BlogPost[]> {
  const query = status
    ? { query: "SELECT * FROM c WHERE c.status = @status", parameters: [{ name: "@status", value: status }] }
    : { query: "SELECT * FROM c" };
  const { resources } = await containers.posts.items.query<BlogPost>(query).fetchAll();
  // Sort by publishedAt (falling back to updatedAt) — most recent first.
  resources.sort((a, b) => {
    const ad = a.publishedAt ?? a.updatedAt;
    const bd = b.publishedAt ?? b.updatedAt;
    return bd.localeCompare(ad);
  });
  return resources;
}

export async function getPost(id: string, status: "draft" | "published"): Promise<BlogPost | null> {
  try {
    const { resource } = await containers.posts.item(id, status).read<BlogPost>();
    return resource ?? null;
  } catch {
    return null;
  }
}

export async function findPostById(id: string): Promise<BlogPost | null> {
  const { resources } = await containers.posts.items
    .query<BlogPost>({
      query: "SELECT * FROM c WHERE c.id = @id",
      parameters: [{ name: "@id", value: id }],
    })
    .fetchAll();
  return resources[0] ?? null;
}

export async function findPostBySlug(slug: string): Promise<BlogPost | null> {
  const { resources } = await containers.posts.items
    .query<BlogPost>({
      query: "SELECT * FROM c WHERE c.slug = @slug",
      parameters: [{ name: "@slug", value: slug }],
    })
    .fetchAll();
  return resources[0] ?? null;
}

function excerptFrom(content: string, explicit?: string): string {
  if (explicit) return explicit.slice(0, 200);
  return content.replace(/[#>*_`\[\]\(\)!]/g, "").replace(/\s+/g, " ").trim().slice(0, 160);
}

export async function createPost(input: BlogCreateInput): Promise<BlogPost> {
  const now = new Date().toISOString();
  const status = input.status ?? "draft";
  const post: BlogPost = {
    id: randomUUID(),
    slug: input.slug || randomUUID().slice(0, 8),
    title: input.title,
    excerpt: excerptFrom(input.content, input.excerpt),
    content: input.content,
    postType: input.postType ?? "markdown",
    htmlUrl: input.htmlUrl,
    coverImageUrl: input.coverImageUrl,
    tags: input.tags ?? [],
    status,
    publishedAt:
      input.publishedAt ?? (status === "published" ? now : undefined),
    updatedAt: now,
  };
  const { resource } = await containers.posts.items.create(post);
  return resource as BlogPost;
}

export async function updatePost(
  existing: BlogPost,
  patch: BlogUpdateInput,
): Promise<BlogPost> {
  const now = new Date().toISOString();
  const nextStatus = patch.status ?? existing.status;
  const becomingPublished = existing.status !== "published" && nextStatus === "published";

  const updated: BlogPost = {
    ...existing,
    ...patch,
    tags: patch.tags ?? existing.tags,
    postType: patch.postType ?? existing.postType ?? "markdown",
    htmlUrl: patch.htmlUrl ?? existing.htmlUrl,
    excerpt: patch.excerpt
      ? patch.excerpt.slice(0, 200)
      : patch.content
        ? excerptFrom(patch.content)
        : existing.excerpt,
    status: nextStatus,
    publishedAt:
      patch.publishedAt ?? (becomingPublished ? now : existing.publishedAt),
    updatedAt: now,
  };

  if (existing.status !== nextStatus) {
    await containers.posts.item(existing.id, existing.status).delete();
    const { resource } = await containers.posts.items.create(updated);
    return resource as BlogPost;
  }

  const { resource } = await containers.posts.item(existing.id, existing.status).replace(updated);
  return resource as BlogPost;
}

export async function deletePost(post: BlogPost): Promise<void> {
  await containers.posts.item(post.id, post.status).delete();
}
