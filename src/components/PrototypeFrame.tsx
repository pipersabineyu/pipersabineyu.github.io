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
//
// 800 (not 620) because one prototype lays out an explanation panel next to
// the phone rather than just the phone alone — under 800px that two-column
// layout wraps/overlaps instead of sitting side by side. The extra width is
// harmless for single-phone prototypes; they just get more empty margin
// around them, which findBezel crops away regardless.
const STAGE_W = 800;
const STAGE_H = 1120;

// Widest the box ever gets, and the breathing room inside it. Sized so two
// side by side (with the grid's gap-x-6) fit exactly inside the page's
// max-w-4xl container, matching the About page's width. No background/
// border on the box itself — the padding just keeps the device from
// touching the edge of its own invisible layout box.
const MAX_BOX_WIDTH = 408;
const BOX_PADDING = 16;

// Nominal bezel aspect (a 393x852 screen in a ~14px bezel), used to give the
// box a stable aspect ratio so its height is reserved before measurement
// lands. A device taller than this is scaled to fit rather than clipped.
const DEVICE_ASPECT = 880 / 421;
const BOX_ASPECT =
  (MAX_BOX_WIDTH - BOX_PADDING * 2) /
  ((MAX_BOX_WIDTH - BOX_PADDING * 2) * DEVICE_ASPECT + BOX_PADDING * 2);

type Frame = { left: number; top: number; width: number; height: number; radius: number; k: number };
type Fit = { scale: number; x: number; y: number; clip: string; frame: Frame | null };

// Matches PhoneFrame.tsx's own bezel proportions (padding 10, outer radius
// 41.6, inner screen radius 32, at its BASE_WIDTH of 260) so a synthetic
// bezel drawn here looks like the same device as the ones case studies use,
// just scaled to whatever size the found screen ends up rendering at.
const BEZEL_PAD_RATIO = 10 / 260;
const BEZEL_RADIUS_RATIO = 41.6 / 260;
const SCREEN_RADIUS_RATIO = 32 / 260;

// Stage-pixel slack kept around the bezel when clipping — just enough to
// avoid clipping the bezel's own rounded corner. Any more than this let the
// device chrome's drop shadow bleed partway into view and then get cut off
// hard at the clip edge; excluding it entirely reads better than a
// truncated sliver of it.
const CLIP_MARGIN = 1;

// Same refresh glyph as the home page's "Replay intro" control, so the two
// replay affordances read as the same action across the site.
function ReplayIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <polyline points="21 3 21 9 15 9" />
    </svg>
  );
}

// The bezel is always within a few levels of <body>, so a shallow
// breadth-first walk finds it without touching the thousands of nodes some
// of these prototypes render inside the screen. One prototype nests it 7
// levels down (extra wrapper divs from its own layout/animation library),
// so this needs enough headroom for that without going deep enough to
// start walking into the screen's actual content.
const MAX_DEPTH = 9;

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

export function PrototypeFrame({
  src,
  title,
  drawBezel = false,
}: {
  src: string;
  title: string;
  /** Draws a synthetic phone bezel around the found screen, for prototypes
   * that don't already render their own device chrome. */
  drawBezel?: boolean;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [fit, setFit] = useState<Fit | null>(null);
  // Bumping this remounts the iframe (fresh `key`), which is a reliable way
  // to restart a self-contained prototype from its own beginning — reusing
  // the same DOM node's `src` isn't guaranteed to force a reload.
  const [reloadKey, setReloadKey] = useState(0);

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
    // When drawing our own bezel, the found "bezel" is really just the raw
    // screen — reserve room around it (shrinking the target area) so a
    // synthetic frame can wrap around the screen without overflowing the box.
    const marginFactor = drawBezel ? 1 + BEZEL_PAD_RATIO * 2 : 1;
    // Fit on width so every prototype matches, but never at the cost of
    // cropping an unusually tall device.
    const scale = Math.min(
      innerW / marginFactor / bezel.width,
      innerH / marginFactor / bezel.height
    );

    // Some prototypes lay out other content (an explanation panel, extra
    // screens) right next to the bezel on the same oversized stage. Fitting
    // by whichever dimension is more constraining leaves slack in the
    // other — and without a clip, that slack reveals whatever's next to the
    // bezel instead of empty space. Clipping the iframe to a margin around
    // the bezel itself (in the iframe's own untransformed coordinates, so
    // the transform below scales the clip along with everything else)
    // keeps only the device visible regardless of that leftover slack.
    //
    // When drawing our own bezel, the source screen is a flat rectangle —
    // rounding the clip itself (in the same untransformed units, so it
    // scales along with everything else) is what gives it corners matching
    // the synthetic bezel's inner cutout, instead of a rounded frame around
    // a screen with square corners poking past it.
    const screenRadius = drawBezel ? (bezel.width * SCREEN_RADIUS_RATIO) : 0;
    const clip = `inset(${Math.max(0, bezel.top - CLIP_MARGIN)}px ${Math.max(
      0,
      STAGE_W - bezel.right - CLIP_MARGIN
    )}px ${Math.max(0, STAGE_H - bezel.bottom - CLIP_MARGIN)}px ${Math.max(
      0,
      bezel.left - CLIP_MARGIN
    )}px${screenRadius ? ` round ${screenRadius}px` : ""})`;

    let frame: Frame | null = null;
    if (drawBezel) {
      const screenLeft = BOX_PADDING + (innerW - bezel.width * scale) / 2;
      const screenTop = BOX_PADDING + (innerH - bezel.height * scale) / 2;
      const screenWidth = bezel.width * scale;
      const screenHeight = bezel.height * scale;
      const k = screenWidth / 260;
      const pad = 260 * BEZEL_PAD_RATIO * k;
      frame = {
        left: screenLeft - pad,
        top: screenTop - pad,
        width: screenWidth + pad * 2,
        height: screenHeight + pad * 2,
        radius: 260 * BEZEL_RADIUS_RATIO * k,
        k,
      };
    }

    setFit({
      scale,
      clip,
      frame,
      x: BOX_PADDING + (innerW - bezel.width * scale) / 2 - bezel.left * scale,
      y: BOX_PADDING + (innerH - bezel.height * scale) / 2 - bezel.top * scale,
    });
  }, [drawBezel]);

  // These prototypes are self-unpacking bundles: they finish by swapping in
  // their real document, which fires load again. Re-measuring on each load
  // (plus a couple of beats after, for fonts and entry animations that
  // settle late) is what keeps the fit correct rather than locked to the
  // placeholder that was there first.
  // Re-runs the same settle-in retry timers a fresh load gets, so a manual
  // replay re-fits the bezel exactly like the first load did.
  useEffect(() => {
    if (!shouldLoad) return;
    const timers = [400, 1200, 2500].map((ms) => setTimeout(measure, ms));
    return () => timers.forEach(clearTimeout);
  }, [shouldLoad, measure, reloadKey]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const resize = new ResizeObserver(() => measure());
    resize.observe(box);
    return () => resize.disconnect();
  }, [measure]);

  const replay = useCallback(() => {
    setFit(null);
    setReloadKey((k) => k + 1);
  }, []);

  return (
    <div className="group relative mx-auto w-full" style={{ maxWidth: MAX_BOX_WIDTH }}>
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-3xl"
      >
        <div
          ref={boxRef}
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: BOX_ASPECT }}
        >
          {fit?.frame && (
            <div
              className="pointer-events-none absolute bg-[#141414]"
              style={{
                left: fit.frame.left,
                top: fit.frame.top,
                width: fit.frame.width,
                height: fit.frame.height,
                borderRadius: fit.frame.radius,
                opacity: fit ? 1 : 0,
                transition: "opacity 200ms ease",
              }}
            >
              <div
                className="absolute rounded-l bg-[#141414]"
                style={{
                  left: -2 * fit.frame.k,
                  top: 96 * fit.frame.k,
                  height: 28 * fit.frame.k,
                  width: 3 * fit.frame.k,
                }}
              />
              <div
                className="absolute rounded-l bg-[#141414]"
                style={{
                  left: -2 * fit.frame.k,
                  top: 144 * fit.frame.k,
                  height: 44 * fit.frame.k,
                  width: 3 * fit.frame.k,
                }}
              />
              <div
                className="absolute rounded-r bg-[#141414]"
                style={{
                  right: -2 * fit.frame.k,
                  top: 112 * fit.frame.k,
                  height: 56 * fit.frame.k,
                  width: 3 * fit.frame.k,
                }}
              />
            </div>
          )}
          {shouldLoad ? (
            <iframe
              key={reloadKey}
              ref={iframeRef}
              title={title}
              src={src}
              tabIndex={-1}
              onLoad={measure}
              className="pointer-events-none absolute left-0 top-0 origin-top-left border-0 bg-transparent"
              style={{
                width: STAGE_W,
                height: STAGE_H,
                clipPath: fit?.clip,
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
          {fit?.frame && (
            <div
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full bg-[#141414]"
              style={{
                top: fit.frame.top + 260 * BEZEL_PAD_RATIO * fit.frame.k + 8 * fit.frame.k,
                height: 20 * fit.frame.k,
                width: 80 * fit.frame.k,
              }}
            />
          )}
        </div>
        <p className="px-5 pb-5 pt-3 text-center text-[13px] text-muted transition-colors group-hover:text-foreground">
          {title}
        </p>
      </a>
      <button
        type="button"
        onClick={replay}
        aria-label="Replay prototype"
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/60 text-subtle backdrop-blur-md transition-colors hover:text-foreground"
      >
        <ReplayIcon />
      </button>
    </div>
  );
}
