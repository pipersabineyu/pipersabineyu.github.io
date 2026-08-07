"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { projects, type Project } from "@/lib/projects";
import { PhoneFrame } from "@/components/PhoneFrame";
import PhotoCube from "./PhotoCube";
import { TOTAL, SEG, MARGIN, segmentOpacity } from "./segmentOpacity";

// A diagonal open/view arrow (white halo behind ink so it reads on any
// photo), used as the cursor over a project cover to hint it's clickable.
const OPEN_CURSOR =
  "url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDM2IDM2Ij48ZyBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZmlsbD0ibm9uZSI+PGxpbmUgeDE9IjEwIiB5MT0iMjYiIHgyPSIyNiIgeTI9IjEwIi8+PHBvbHlsaW5lIHBvaW50cz0iMTQgMTAgMjYgMTAgMjYgMjIiLz48L2c+PGcgc3Ryb2tlPSIjMjExZjFjIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJub25lIj48bGluZSB4MT0iMTAiIHkxPSIyNiIgeDI9IjI2IiB5Mj0iMTAiLz48cG9seWxpbmUgcG9pbnRzPSIxNCAxMCAyNiAxMCAyNiAyMiIvPjwvZz48L3N2Zz4=\") 10 26, pointer";

function opacityAt(p: number, i: number) {
  const start = i * SEG;
  const end = (i + 1) * SEG;
  const isFirst = i === 0;
  const isLast = i === TOTAL - 1;

  const points = [
    isFirst ? 0 : start,
    Math.min(start + MARGIN, end),
    Math.max(end - MARGIN, start),
    isLast ? 1 : end,
  ];
  const values = [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0];

  return segmentOpacity(p, points, values);
}

function useLayerOpacity(progress: MotionValue<number>, i: number) {
  const [opacity, setOpacity] = useState(() => opacityAt(progress.get(), i));
  useMotionValueEvent(progress, "change", (latest) => {
    setOpacity(opacityAt(latest, i));
  });
  return opacity;
}

// Below this the text sits below the cube (stacked); at or above, text sits
// to the left and the cube is centered in the full viewport (side-by-side).
// Matches Tailwind's `lg:` breakpoint — keep FixedUI's blockPosition and
// this file's own pb-28/pb-20 switches on the same one.
const SIDE_BY_SIDE_MIN_WIDTH = 1024;
// FixedUI's left-8 (32px) + its max-w-[280px] text column, side-by-side.
const TEXT_RIGHT_EDGE = 312;
// Stacked layout: FixedUI's bottom offset (80px + a safe-area allowance) +
// the two-line intro/work text block.
const TEXT_BLOCK_HEIGHT = 140;
const SAFETY_MARGIN = 28;

// The cube is draggable up to rx=±78°, and ry freely — at extreme angles
// its projected (2D screen) bounding box is much bigger than its flat edge
// length, especially with real CSS perspective. Numerically sweeping every
// (rx, ry) combination the drag/spin can reach gives a worst-case
// half-extent of ~0.80x (horizontal) / ~0.89x (vertical) the edge length,
// not the naive 0.5x a flat, unrotated square would use.
const WORST_X_RATIO = 0.85;
const WORST_Y_RATIO = 0.9;

// Keeps the cube from ever reaching the fixed text, at any breakpoint and
// any rotation the user can drag it to — not just from overflowing the
// viewport. The 3D face math needs an actual px number, so this can't just
// be done with a CSS max-width.
function useCubeSize() {
  const [size, setSize] = useState(420);
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const preferred = Math.min(420, vw * 0.68);

      const safeCap =
        vw < SIDE_BY_SIDE_MIN_WIDTH
          ? // Stacked: cube center is shifted up by half of pb-28 (56px);
            // its worst-case bottom edge must still clear the text below it.
            (vh / 2 - 56 - TEXT_BLOCK_HEIGHT - SAFETY_MARGIN) / WORST_Y_RATIO
          : // Side-by-side: cube is centered in the full viewport; its
            // worst-case left edge must still clear the text on the left.
            (vw / 2 - TEXT_RIGHT_EDGE - SAFETY_MARGIN) / WORST_X_RATIO;

      setSize(Math.max(120, Math.min(preferred, safeCap)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}

function DesignLayer({
  progress,
  imageSrc,
}: {
  progress: MotionValue<number>;
  imageSrc?: string;
}) {
  const opacity = useLayerOpacity(progress, 0);
  const size = useCubeSize();

  // Segment-local progress (0→1 across just this first segment) drives the
  // cube's base rotation as you scroll; dragging still adds momentum on top.
  const [cubeProgress, setCubeProgress] = useState(() =>
    Math.min(1, Math.max(0, progress.get() / SEG))
  );
  useMotionValueEvent(progress, "change", (latest) => {
    setCubeProgress(Math.min(1, Math.max(0, latest / SEG)));
  });

  // "Replay intro" only restarts the loading screen's own mini cube — this is
  // the real cube underneath, which otherwise keeps whatever drag offset the
  // user left it at forever (drag momentum decays, but the offset itself
  // never resets on its own). Snap it back to its base orientation in sync.
  const [resetSignal, setResetSignal] = useState(0);
  useEffect(() => {
    const handler = () => setResetSignal((n) => n + 1);
    window.addEventListener("piper:replay-intro", handler);
    return () => window.removeEventListener("piper:replay-intro", handler);
  }, []);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pb-28 lg:pb-0"
      style={{ opacity, pointerEvents: opacity > 0.02 ? "auto" : "none" }}
    >
      <PhotoCube
        src={imageSrc}
        progress={cubeProgress}
        size={size}
        resetSignal={resetSignal}
      />
    </div>
  );
}

// Two prototype clips shown upright and spaced apart in front of the
// blurred cover photo behind them — same PhoneFrame device bezel used on
// the case study pages, so a prototype reads the same way wherever it
// shows up on the site, not as a bare clipped rectangle here and a full
// device frame there.
//
// Sized off HEIGHT, not width. The card is a fixed aspect-[4/3], but a
// phone is a much taller aspect-[9/19.5] — sizing width to a percentage
// of the card ignores that the card's height is the tighter constraint,
// so the phone ends up taller than the card and gets clipped by its
// overflow-hidden. Deriving width from a height percentage (via
// aspect-ratio) keeps it inside the card at any card size instead.
function ProjectPrototypes({
  clips,
}: {
  clips: [{ src: string; poster: string }, { src: string; poster: string }];
}) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-6 sm:gap-10">
      {clips.map((clip) => (
        <div
          key={clip.src}
          className="relative aspect-[9/19.5] h-[92%] max-h-[420px]"
        >
          <PhoneFrame src={clip.src} poster={clip.poster} showNotch={false} />
        </div>
      ))}
    </div>
  );
}

function ProjectLayer({
  progress,
  index,
  project,
}: {
  progress: MotionValue<number>;
  index: number;
  project: Project;
}) {
  const opacity = useLayerOpacity(progress, index + 1);
  const prototypes = project.homePrototypes;
  return (
    <div
      className="absolute inset-0 flex items-center justify-center p-6 pb-20 lg:p-16"
      style={{ opacity, pointerEvents: opacity > 0.02 ? "auto" : "none" }}
    >
      <Link
        href={`/work/${project.slug}`}
        className="relative block aspect-[4/3] w-full max-w-3xl overflow-hidden rounded-2xl shadow-[0_30px_80px_-30px_rgba(20,20,20,0.3)]"
        style={{ cursor: OPEN_CURSOR }}
      >
        <Image
          src={project.cover}
          alt=""
          fill
          sizes="(min-width: 1024px) 768px, 90vw"
          className={`object-cover ${prototypes ? "scale-110 blur-md" : ""}`}
        />
        {prototypes && <ProjectPrototypes clips={prototypes} />}
      </Link>
    </div>
  );
}

export function CenterStage({
  progress,
  imageSrc,
}: {
  progress: MotionValue<number>;
  imageSrc?: string;
}) {
  return (
    <>
      <DesignLayer progress={progress} imageSrc={imageSrc} />
      {projects.map((project, i) => (
        <ProjectLayer
          key={project.slug}
          progress={progress}
          index={i}
          project={project}
        />
      ))}
    </>
  );
}
