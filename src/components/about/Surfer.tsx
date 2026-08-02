"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export function Surfer({
  containerRef,
  pathRef,
  pathLength,
  viewW,
  viewH,
  initialT,
  color,
  label,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  pathRef: RefObject<SVGPathElement | null>;
  pathLength: number;
  viewW: number;
  viewH: number;
  initialT: number;
  color: string;
  label: string;
}) {
  const [t, setT] = useState(initialT);
  const tRef = useRef(initialT);
  const dragStart = useRef({ t: initialT, x: 0 });

  useEffect(() => {
    tRef.current = t;
  }, [t]);

  const clampT = (v: number) => Math.min(0.97, Math.max(0.03, v));

  const point = pathRef.current?.getPointAtLength(t * pathLength) ?? { x: 0, y: 0 };
  const aheadT = clampT(t + 0.015);
  const point2 = pathRef.current?.getPointAtLength(aheadT * pathLength) ?? point;
  const angle =
    (Math.atan2(point2.y - point.y, point2.x - point.x) * 180) / Math.PI;

  const leftPct = (point.x / viewW) * 100;
  const topPct = (point.y / viewH) * 100;

  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = { t: tRef.current, x: e.clientX };

    const handleMove = (ev: PointerEvent) => {
      if (!containerRef.current) return;
      const width = containerRef.current.getBoundingClientRect().width;
      const dx = ev.clientX - dragStart.current.x;
      setT(clampT(dragStart.current.t + dx / width));
    };
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  return (
    <div
      onPointerDown={onPointerDown}
      className="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none select-none flex-col items-center active:cursor-grabbing"
      style={{ left: `${leftPct}%`, top: `${topPct}%` }}
    >
      <svg
        viewBox="0 0 60 70"
        width="38"
        height="44"
        className="drop-shadow-[0_4px_6px_rgba(20,20,20,0.25)]"
        style={{ transform: `rotate(${angle * 0.35}deg)` }}
      >
        <ellipse cx="30" cy="61" rx="27" ry="6" fill={color} />
        <rect x="20" y="41" width="6" height="20" rx="3" fill={color} />
        <rect x="34" y="43" width="6" height="18" rx="3" fill={color} />
        <rect x="22" y="20" width="16" height="24" rx="8" fill={color} />
        <rect
          x="6"
          y="24"
          width="18"
          height="6"
          rx="3"
          fill={color}
          transform="rotate(-12 15 27)"
        />
        <rect
          x="36"
          y="18"
          width="18"
          height="6"
          rx="3"
          fill={color}
          transform="rotate(18 45 21)"
        />
        <circle cx="30" cy="10" r="9" fill={color} />
      </svg>
      <span className="mt-1 whitespace-nowrap rounded-full bg-white/85 px-2 py-0.5 font-grotesk text-[10px] font-medium text-foreground shadow-sm">
        {label}
      </span>
    </div>
  );
}
