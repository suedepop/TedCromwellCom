import type { Metadata } from "next";

export const SITE_NAME = "Ted Cromwell";
export const SITE_DESCRIPTION =
  "Writing, concerts, travel, and work — a personal archive by Ted Cromwell.";
export const SITE_LOCALE = "en_US";
export const TWITTER_HANDLE = "";

export function siteUrl(path = ""): string {
  const base = (process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.tedcromwell.com").replace(
    /\/$/,
    "",
  );
  if (!path) return base;
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}

const DEFAULT_OG_IMAGE = siteUrl("/og-default.png");

interface PageMetaInput {
  title: string;
  description?: string;
  path: string;
  /** Absolute URL — pass full http(s)://… */
  imageUrl?: string;
  imageAlt?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

export function pageMetadata(input: PageMetaInput): Metadata {
  const desc = (input.description ?? SITE_DESCRIPTION).slice(0, 240);
  const url = siteUrl(input.path);
  const image = input.imageUrl ?? DEFAULT_OG_IMAGE;
  const imageAlt = input.imageAlt ?? input.title;

  const og: Metadata["openGraph"] =
    input.type === "article"
      ? {
          title: input.title,
          description: desc,
          siteName: SITE_NAME,
          locale: SITE_LOCALE,
          type: "article",
          url,
          images: [{ url: image, alt: imageAlt, width: 1200, height: 630 }],
          publishedTime: input.publishedTime,
          modifiedTime: input.modifiedTime,
          tags: input.tags,
        }
      : {
          title: input.title,
          description: desc,
          siteName: SITE_NAME,
          locale: SITE_LOCALE,
          type: input.type ?? "website",
          url,
          images: [{ url: image, alt: imageAlt, width: 1200, height: 630 }],
        };

  const twitter: Metadata["twitter"] = {
    card: "summary_large_image",
    title: input.title,
    description: desc,
    images: [image],
  };
  if (TWITTER_HANDLE) {
    twitter.creator = TWITTER_HANDLE;
    twitter.site = TWITTER_HANDLE;
  }

  return {
    title: input.title,
    description: desc,
    alternates: { canonical: url },
    openGraph: og,
    twitter,
  };
}
