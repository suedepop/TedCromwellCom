import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { findPostBySlug, findPostById } from "@/lib/blog";
import { findConcertBySlugOrId } from "@/lib/concerts";
import { findTravelEntryBySlugOrId } from "@/lib/travel";
import { concertBandLine } from "@/lib/concertDisplay";
import { postToFacebookPage } from "@/lib/facebook";
import { siteUrl } from "@/lib/metadata";
import { containers } from "@/lib/cosmos";
import type { BlogPost, Concert, TravelEntry } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

type ContentType = "blog" | "concert" | "travel";

function stripMarkdown(md: string): string {
  return md
    // strip our embed markers
    .replace(/@youtube\\?\[[A-Za-z0-9_-]+\\?\]/g, "")
    .replace(/@instagram\\?\[[^\]]+\\?\]/g, "")
    // strip raw HTML tags
    .replace(/<[^>]+>/g, "")
    // unwrap markdown links: [text](url) → text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    // images
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    // headings, blockquotes, list markers
    .replace(/^\s{0,3}(#{1,6}\s|>\s|[-*+]\s|\d+\.\s)/gm, "")
    // emphasis
    .replace(/[*_~`]+/g, "")
    // collapse whitespace
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function POST(req: Request) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as {
    type?: ContentType;
    id?: string;
  };
  if (!body.type || !body.id) {
    return NextResponse.json({ error: "type and id required" }, { status: 400 });
  }

  let message = "";
  let link = "";
  let images: string[] = [];
  let post: BlogPost | null = null;
  let concert: Concert | null = null;
  let entry: TravelEntry | null = null;

  if (body.type === "blog") {
    post = (await findPostById(body.id)) ?? (await findPostBySlug(body.id));
    if (!post) return NextResponse.json({ error: "post not found" }, { status: 404 });
    if (post.status !== "published") {
      return NextResponse.json({ error: "post is not published" }, { status: 400 });
    }
    link = siteUrl(`/blog/${post.slug}`);
    const bodyText = stripMarkdown(post.content);
    message = `${post.title}\n\n${bodyText}\n\nRead the full post: ${link}`;
    if (post.coverImageUrl) images = [post.coverImageUrl];
  } else if (body.type === "concert") {
    concert = await findConcertBySlugOrId(body.id);
    if (!concert) return NextResponse.json({ error: "concert not found" }, { status: 404 });
    link = siteUrl(`/concerts/${concert.slug ?? concert.id}`);
    const date = new Date(concert.date).toLocaleDateString(undefined, { dateStyle: "long" });
    const title = concert.eventName
      ? `${concert.eventName} — ${concertBandLine(concert)}`
      : concertBandLine(concert);
    const writeUp = concert.writeUp ? `\n\n${stripMarkdown(concert.writeUp)}` : "";
    message = `${title}\n${date} · ${concert.venueNameRaw} · ${concert.city}${writeUp}\n\nRead more: ${link}`;
    images = concert.photos.map((p) => p.blobUrl);
  } else if (body.type === "travel") {
    entry = await findTravelEntryBySlugOrId(body.id);
    if (!entry) return NextResponse.json({ error: "travel entry not found" }, { status: 404 });
    link = siteUrl(`/travel/${entry.slug ?? entry.id}`);
    const dateRange =
      entry.endDate && entry.endDate !== entry.startDate
        ? `${entry.startDate} → ${entry.endDate}`
        : entry.startDate;
    const where = [entry.city, entry.state, entry.country].filter(Boolean).join(", ");
    const writeUp = entry.content ? `\n\n${stripMarkdown(entry.content)}` : "";
    message = `${entry.locationName}\n${dateRange} · ${where}${writeUp}\n\nRead more: ${link}`;
    images = entry.photos.map((p) => p.blobUrl);
  } else {
    return NextResponse.json({ error: "invalid type" }, { status: 400 });
  }

  // Facebook caps post message length around 63k chars; slim down very long bodies.
  if (message.length > 5000) {
    const cut = message.slice(0, 4900).replace(/\s+\S*$/, "");
    message = `${cut}…\n\nFull post: ${link}`;
  }

  try {
    const result = await postToFacebookPage({ message, imageUrls: images, link });
    const postedAt = new Date().toISOString();
    // Persist the FB post timestamp + URL on the entity. Don't fail the request if this part errors.
    try {
      if (post) {
        const updated: BlogPost = {
          ...post,
          lastPostedToFacebookAt: postedAt,
          lastPostedToFacebookUrl: result.url,
        };
        await containers.posts.item(post.id, post.status).replace(updated);
      } else if (concert) {
        const updated: Concert = {
          ...concert,
          lastPostedToFacebookAt: postedAt,
          lastPostedToFacebookUrl: result.url,
        };
        await containers.concerts.item(concert.id, concert.venueId).replace(updated);
      } else if (entry) {
        const updated: TravelEntry = {
          ...entry,
          lastPostedToFacebookAt: postedAt,
          lastPostedToFacebookUrl: result.url,
        };
        await containers.trips.item(entry.id, entry.id).replace(updated);
      }
    } catch (e) {
      console.error("Failed to persist Facebook post timestamp:", e);
    }
    return NextResponse.json({
      ok: true,
      postUrl: result.url,
      fbId: result.id,
      attached: images.length,
      lastPostedAt: postedAt,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
