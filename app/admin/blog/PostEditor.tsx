"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BlogPost } from "@/lib/types";

import UploadDropzone from "@/components/media/UploadDropzone";

const MarkdownEditor = dynamic(() => import("@/components/ui/MarkdownEditor"), { ssr: false });

interface Props {
  post?: BlogPost;
}

export default function PostEditor({ post }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [tags, setTags] = useState(post?.tags.join(", ") ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImageUrl ?? "");
  const [status, setStatus] = useState<"draft" | "published">(post?.status ?? "draft");
  const [postType, setPostType] = useState<"markdown" | "html">(post?.postType ?? "markdown");
  const [htmlUrl, setHtmlUrl] = useState(post?.htmlUrl ?? "");
  const [publishedAtLocal, setPublishedAtLocal] = useState(isoToLocal(post?.publishedAt));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave =
    !!title && (postType === "markdown" ? !!content : !!htmlUrl);

  async function save(nextStatus?: "draft" | "published") {
    setBusy(true);
    setError(null);
    const payload = {
      title,
      slug: slug || undefined,
      excerpt: excerpt || undefined,
      content: postType === "html" ? "" : content,
      postType,
      htmlUrl: postType === "html" ? htmlUrl : undefined,
      coverImageUrl: coverImageUrl || undefined,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      status: nextStatus ?? status,
      publishedAt: publishedAtLocal ? new Date(publishedAtLocal).toISOString() : undefined,
    };
    const url = post ? `/api/blog/${post.id}` : "/api/blog";
    const method = post ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!res.ok) {
      setError(`Save failed: ${res.status}`);
      return;
    }
    const saved = (await res.json()) as BlogPost;
    setStatus(saved.status);
    if (!post) router.push(`/admin/blog/${saved.id}`);
    else router.refresh();
  }

  async function onDelete() {
    if (!post) return;
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/blog/${post.id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/blog");
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">{post ? "Edit Post" : "New Post"}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => save("draft")}
            disabled={busy || !canSave}
            className="border border-border px-3 py-1.5 rounded text-sm disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => save("published")}
            disabled={busy || !canSave}
            className="bg-accent text-bg px-3 py-1.5 rounded text-sm disabled:opacity-50"
          >
            {status === "published" ? "Update" : "Publish"}
          </button>
          {post && (
            <button onClick={onDelete} className="border border-red-500/50 text-red-400 px-3 py-1.5 rounded text-sm">
              Delete
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <Field label="Post type">
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" name="postType" checked={postType === "markdown"} onChange={() => setPostType("markdown")} />
            Markdown
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="postType" checked={postType === "html"} onChange={() => setPostType("html")} />
            HTML (one-page site)
          </label>
        </div>
      </Field>

      <Field label="Title">
        <input className="w-full bg-surface border border-border rounded px-3 py-2 text-lg" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="Slug (optional — auto from title)">
        <input className="w-full bg-surface border border-border rounded px-3 py-2 font-mono text-sm" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated" />
      </Field>
      <Field label="Excerpt">
        <textarea className="w-full bg-surface border border-border rounded px-3 py-2 text-sm" rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
      </Field>
      <Field label="Cover image">
        <div className="space-y-2">
          <input className="w-full bg-surface border border-border rounded px-3 py-2 text-sm" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="URL or upload below" />
          {coverImageUrl && <img src={coverImageUrl} alt="" className="max-h-40 rounded border border-border" />}
          <UploadDropzone endpoint="/api/upload/blog-cover" onUploaded={(r) => setCoverImageUrl(r.blobUrl)} label="Upload cover image" />
        </div>
      </Field>
      <Field label="Tags (comma-separated)">
        <input className="w-full bg-surface border border-border rounded px-3 py-2 text-sm" value={tags} onChange={(e) => setTags(e.target.value)} />
      </Field>
      <Field label="Published at (controls order on home + blog list — leave blank to use now)">
        <input
          type="datetime-local"
          value={publishedAtLocal}
          onChange={(e) => setPublishedAtLocal(e.target.value)}
          className="bg-surface border border-border rounded px-3 py-2 text-sm font-mono"
        />
      </Field>

      {postType === "markdown" ? (
        <Field label="Content">
          <MarkdownEditor value={content} onChange={setContent} />
        </Field>
      ) : (
        <Field label="HTML file">
          <div className="space-y-2">
            <input
              className="w-full bg-surface border border-border rounded px-3 py-2 font-mono text-xs"
              value={htmlUrl}
              onChange={(e) => setHtmlUrl(e.target.value)}
              placeholder="Blob URL or upload below"
            />
            {htmlUrl && (
              <a href={htmlUrl} target="_blank" rel="noreferrer" className="text-xs text-accent">
                Open current HTML in new tab ↗
              </a>
            )}
            <UploadDropzone
              endpoint="/api/upload/blog-html"
              accept="text/html,.html,.htm"
              onUploaded={(r) => setHtmlUrl(r.blobUrl)}
              label="Upload .html file (one-page site)"
            />
            <p className="text-xs text-muted">
              The uploaded page renders in an iframe with a small "Back to blog" header on top.
            </p>
          </div>
        </Field>
      )}
    </div>
  );
}

function isoToLocal(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs uppercase tracking-wider text-muted">{label}</span>
      {children}
    </label>
  );
}
