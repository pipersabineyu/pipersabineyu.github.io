"use client";

import { useEffect, useRef, useState } from "react";

// This walkthrough is a real, responsive web app UI (Patreon's Creator
// Studio) — squeezing its iframe into a small box via width/height:100%
// forces the browser to reflow it at that narrow width, and a full
// sidebar+dashboard layout doesn't have a graceful narrow state (the nav
// rail and content start overlapping). Rendering it at its own native
// desktop size and scaling the whole thing down with a CSS transform
// keeps the real layout intact, just smaller — the same technique
// PrototypeFrame/PhoneFrame use for the phone mockups.
const STAGE_W = 1440;
const STAGE_H = 900;

export function WalkthroughEmbed({ src }: { src: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const resize = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / STAGE_W);
    });
    resize.observe(el);
    return () => resize.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full overflow-hidden rounded-2xl border border-border bg-surface"
      style={{ aspectRatio: STAGE_W / STAGE_H }}
    >
      {shouldLoad ? (
        <iframe
          title="Walkthrough"
          src={src}
          loading="lazy"
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
          style={{
            width: STAGE_W,
            height: STAGE_H,
            transform: `scale(${scale})`,
            opacity: scale ? 1 : 0,
            transition: "opacity 200ms ease",
          }}
        />
      ) : null}
    </div>
  );
}
