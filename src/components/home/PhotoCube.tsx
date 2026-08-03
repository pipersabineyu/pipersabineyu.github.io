"use client";

/**
 * PhotoCube — a rotating 3×3 photo cube.
 *
 * One source image is diced into 54 black-and-white crops (varied zoom, angle,
 * flip, exposure, grain) and laid onto the six faces of a CSS-3D cube.
 * Tiles are flat 2D images arranged in 3D — there is a visible gap between them.
 *
 * Self-contained: no dependencies beyond React, no CSS files, no design-system imports.
 *
 * Drop-in usage inside CenterStage:
 *
 *   import PhotoCube from './PhotoCube';
 *   import photo from './photo.png';
 *   <PhotoCube src={photo} progress={progress} size={420} />
 *
 * The defaults below (seed 891707475, grain 14, tileRadius 3, photo.png) reproduce
 * the exact frame signed off in design — same crops, same angles, same grain.
 * Change `seed` to get a different arrangement of the same photo.
 *
 * - Omit `progress` and it spins on its own + responds to drag.
 * - Pass `progress` (0→1, the same value the surfers use) and scroll drives a
 *   base rotation (0 = front face, 1 = one full revolution) — drag still works
 *   on top of it, adding its own momentum, same as free-running mode.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface PhotoCubeProps {
  /** Image URL, imported asset, or data URL. Must be same-origin or CORS-enabled. */
  src?: string;
  /** Deterministic shuffle. The same seed + photo always yields the same 54 crops. */
  seed?: number;
  /** 0→1 scroll driver, sets a base rotation. Drag still works on top of it. */
  progress?: number;
  /** Full revolutions across progress 0→1. Default 1. */
  turns?: number;
  /** Cube edge length in px. Default 420. */
  size?: number;
  /** Gap between tiles in px. Default 10. */
  gap?: number;
  /** Tile corner radius in px. Default 2. */
  tileRadius?: number;
  /** Idle rotation, deg/frame. Default 0.22. Ignored when `progress` is set. */
  spinSpeed?: number;
  /** Duration (ms) of the one-time ease when `progress` first replaces free
   * spin. Match this to any concurrent size animation so rotation and scale
   * finish in lockstep instead of drifting apart. Default 450. */
  settleDuration?: number;
  /** Allow pointer drag to rotate. Default true. Works alongside `progress`. */
  draggable?: boolean;
  /** Film grain amount, 0–70. Default 26. */
  grain?: number;
  /** Contrast multiplier applied with grayscale. Default 1.18. */
  contrast?: number;
  /** Max crop zoom. 1 = full frame, 3.4 = tight detail crops. Default 3.4. */
  zoomRange?: number;
  /** Colour behind the tile gaps. Default '#0f0f0f'. */
  coreColor?: string;
  /** Re-dice the crops when this value changes. */
  shuffleKey?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

const FACES = 6;
const PER_FACE = 9;
const TOTAL = FACES * PER_FACE;
const TILE_PX = 256;

const FACE_TRANSFORMS = [
  'translateZ(HALFpx)',
  'rotateY(90deg) translateZ(HALFpx)',
  'rotateY(180deg) translateZ(HALFpx)',
  'rotateY(-90deg) translateZ(HALFpx)',
  'rotateX(90deg) translateZ(HALFpx)',
  'rotateX(-90deg) translateZ(HALFpx)',
];

/** mulberry32 — matches the generator in the design source, so a seed reproduces its frame. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeCanvas(w: number, h = w) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

function applyGrain(ctx: CanvasRenderingContext2D, s: number, amount: number, rnd: () => number) {
  if (amount <= 0) return;
  const d = ctx.getImageData(0, 0, s, s);
  const p = d.data;
  for (let i = 0; i < p.length; i += 4) {
    const n = (rnd() - 0.5) * amount * 2;
    p[i] += n;
    p[i + 1] += n;
    p[i + 2] += n;
  }
  ctx.putImageData(d, 0, 0);
}

function applyVignette(ctx: CanvasRenderingContext2D, s: number) {
  const g = ctx.createRadialGradient(s / 2, s / 2, s * 0.25, s / 2, s / 2, s * 0.72);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,0.28)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
}

/** Diced black-and-white crops of one image, generated off-thread-ish in slices. */
function useCrops(
  src: string | undefined,
  opts: { grain: number; contrast: number; zoomRange: number; seed: number; shuffleKey?: string | number }
) {
  const [tiles, setTiles] = useState<string[]>([]);
  const { grain, contrast, zoomRange, seed, shuffleKey } = opts;

  useEffect(() => {
    let cancelled = false;
    if (!src) {
      setTiles([]);
      return;
    }
    (async () => {
      let img: HTMLImageElement;
      try {
        img = await loadImage(src);
      } catch {
        return;
      }
      if (cancelled) return;

      const base = Math.min(img.width, img.height);
      // Single stream for the whole cube — call order below must not change or the seed drifts.
      const rnd = mulberry32(seed);
      const out: string[] = [];
      for (let i = 0; i < TOTAL; i++) {
        if (cancelled) return;
        const c = makeCanvas(TILE_PX);
        const ctx = c.getContext('2d')!;
        // Bias toward tighter crops so most tiles read as detail, a few as full frame.
        const zoom = 1.05 + Math.pow(rnd(), 1.7) * (zoomRange - 1.05);
        const cs = base / zoom;
        const sx = rnd() * Math.max(0, img.width - cs);
        const sy = rnd() * Math.max(0, img.height - cs);
        const quarter = rnd() < 0.28 ? (1 + Math.floor(rnd() * 3)) * 90 : 0;
        const tilt = (rnd() - 0.5) * 16;
        const rot = ((quarter + tilt) * Math.PI) / 180;
        const flip = rnd() < 0.22 ? -1 : 1;
        const over = 1 + Math.abs(Math.sin(rot)) * 0.55; // overdraw so rotation never shows corners
        const bright = 0.94 + rnd() * 0.22;

        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, TILE_PX, TILE_PX);
        ctx.save();
        ctx.translate(TILE_PX / 2, TILE_PX / 2);
        ctx.rotate(rot);
        ctx.scale(flip, 1);
        ctx.filter = `grayscale(1) contrast(${contrast.toFixed(2)}) brightness(${bright.toFixed(2)})`;
        ctx.drawImage(img, sx, sy, cs, cs, (-TILE_PX * over) / 2, (-TILE_PX * over) / 2, TILE_PX * over, TILE_PX * over);
        ctx.restore();
        ctx.filter = 'none';
        applyGrain(ctx, TILE_PX, grain, rnd);
        applyVignette(ctx, TILE_PX);
        out.push(c.toDataURL('image/jpeg', 0.84));

        if (i % 9 === 8) {
          setTiles(out.slice());
          await new Promise((r) => setTimeout(r, 0)); // yield so the cube paints face by face
        }
      }
      if (!cancelled) setTiles(out);
    })();
    return () => {
      cancelled = true;
    };
  }, [src, grain, contrast, zoomRange, seed, shuffleKey]);

  return tiles;
}

export default function PhotoCube({
  src,
  seed = 891707475,
  progress,
  turns = 1,
  size = 420,
  gap = 10,
  tileRadius = 3,
  spinSpeed = 0.22,
  settleDuration = 450,
  draggable = true,
  grain = 14,
  contrast = 1.18,
  zoomRange = 3.4,
  coreColor = '#0f0f0f',
  shuffleKey,
  className,
  style,
}: PhotoCubeProps) {
  const tiles = useCrops(src, { grain, contrast, zoomRange, seed, shuffleKey });
  const cubeRef = useRef<HTMLDivElement>(null);
  const hasScroll = typeof progress === 'number';

  // Scroll-driven base rotation — a slowly turning "dial" set directly by progress.
  const base = useRef({ rx: -16, ry: -30 });
  // Drag/momentum offset, layered on top of the base. Always live, scroll or not,
  // so scrolling and tossing the cube both work at the same time.
  const offset = useRef({ rx: 0, ry: 0, vx: 0, vy: 0 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const half = size / 2;

  // Tracks whether the *previous* render was scroll-driven, so we can tell
  // "just started following progress" (free-spin -> controlled) apart from
  // "still following progress" (an ordinary scroll update).
  const wasScrollDriven = useRef(false);
  const settleRaf = useRef(0);

  useEffect(() => {
    if (!hasScroll) {
      wasScrollDriven.current = false;
      return;
    }
    const p = progress as number;
    const targetRy = -30 + p * 360 * turns;
    const targetRx = -16 + Math.sin(p * Math.PI * 2) * 10;

    if (!wasScrollDriven.current) {
      // First time this cube picks up a progress value — ease into the
      // target angle instead of snapping, so a free-spinning cube (e.g. the
      // loading screen's) settles smoothly rather than jumping. Fold the
      // idle-spin offset into the starting angle and zero it out — it never
      // decays on its own (only drag momentum does), so left alone it would
      // sit there permanently added on top of the settled base rotation.
      cancelAnimationFrame(settleRaf.current);
      const fromRx = base.current.rx + offset.current.rx;
      const fromRy = base.current.ry + offset.current.ry;
      offset.current.rx = 0;
      offset.current.ry = 0;
      offset.current.vx = 0;
      offset.current.vy = 0;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / settleDuration);
        // Quintic-out — matches the easing typically used for a concurrent
        // size animation (e.g. the loading screen's grow), so a consumer
        // that sets settleDuration to the same value gets visually locked,
        // synchronized motion instead of two independently-shaped curves.
        const e = 1 - Math.pow(1 - t, 5);
        base.current.rx = fromRx + (targetRx - fromRx) * e;
        base.current.ry = fromRy + (targetRy - fromRy) * e;
        if (t < 1) settleRaf.current = requestAnimationFrame(step);
      };
      settleRaf.current = requestAnimationFrame(step);
    } else {
      base.current.ry = targetRy;
      base.current.rx = targetRx;
    }
    wasScrollDriven.current = true;

    return () => cancelAnimationFrame(settleRaf.current);
  }, [progress, turns, hasScroll, settleDuration]);

  // Unified loop: applies drag momentum decay (and idle autospin when not
  // scroll-driven), then composes base + offset into the final transform.
  useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const el = cubeRef.current;
      if (!el) return;
      const o = offset.current;
      if (!dragging.current) {
        o.ry += o.vy;
        o.rx += o.vx;
        o.vy *= 0.945;
        o.vx *= 0.945;
        if (Math.abs(o.vy) < 0.02) o.vy = 0;
        if (Math.abs(o.vx) < 0.02) o.vx = 0;
        if (!hasScroll) o.ry += spinSpeed;
      }
      const bob = hasScroll ? 0 : Math.sin(now / 2600) * 3.2;
      const rx = Math.max(-78, Math.min(78, base.current.rx + o.rx)) + bob;
      const ry = base.current.ry + o.ry;
      el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hasScroll, spinSpeed]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!draggable) return;
      e.preventDefault();
      dragging.current = true;
      last.current = { x: e.clientX, y: e.clientY };
      offset.current.vx = 0;
      offset.current.vy = 0;

      const move = (ev: PointerEvent) => {
        if (!dragging.current) return;
        const dx = ev.clientX - last.current.x;
        const dy = ev.clientY - last.current.y;
        last.current = { x: ev.clientX, y: ev.clientY };
        offset.current.ry += dx * 0.35;
        offset.current.rx -= dy * 0.35;
        offset.current.vy = dx * 0.35;
        offset.current.vx = -dy * 0.35;
      };
      const up = () => {
        dragging.current = false;
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    },
    [draggable]
  );

  const faceGrid: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gap: `${gap}px`,
    backfaceVisibility: 'hidden',
  };

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        perspective: '1700px',
        perspectiveOrigin: '50% 46%',
        cursor: !draggable ? 'default' : 'grab',
        touchAction: 'none',
        userSelect: 'none',
        ...style,
      }}
      onPointerDown={onPointerDown}
    >
      <div ref={cubeRef} style={{ position: 'relative', width: size, height: size, transformStyle: 'preserve-3d', willChange: 'transform' }}>
        {/* Solid core so the gaps between tiles never see through the cube. */}
        {FACE_TRANSFORMS.map((t, i) => (
          <div
            key={`core-${i}`}
            style={{
              position: 'absolute',
              inset: gap * 1.8,
              background: coreColor,
              transform: t.replace(/HALF/g, String(half - 18)),
            }}
          />
        ))}

        {FACE_TRANSFORMS.map((t, f) => (
          <div key={`face-${f}`} style={{ ...faceGrid, transform: t.replace(/HALF/g, String(half)) }}>
            {Array.from({ length: PER_FACE }, (_, i) => {
              const tile = tiles[f * PER_FACE + i];
              return (
                <div
                  key={i}
                  style={{
                    overflow: 'hidden',
                    borderRadius: tileRadius,
                    background: '#111',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.08)',
                  }}
                >
                  {tile ? (
                    <img
                      src={tile}
                      alt=""
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
