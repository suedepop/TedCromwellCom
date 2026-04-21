import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { deletePost, findPostById, updatePost } from "@/lib/blog";
import { slugify } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const post = await findPostById(params.id);
  if (!post) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (post.status === "draft" && !requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const existing = await findPostById(params.id);
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const patch = {
    ...body,
    slug: typeof body.slug === "string" ? slugify(body.slug) : undefined,
  } as Parameters<typeof updatePost>[1];
  const updated = await updatePost(existing, patch);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const existing = await findPostById(params.id);
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
  await deletePost(existing);
  return NextResponse.json({ ok: true });
}
