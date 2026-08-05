"use client";

import { useEffect, useRef, useState } from "react";

// Every fixed measurement below (corner radius, padding, notch, side
// buttons) was tuned by eye at this width. Reused elsewhere at a smaller
// width — e.g. the home page's prototype pair — those pixel values no
// longer scale with the frame, so the notch/buttons land in the wrong
// place and the corners look disproportionately round. `scale` (measured
// off the frame's own rendered width via ResizeObserver) keeps every
// decorative element proportional at any size instead of just this one.
const BASE_WIDTH = 260;

// The `src` attribute is only added once the frame scrolls near the
// viewport — with a case study now carrying up to ten of these, loading
// every video up front on page load would undercut the site's lightweight
// feel. The poster still renders immediately so nothing looks broken while
// waiting to scroll into range.
export function PhoneFrame({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [scale, setScale] = useState(1);

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
      setScale(entry.contentRect.width / BASE_WIDTH);
    });
    resize.observe(el);
    return () => resize.disconnect();
  }, []);

  const px = (n: number) => `${n * scale}px`;

  return (
    <div
      ref={wrapperRef}
      className={`relative mx-auto aspect-[9/19.5] w-full max-w-[260px] bg-[#141414] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.3)] ${className}`}
      style={{ borderRadius: px(41.6), padding: px(10) }}
    >
      <div
        className="relative h-full w-full overflow-hidden bg-black"
        style={{ borderRadius: px(32) }}
      >
        {shouldLoad ? (
          <video
            className="h-full w-full object-cover"
            src={src}
            poster={poster}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full bg-[#141414]"
          style={{ top: px(8), height: px(20), width: px(80) }}
        />
      </div>
      <div
        className="absolute rounded-l bg-[#141414]"
        style={{ left: px(-2), top: px(96), height: px(28), width: px(3) }}
      />
      <div
        className="absolute rounded-l bg-[#141414]"
        style={{ left: px(-2), top: px(144), height: px(44), width: px(3) }}
      />
      <div
        className="absolute rounded-r bg-[#141414]"
        style={{ right: px(-2), top: px(112), height: px(56), width: px(3) }}
      />
    </div>
  );
}
