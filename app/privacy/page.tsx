import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy & Comment Policy — Ted Cromwell",
  description: "How this site handles data, cookies, and comments.",
};

const LAST_UPDATED = "2026-04-20";

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl mx-auto prose prose-invert prose-amber">
      <h1>Privacy &amp; Comment Policy</h1>
      <p className="text-muted text-sm">Last updated: {LAST_UPDATED}</p>

      <h2>The short version</h2>
      <p>
        This is a personal site. I don&apos;t run ads, I don&apos;t sell data, and I don&apos;t try to
        track visitors across the web. The few things that do touch your data are listed below — mostly
        third-party services that make the site work (maps, comments, image hosting).
      </p>

      <h2>What this site collects directly</h2>
      <ul>
        <li>
          <strong>Nothing by default.</strong> The pages you visit are served from Azure; I don&apos;t run
          my own analytics. Azure logs standard request metadata (IP, user-agent, path, response code)
          for security and debugging, retained for a short window.
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
          <strong>Disqus</strong> — powers the comments on blog, concert, and travel detail pages.
          When a comment thread loads, Disqus sees the page URL, a thread identifier, and (if you
          comment or sign in) whatever account details you provide. Disqus is a third party with its
          own privacy practices — read them at{" "}
          <a href="https://help.disqus.com/en/articles/1717103-disqus-privacy-policy">
            help.disqus.com/en/articles/1717103-disqus-privacy-policy
          </a>
          . If you&apos;d rather not load Disqus, a browser-level tracker blocker will prevent the
          embed from firing; the rest of the page still works.
        </li>
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
        The site itself only sets the admin cookie mentioned above, and only for me. Embedded
        third-party widgets (Disqus, YouTube) may set their own cookies when they load. Blocking
        third-party cookies in your browser is a reasonable default and won&apos;t break anything here
        except the ability to comment.
      </p>

      <h2>Comment policy</h2>
      <p>Comments are welcome, with a few ground rules:</p>
      <ul>
        <li>Be civil. Disagreement is fine; personal attacks and slurs aren&apos;t.</li>
        <li>No spam, no self-promotion unrelated to the post, no affiliate links.</li>
        <li>No harassment, doxxing, or threats. First-time violations get removed; repeat offenders get banned.</li>
        <li>Off-topic comments may be removed at my discretion.</li>
        <li>
          Comments you post are public and visible to anyone who visits the page. Don&apos;t share
          anything you wouldn&apos;t want archived.
        </li>
        <li>
          I reserve the right to edit, remove, or hide comments — typically only for the reasons
          above. I generally don&apos;t edit content, only remove when necessary.
        </li>
      </ul>
      <p>
        Comments are hosted by Disqus under my account. If you want a comment removed or your
        Disqus profile data deleted, you can do it directly through Disqus, or email me (below) and
        I&apos;ll handle it.
      </p>

      <h2>Email &amp; contact</h2>
      <p>
        If you email me from a form or directly, I&apos;ll read it. I won&apos;t subscribe you to
        anything. There&apos;s no newsletter.
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
