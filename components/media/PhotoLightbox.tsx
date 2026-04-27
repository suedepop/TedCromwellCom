"use client";
import { useCallback, useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

interface Photo {
  id: string;
  blobUrl: string;
  thumbnailUrl: string;
  caption?: string;
}

interface Props {
  photos: Photo[];
  excludeIds?: string[];
  gridClassName?: string;
  /** Analytics: where this gallery lives, e.g. "concert" or "travel" */
  context?: string;
  /** Analytics: id of the parent post/event */
  contextId?: string;
}

export default function PhotoLightbox({
  photos,
  excludeIds = [],
  gridClassName = "grid grid-cols-2 md:grid-cols-3 gap-2",
  context,
  contextId,
}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length],
  );
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, next, prev]);

  function openAt(id: string) {
    const idx = photos.findIndex((p) => p.id === id);
    if (idx >= 0) {
      setOpenIndex(idx);
      trackEvent("photo_view", {
        context: context ?? "unknown",
        context_id: contextId,
        photo_id: id,
        index: idx,
      });
    }
  }

  const visible = photos.filter((p) => !excludeIds.includes(p.id));
  const current = openIndex !== null ? photos[openIndex] : null;

  return (
    <>
      {visible.length > 0 && (
        <div className={gridClassName}>
          {visible.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => openAt(p.id)}
              className="aspect-square overflow-hidden rounded bg-black hover:opacity-90 transition"
            >
              <img
                src={p.thumbnailUrl ?? p.blobUrl}
                alt={p.caption ?? ""}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={close}
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="absolute top-3 right-4 text-white/80 hover:text-accent text-4xl leading-none"
          >
            ×
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-accent text-5xl leading-none px-3 py-2"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-accent text-5xl leading-none px-3 py-2"
              >
                ›
              </button>
            </>
          )}

          <img
            src={current.blobUrl}
            alt={current.caption ?? ""}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[95vw] max-h-[95vh] object-contain"
          />

          {current.caption && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-[80vw] text-center text-sm text-white/90 bg-black/60 px-3 py-1 rounded">
              {current.caption}
            </div>
          )}
          {photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-xs font-mono">
              {openIndex! + 1} / {photos.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
