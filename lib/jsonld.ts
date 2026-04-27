import type { BlogPost, Concert, TravelEntry, Venue } from "./types";
import { SITE_NAME, siteUrl } from "./metadata";

function authorBlock() {
  return { "@type": "Person", name: SITE_NAME, url: siteUrl() };
}

export function blogPostJsonLd(post: BlogPost): object {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt ?? post.updatedAt,
    dateModified: post.updatedAt,
    author: authorBlock(),
    publisher: { "@type": "Person", name: SITE_NAME },
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl(`/blog/${post.slug}`) },
    image: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    keywords: post.tags?.join(", "),
    url: siteUrl(`/blog/${post.slug}`),
  };
}

export function concertEventJsonLd(concert: Concert, venue: Venue | null): object {
  const performers = concert.setlists.map((s) => ({ "@type": "MusicGroup", name: s.artist }));
  const location: object = venue
    ? {
        "@type": "MusicVenue",
        name: venue.canonicalName,
        address: {
          "@type": "PostalAddress",
          addressLocality: venue.city,
          addressRegion: venue.state,
          addressCountry: venue.country,
        },
        ...(typeof venue.lat === "number" && typeof venue.lng === "number"
          ? {
              geo: {
                "@type": "GeoCoordinates",
                latitude: venue.lat,
                longitude: venue.lng,
              },
            }
          : {}),
      }
    : {
        "@type": "Place",
        name: concert.venueNameRaw,
        address: {
          "@type": "PostalAddress",
          addressLocality: concert.city,
          addressCountry: concert.country,
        },
      };
  const featured =
    concert.photos.find((p) => p.id === concert.featuredPhotoId) ?? concert.photos[0];
  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: concert.eventName ?? performers.map((p) => p.name).join(" · "),
    startDate: concert.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    performer: performers,
    location,
    image: featured ? [featured.blobUrl] : undefined,
    url: siteUrl(`/concerts/${concert.slug ?? concert.id}`),
  };
}

export function venueJsonLd(venue: Venue, showCount: number): object {
  return {
    "@context": "https://schema.org",
    "@type": "MusicVenue",
    name: venue.canonicalName,
    description: venue.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: venue.city,
      addressRegion: venue.state,
      addressCountry: venue.country,
    },
    ...(typeof venue.lat === "number" && typeof venue.lng === "number"
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: venue.lat,
            longitude: venue.lng,
          },
        }
      : {}),
    ...(typeof venue.capacity === "number" ? { maximumAttendeeCapacity: venue.capacity } : {}),
    sameAs: venue.wikipediaUrl ? [venue.wikipediaUrl] : undefined,
    aggregateRating: undefined, // intentionally omitted; not appropriate for personal site
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/AttendAction",
      userInteractionCount: showCount,
    },
    url: siteUrl(`/venues/${venue.id}`),
  };
}

export function travelEntryJsonLd(entry: TravelEntry): object {
  const featured = entry.photos.find((p) => p.id === entry.featuredPhotoId) ?? entry.photos[0];
  return {
    "@context": "https://schema.org",
    "@type": "TravelAction",
    agent: authorBlock(),
    fromLocation: undefined,
    toLocation: {
      "@type": "Place",
      name: entry.locationName,
      address: {
        "@type": "PostalAddress",
        addressLocality: entry.city,
        addressRegion: entry.state,
        addressCountry: entry.country,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: entry.lat,
        longitude: entry.lng,
      },
    },
    startTime: entry.startDate,
    endTime: entry.endDate ?? entry.startDate,
    image: featured ? [featured.blobUrl] : undefined,
    description: (entry.content ?? "").replace(/[#>*_`\[\]\(\)!]/g, "").replace(/\s+/g, " ").trim().slice(0, 240),
    url: siteUrl(`/travel/${entry.slug ?? entry.id}`),
  };
}

export function jsonLdScript(data: object): string {
  return JSON.stringify(data, (_k, v) => (v === undefined ? undefined : v));
}
