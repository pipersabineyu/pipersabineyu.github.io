"use client";

import { useEffect, useRef, useState } from "react";
import { Stamp } from "./Stamp";
import {
  TennisIcon,
  RunningIcon,
  PressedFlowerIcon,
  BouquetIcon,
  MusicNotesIcon,
  WipeoutIcon,
  BurntCupcakeIcon,
  OperaSingerIcon,
} from "./stampIcons";

// Both columns share the same four row-tops (~25% apart, stamps are ~22%
// tall) so nothing overlaps vertically — left offset and rotation vary per
// stamp for a scattered, tossed-on-a-desk feel without risking collisions.
const ROWS = [2, 27, 52, 77];

const STAMPS = [
  { label: "Tennis", icon: <TennisIcon />, left: "8%", top: `${ROWS[0]}%`, rotate: -6 },
  { label: "Running", icon: <RunningIcon />, left: "58%", top: `${ROWS[0]}%`, rotate: 5 },
  { label: "Pressing flowers", icon: <PressedFlowerIcon />, left: "6%", top: `${ROWS[1]}%`, rotate: 4 },
  { label: "Making bouquets", icon: <BouquetIcon />, left: "56%", top: `${ROWS[1]}%`, rotate: -5 },
  { label: "Classical music", icon: <MusicNotesIcon />, left: "9%", top: `${ROWS[2]}%`, rotate: -4 },
  { label: "Surfboard wipeout", icon: <WipeoutIcon />, left: "59%", top: `${ROWS[2]}%`, rotate: 6 },
  { label: "Can't bake", icon: <BurntCupcakeIcon />, left: "7%", top: `${ROWS[3]}%`, rotate: -3 },
  { label: "Opera singer", icon: <OperaSingerIcon />, left: "57%", top: `${ROWS[3]}%`, rotate: 4 },
];

// Two size presets rather than a fluid scale — the SVG perforation math
// needs real px, and a coarse mobile/desktop split keeps stamps legible at
// both without a resize-observer per stamp.
function useStampSize() {
  const [size, setSize] = useState({ width: 152, height: 198 });
  useEffect(() => {
    const update = () =>
      setSize(
        window.innerWidth < 640 ? { width: 108, height: 142 } : { width: 152, height: 198 }
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}

export function StampBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const { width, height } = useStampSize();

  return (
    <div
      ref={boardRef}
      className="relative h-[660px] w-full rounded-3xl border border-border bg-[#ececea] sm:h-[820px]"
    >
      <p className="pointer-events-none absolute left-5 top-4 z-10 font-grotesk text-[10px] uppercase tracking-[0.2em] text-subtle">
        Drag to rearrange
      </p>
      {STAMPS.map((s) => (
        <Stamp
          key={s.label}
          label={s.label}
          icon={s.icon}
          width={width}
          height={height}
          left={s.left}
          top={s.top}
          rotate={s.rotate}
          boardRef={boardRef}
        />
      ))}
    </div>
  );
}
