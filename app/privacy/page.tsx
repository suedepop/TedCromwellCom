import { pageMetadata } from "@/lib/metadata";
import { jsonLdScript } from "@/lib/jsonld";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How this site handles data and cookies.",
  path: "/privacy",
});

const LAST_UPDATED = "2026-04-30";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does this site track me?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Google Analytics records standard analytics data (IP-derived rough location, device, referrer, pages viewed) and sets cookies for session continuity. The site itself sets no other cookies for ordinary visitors. Embedded YouTube players may set their own cookies when they load.",
      },
    },
    {
      "@type": "Question",
      name: "Are there ads?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. There are no ads, no affiliate links, and no data sales.",
      },
    },
    {
      "@type": "Question",
      name: "Can I comment on posts?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Not currently. There's no comment system on the site. If you'd like to reach me, email tedcromwell@gmail.com.",
      },
    },
  ],
};

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl mx-auto prose prose-invert prose-amber">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqSchema) }}
      />
      <h1>Privacy Policy</h1>
      <p className="text-muted text-sm">Last updated: {LAST_UPDATED}</p>

      <h2>The short version</h2>
      <p>
        This is a personal site. I don&apos;t run ads, I don&apos;t sell data, and I don&apos;t try to
        track visitors across the web. The few things that do touch your data are listed below — mostly
        third-party services that make the site work (maps, image hosting, analytics).
      </p>

      <h2>What this site collects directly</h2>
      <ul>
        <li>
          <strong>Google Analytics (GA4).</strong> I use Google Analytics to understand which
          pages people read and where visitors come from. GA records standard analytics data —
          IP-derived rough location, device and browser, referrer, and pages viewed — and sets
          cookies (<code>_ga</code>, <code>_ga_*</code>) for session continuity. I don&apos;t use
          this data to identify you personally, and Google&apos;s privacy terms apply. You can
          opt out with a tracker blocker or the{" "}
          <a href="https://tools.google.com/dlpage/gaoptout">Google Analytics opt-out add-on</a>.
        </li>
        <li>
          <strong>Azure logs.</strong> The pages are served from Azure Static Web Apps, which logs
          standard request metadata (IP, user-agent, path, response code) for security and
          debugging, retained for a short window.
        </li>
        <li>
          <strong>Admin cookie.</strong> The <code>/admin</code> area uses a signed{" "}
          <code>admin_token</code> HTTP-only cookie to keep me logged in when I&apos;m editing the
          site. It&apos;s only set after I sign in and is not set for ordinary visitors.
        </li>
      </ul>

      <h2>Third-party services</h2>
      <ul>
        <li>
          <strong>OpenStreetMap</strong> — map tiles on the concerts, venues, and travel pages come
          from OpenStreetMap. Rendering a tile requires your browser to request it, which exposes
          your IP to their servers.
        </li>
        <li>
          <strong>Wikipedia</strong> and <strong>Nominatim</strong> — used from the admin area only
          (for venue research and place lookups); visitor browsing does not touch them.
        </li>
        <li>
          <strong>YouTube</strong> — if a concert page embeds YouTube videos, YouTube&apos;s privacy
          rules apply while those players load. I use the <code>youtube-nocookie.com</code> domain
          where possible to limit tracking.
        </li>
        <li>
          <strong>setlist.fm</strong> — I import my own attended setlists from setlist.fm for the
          Concerts section. That request happens on the server; your browsing doesn&apos;t hit them.
        </li>
        <li>
          <strong>Azure</strong> — Static Web Apps (site hosting), Blob Storage (photos and files),
          and Cosmos DB (structured data). Microsoft&apos;s privacy terms apply.
        </li>
      </ul>

      <h2>Cookies</h2>
      <p>
        The site itself only sets the admin cookie mentioned above, and only for me. Google
        Analytics sets first-party cookies as described above. Embedded YouTube players may set
        their own cookies when they load. Blocking third-party cookies in your browser is a
        reasonable default and won&apos;t break anything here.
      </p>

      <h2>Comments</h2>
      <p>
        There&apos;s no comment system on the site right now. If you want to reach me about
        something you read, email me at the address below.
      </p>

      <h2>Email &amp; contact</h2>
      <p>
        If you email me directly, I&apos;ll read it. I won&apos;t subscribe you to anything.
        There&apos;s no newsletter.
      </p>

      <h2>Changes</h2>
      <p>
        If this page changes meaningfully, I&apos;ll update the &ldquo;Last updated&rdquo; date above.
        No email notifications — check back if you care.
      </p>

      <h2>Contact</h2>
      <p>
        Questions, corrections, or takedown requests:{" "}
        <a href="mailto:tedcromwell@gmail.com">tedcromwell@gmail.com</a>.
      </p>
    </article>
  );
}
