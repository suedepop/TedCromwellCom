/**
 * Server-side helpers for posting to a Facebook Page via the Graph API.
 * Requires FB_PAGE_ID + FB_PAGE_ACCESS_TOKEN env vars.
 */

const GRAPH = "https://graph.facebook.com/v21.0";

interface UploadedPhoto {
  id: string;
}

interface FbErrorBody {
  error?: { message?: string; code?: number; type?: string };
}

function pageId(): string {
  const v = process.env.FB_PAGE_ID;
  if (!v) throw new Error("FB_PAGE_ID is not set");
  return v;
}
function pageToken(): string {
  const v = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!v) throw new Error("FB_PAGE_ACCESS_TOKEN is not set");
  return v;
}

async function fbCall<T>(method: "GET" | "POST", path: string, body?: URLSearchParams): Promise<T> {
  const url = `${GRAPH}${path}`;
  const res = await fetch(url, {
    method,
    body: body,
  });
  const text = await res.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`facebook ${res.status}: ${text.slice(0, 200)}`);
  }
  if (!res.ok) {
    const err = parsed as FbErrorBody;
    throw new Error(`facebook ${res.status}: ${err.error?.message ?? text.slice(0, 200)}`);
  }
  return parsed as T;
}

/**
 * Upload an image to the Page as an unpublished photo. Returns the media_fbid
 * that can be attached to a feed post. Accepts public image URLs (Azure Blob).
 */
async function uploadUnpublishedPhoto(imageUrl: string): Promise<string> {
  const params = new URLSearchParams();
  params.set("url", imageUrl);
  params.set("published", "false");
  params.set("access_token", pageToken());
  const res = await fbCall<UploadedPhoto>("POST", `/${pageId()}/photos`, params);
  return res.id;
}

export interface FbPostInput {
  /** Post body. URL footer should be appended by caller. */
  message: string;
  /** Public image URLs to attach (already uploaded somewhere reachable). */
  imageUrls?: string[];
  /** Canonical URL of the page being shared — used as a link preview if no images. */
  link?: string;
}

export interface FbPostResult {
  id: string;
  url: string;
}

/**
 * Post to the configured Facebook Page. Up to 10 attached images are posted
 * as a multi-photo feed item; without images, the post falls back to a link
 * card via the message + link.
 */
export async function postToFacebookPage(input: FbPostInput): Promise<FbPostResult> {
  const message = input.message.trim();
  if (!message) throw new Error("Empty message");

  const photoUrls = (input.imageUrls ?? []).slice(0, 10);
  const params = new URLSearchParams();
  params.set("message", message);
  params.set("access_token", pageToken());

  if (photoUrls.length > 0) {
    const ids = await Promise.all(photoUrls.map(uploadUnpublishedPhoto));
    ids.forEach((id, i) => {
      params.append(`attached_media[${i}]`, JSON.stringify({ media_fbid: id }));
    });
  } else if (input.link) {
    params.set("link", input.link);
  }

  const res = await fbCall<{ id: string }>("POST", `/${pageId()}/feed`, params);
  // res.id is "<page_id>_<post_id>"; build a permalink to the post
  const postId = res.id.includes("_") ? res.id.split("_")[1] : res.id;
  return {
    id: res.id,
    url: `https://www.facebook.com/${pageId()}/posts/${postId}`,
  };
}
