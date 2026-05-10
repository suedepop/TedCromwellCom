import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

const POSTED_AT = "2026-05-09T17:00:00.000Z"; // noon EDT — renders as May 9, 2026 in US time zones

interface Target {
  type: "blog" | "travel" | "concert";
  slug: string;
}

const TARGETS: Target[] = [
  { type: "blog", slug: "planning-a-family-trip-to-europe" },
  { type: "blog", slug: "make-wv-blue-again-how-out-of-state-billionaires-are-buying-our-elections" },
  { type: "blog", slug: "that-pending-paypal-charge-email-is-a-scam-even-though-it-really-came-from-paypa" },
  { type: "blog", slug: "good-luck-to-our-local-players-at-ocma-this-weekend" },
  { type: "blog", slug: "the-price-you-see-isnt-the-price-they-see" },
  { type: "travel", slug: "2025-10-02-knoebels-ppp-weekend-2025" },
  { type: "travel", slug: "2026-03-30-an-evening-walk-to-the-national-mall" },
  { type: "travel", slug: "2023-10-28-a-morning-in-krakws-old-town" },
  { type: "travel", slug: "2026-04-25-saturday-afternoon-in-bristol" },
  { type: "concert", slug: "2025-10-07-radio-soul-the-early-songs-of-elvis-costello" },
  { type: "concert", slug: "2025-05-08-pwrup-north-american-tour" },
];

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const { containers } = await import("../lib/cosmos");
  const { findPostBySlug } = await import("../lib/blog");
  const { findTravelEntryBySlugOrId } = await import("../lib/travel");
  const { findConcertBySlugOrId } = await import("../lib/concerts");

  for (const t of TARGETS) {
    if (t.type === "blog") {
      const post = await findPostBySlug(t.slug);
      if (!post) {
        console.log(`✗ blog ${t.slug}: not found`);
        continue;
      }
      const updated = { ...post, lastPostedToFacebookAt: POSTED_AT };
      if (dryRun) {
        console.log(`◌ blog ${t.slug}: would set lastPostedToFacebookAt`);
      } else {
        await containers.posts.item(post.id, post.status).replace(updated);
        console.log(`✓ blog ${t.slug}`);
      }
    } else if (t.type === "travel") {
      const entry = await findTravelEntryBySlugOrId(t.slug);
      if (!entry) {
        console.log(`✗ travel ${t.slug}: not found`);
        continue;
      }
      const updated = { ...entry, lastPostedToFacebookAt: POSTED_AT };
      if (dryRun) {
        console.log(`◌ travel ${t.slug}: would set lastPostedToFacebookAt`);
      } else {
        await containers.trips.item(entry.id, entry.id).replace(updated);
        console.log(`✓ travel ${t.slug}`);
      }
    } else if (t.type === "concert") {
      const concert = await findConcertBySlugOrId(t.slug);
      if (!concert) {
        console.log(`✗ concert ${t.slug}: not found`);
        continue;
      }
      const updated = { ...concert, lastPostedToFacebookAt: POSTED_AT };
      if (dryRun) {
        console.log(`◌ concert ${t.slug}: would set lastPostedToFacebookAt`);
      } else {
        await containers.concerts.item(concert.id, concert.venueId).replace(updated);
        console.log(`✓ concert ${t.slug}`);
      }
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
