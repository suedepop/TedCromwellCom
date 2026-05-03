"use client";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

interface Props {
  /** Stable unique identifier for the thread (post/concert/travel id). */
  pageId: string;
  /** Display title for the thread. */
  title: string;
  /** Canonical URL for the page. */
  url: string;
}

declare global {
  interface Window {
    CUSDIS?: { initial: () => void };
  }
}

const APP_ID = process.env.NEXT_PUBLIC_CUSDIS_APP_ID;
const HOST = "https://cusdis.com";
const SCRIPT_SRC = "https://cusdis.com/js/cusdis.es.js";

export default function Cusdis({ pageId, title, url }: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!APP_ID) return;
    const el = sectionRef.current;
    if (!el) return;
    let fired = false;
    const obs = new IntersectionObserver(
      (entries) => {
        if (!fired && entries.some((e) => e.isIntersecting)) {
          fired = true;
          trackEvent("comment_section_visible", { thread_id: pageId });
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -25% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [pageId]);

  useEffect(() => {
    if (!APP_ID) return;
    // If Cusdis already loaded on this page (SPA navigation), re-init.
    if (window.CUSDIS) {
      window.CUSDIS.initial();
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [pageId, title, url]);

  if (!APP_ID) return null;

  return (
    <section ref={sectionRef} className="mt-12 border-t border-border pt-8">
      <h2 className="font-display text-2xl mb-4">Comments</h2>
      <div
        id="cusdis_thread"
        data-host={HOST}
        data-app-id={APP_ID}
        data-page-id={pageId}
        data-page-url={url}
        data-page-title={title}
        data-theme="dark"
      />
    </section>
  );
}
