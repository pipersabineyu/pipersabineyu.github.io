"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Each prototype HTML already draws its own device chrome on its own stage,
// and those stages disagree with each other: bezel widths differ by ~10px,
// and one stage is taller than the 980px we used to assume, so it rendered
// clipped at the top and bottom. Scaling the iframe by a single hardcoded
// ratio can't reconcile that.
//
// Instead the iframe is laid out at a deliberately oversized logical stage —
// big enough that no prototype has to reflow into a cramped viewport — and
// once it settles we measure the device bezel inside it (same origin, so the
// document is readable) and pick the scale and offset that land every
// prototype's bezel at the same rendered width, centered in the box.
const STAGE_W = 620;
const STAGE_H = 1120;

// Widest the box ever gets, and the breathing room inside it. Shadows from
// the prototypes' own device chrome spill past the bezel, so the padding is
// what keeps them from touching the box edge.
const MAX_BOX_WIDTH = 460;
const BOX_PADDING = 28;

// Nominal bezel aspect (a 393x852 screen in a ~14px bezel), used to give the
// box a stable aspect ratio so its height is reserved before measurement
// lands. A device taller than this is scaled to fit rather than clipped.
const DEVICE_ASPECT = 880 / 421;
const BOX_ASPECT =
  (MAX_BOX_WIDTH - BOX_PADDING * 2) /
  ((MAX_BOX_WIDTH - BOX_PADDING * 2) * DEVICE_ASPECT + BOX_PADDING * 2);

type Fit = { scale: number; x: number; y: number };

// The bezel is always within a few levels of <body> (stage wrapper, then the
// device), so a shallow breadth-first walk finds it without touching the
// thousands of nodes some of these prototypes render inside the screen.
const MAX_DEPTH = 5;

function findBezel(doc: Document) {
  let best: DOMRect | null = null;
  let level: Element[] = doc.body ? [doc.body] : [];

  for (let depth = 0; depth < MAX_DEPTH && level.length; depth++) {
    const next: Element[] = [];
    for (const el of level) {
      const rect = el.getBoundingClientRect();
      const radius =
        parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      // A phone: portrait, substantial, and visibly rounded.
      if (radius >= 24 && rect.width >= 200 && rect.height > rect.width) {
        if (!best || rect.width > best.width) best = rect;
      }
      for (const child of el.children) next.push(child);
    }
    level = next;
  }
  return best;
}

// Each prototype gets its own bg-surface stage (the same gray used for
// phone prototypes in case studies) rather than sharing one — makes each
// feel like a distinct artifact instead of one grouped set.
export function PrototypeFrame({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [fit, setFit] = useState<Fit | null>(null);

  useEffect(() => {
    const el = boxRef.current;
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

  const measure = useCallback(() => {
    const box = boxRef.current;
    const iframe = iframeRef.current;
    if (!box || !iframe) return;

    let doc: Document | null = null;
    try {
      doc = iframe.contentDocument;
    } catch {
      return;
    }
    if (!doc?.body) return;

    const bezel =
      findBezel(doc) ??
      new DOMRect(0, 0, doc.body.scrollWidth, doc.body.scrollHeight);
    if (!bezel.width || !bezel.height) return;

    const innerW = box.clientWidth - BOX_PADDING * 2;
    const innerH = box.clientHeight - BOX_PADDING * 2;
    // Fit on width so every prototype matches, but never at the cost of
    // cropping an unusually tall device.
    const scale = Math.min(innerW / bezel.width, innerH / bezel.height);

    setFit({
      scale,
      x: BOX_PADDING + (innerW - bezel.width * scale) / 2 - bezel.left * scale,
      y: BOX_PADDING + (innerH - bezel.height * scale) / 2 - bezel.top * scale,
    });
  }, []);

  // These prototypes are self-unpacking bundles: they finish by swapping in
  // their real document, which fires load again. Re-measuring on each load
  // (plus a couple of beats after, for fonts and entry animations that
  // settle late) is what keeps the fit correct rather than locked to the
  // placeholder that was there first.
  useEffect(() => {
    if (!shouldLoad) return;
    const timers = [400, 1200, 2500].map((ms) => setTimeout(measure, ms));
    return () => timers.forEach(clearTimeout);
  }, [shouldLoad, measure]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const resize = new ResizeObserver(() => measure());
    resize.observe(box);
    return () => resize.disconnect();
  }, [measure]);

  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className="group mx-auto block w-full"
      style={{ maxWidth: MAX_BOX_WIDTH }}
    >
      <div
        ref={boxRef}
        className="relative w-full overflow-hidden rounded-3xl border border-border bg-surface transition-colors group-hover:border-foreground/20"
        style={{ aspectRatio: BOX_ASPECT }}
      >
        {shouldLoad ? (
          <iframe
            ref={iframeRef}
            title={title}
            src={src}
            tabIndex={-1}
            onLoad={measure}
            className="pointer-events-none absolute left-0 top-0 origin-top-left border-0 bg-transparent"
            style={{
              width: STAGE_W,
              height: STAGE_H,
              transform: fit
                ? `translate(${fit.x}px, ${fit.y}px) scale(${fit.scale})`
                : undefined,
              // Nothing to show until the fit is known — an unscaled 620px
              // stage flashing at full size would be worse than a beat of
              // empty box.
              opacity: fit ? 1 : 0,
              transition: "opacity 200ms ease",
            }}
          />
        ) : null}
      </div>
      <p className="mt-4 text-center text-[13px] text-muted transition-colors group-hover:text-foreground">
        {title}
      </p>
    </a>
  );
}
