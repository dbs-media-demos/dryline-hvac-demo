"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import clsx from "clsx";
import { PHONE_QUERY } from "@/lib/phone";

const noop = () => () => {};
const canAutoplay = () => {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !window.matchMedia(PHONE_QUERY).matches && !conn?.saveData;
};

/**
 * Muted looping video that only plays while visible, and never autoplays for
 * phones, reduced-motion or data-saver visitors (they keep the poster frame).
 */
export function VideoLoop({ src, poster, className, label }: { src: string; poster: string; className?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const allowed = useSyncExternalStore(noop, canAutoplay, () => false);

  useEffect(() => {
    const v = ref.current;
    if (!v || !allowed) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "100px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [allowed]);

  return (
    <video
      ref={ref}
      className={clsx("h-full w-full object-cover", className)}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      src={allowed ? src : undefined}
    />
  );
}
