"use client";

import { useState } from "react";
import Link from "next/link";
import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { projects } from "@/lib/projects";
import { SEG, MARGIN, segmentOpacity } from "./segmentOpacity";

// Same fade-in/plateau/fade-out shape (and the same MARGIN) as the project
// crossfades in CenterStage, so this handoff feels identical to those.
function introOpacityAt(p: number) {
  const end = SEG;
  const points = [0, Math.min(MARGIN, end), Math.max(end - MARGIN, 0), end];
  return segmentOpacity(p, points, [1, 1, 1, 0]);
}

function workOpacityAt(p: number) {
  const start = SEG;
  const end = 1;
  const points = [start, start + MARGIN, end - MARGIN, end];
  return segmentOpacity(p, points, [0, 1, 1, 1]);
}

// How far past the pinned section (0→1) before the work text is fully gone.
// Quick — it shouldn't linger once you've moved on to the plain work list.
function exitFadeAt(p: number) {
  return 1 - Math.min(1, p / 0.3);
}

// bottom-20 (not bottom-12) plus env(safe-area-inset-bottom) — on tablets the
// old 48px sat close enough to the true edge that browser chrome/the safe
// area could eat into it, requiring a scroll to see the rest of the text
// even though nothing was actually overlapping the cube above it.
const blockPosition =
  "absolute inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] px-6 text-center " +
  "lg:inset-x-auto lg:bottom-auto lg:left-8 lg:top-1/2 lg:-translate-y-1/2 lg:px-0 lg:text-left";

function ReplayButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("piper:replay-intro"))}
      className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.14em] text-subtle backdrop-blur-md transition-colors hover:text-foreground"
    >
      <svg
        width="12"
        height="12"
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
      Replay intro
    </button>
  );
}

export function FixedUI({
  progress,
  exitProgress,
}: {
  progress: MotionValue<number>;
  exitProgress: MotionValue<number>;
}) {
  const [index, setIndex] = useState(0);
  const [introOpacity, setIntroOpacity] = useState(() =>
    introOpacityAt(progress.get())
  );
  const [workOpacity, setWorkOpacity] = useState(
    () => workOpacityAt(progress.get()) * exitFadeAt(exitProgress.get())
  );

  useMotionValueEvent(progress, "change", (latest) => {
    setIntroOpacity(introOpacityAt(latest));
    setWorkOpacity(workOpacityAt(latest) * exitFadeAt(exitProgress.get()));

    const seg = Math.floor(latest / SEG) - 1;
    const rounded = Math.max(0, Math.min(projects.length - 1, seg));
    setIndex((prev) => (prev === rounded ? prev : rounded));
  });

  useMotionValueEvent(exitProgress, "change", (latest) => {
    setWorkOpacity(workOpacityAt(progress.get()) * exitFadeAt(latest));
  });

  const current = projects[index];

  return (
    <div className="pointer-events-none fixed inset-0 z-40 font-grotesk text-foreground">
      <div
        className={blockPosition}
        style={{
          opacity: introOpacity,
          pointerEvents: introOpacity > 0.02 ? "auto" : "none",
        }}
      >
        <p className="text-[11px] uppercase tracking-[0.18em] text-subtle">
          Who I am <span className="text-subtle/70">· 00/{String(projects.length).padStart(2, "0")}</span>
        </p>
        <p className="mx-auto mt-3 max-w-[280px] text-[26px] font-semibold leading-[1.2] text-foreground lg:mx-0">
          Designer who tinkers, creates, and ships production-ready code.
        </p>
        <div className="hidden lg:flex lg:justify-start">
          <ReplayButton />
        </div>
      </div>

      <div
        className={blockPosition}
        style={{
          opacity: workOpacity,
          pointerEvents: workOpacity > 0.02 ? "auto" : "none",
        }}
      >
        <p className="text-[11px] uppercase tracking-[0.18em] text-subtle">
          {current.company}{" "}
          <span className="text-subtle/70">
            · {String(index + 1).padStart(2, "0")}/
            {String(projects.length).padStart(2, "0")}
          </span>
        </p>
        <Link
          href={`/work/${current.slug}`}
          className="mx-auto mt-3 block max-w-[280px] text-[26px] font-semibold leading-[1.2] text-foreground lg:mx-0"
        >
          {current.title}
        </Link>
      </div>
    </div>
  );
}
