"use client";

import { useEffect, useRef, useState } from "react";
import { Surfer } from "./Surfer";

const VIEW_W = 1200;
const VIEW_H = 160;
const WAVE_D =
  "M 0 90 C 100 30, 200 150, 300 90 S 500 30, 600 90 S 800 150, 900 90 S 1100 30, 1200 90";

const RIDERS = [
  { label: "Opera, 9 yrs", color: "#c99418", t: 0.13 },
  { label: "Tennis @ 2am", color: "#1d3557", t: 0.36 },
  { label: "Learning to surf", color: "#1f7a75", t: 0.6 },
  { label: "Aspiring baker", color: "#c1583a", t: 0.82 },
];

export function WaveBox() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) setPathLength(pathRef.current.getTotalLength());
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[240px] w-full overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-[#eaf6f6] to-[#f7fbfa]"
    >
      <p className="pointer-events-none absolute left-5 top-4 z-10 font-grotesk text-[10px] uppercase tracking-[0.2em] text-subtle">
        Drag to ride the wave
      </p>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          ref={pathRef}
          d={WAVE_D}
          fill="none"
          stroke="#bfe0dd"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      {pathLength > 0 &&
        RIDERS.map((r) => (
          <Surfer
            key={r.label}
            containerRef={containerRef}
            pathRef={pathRef}
            pathLength={pathLength}
            viewW={VIEW_W}
            viewH={VIEW_H}
            initialT={r.t}
            color={r.color}
            label={r.label}
          />
        ))}
    </div>
  );
}
