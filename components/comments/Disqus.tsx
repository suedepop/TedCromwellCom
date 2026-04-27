"use client";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

interface Props {
  /** Stable unique identifier for the thread (post/concert/travel id). */
  identifier: string;
  /** Display title for the thread. */
  title: string;
  /** Canonical URL for the page. */
  url: string;
}

declare global {
  interface Window {
    disqus_config?: (this: { page: { url: string; identifier: string; title: string } }) => void;
    DISQUS?: { reset: (args: { reload: boolean; config: () => void }) => void };
  }
}

const SHORTNAME = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME;

export default function Disqus({ identifier, title, url }: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let fired = false;
    const obs = new IntersectionObserver(
      (entries) => {
        if (!fired && entries.some((e) => e.isIntersecting)) {
          fired = true;
          trackEvent("comment_section_visible", { thread_id: identifier });
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -25% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [identifier]);

  useEffect(() => {
    if (!SHORTNAME) return;

    const configure = function (this: { page: { url: string; identifier: string; title: string } }) {
      this.page.url = url;
      this.page.identifier = identifier;
      this.page.title = title;
    };
    window.disqus_config = configure;

    // If Disqus already loaded on this page (SPA navigation), just reset it.
    if (window.DISQUS) {
      window.DISQUS.reset({ reload: true, config: configure });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://${SHORTNAME}.disqus.com/embed.js`;
    script.setAttribute("data-timestamp", String(Date.now()));
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [identifier, title, url]);

  if (!SHORTNAME) {
    return null;
  }

  return (
    <section ref={sectionRef} className="mt-12 border-t border-border pt-8">
      <h2 className="font-display text-2xl mb-4">Comments</h2>
      <div id="disqus_thread" />
    </section>
  );
}
