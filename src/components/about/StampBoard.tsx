"use client";

import { useEffect, useRef, useState } from "react";
import { Stamp } from "./Stamp";

// Desktop/tablet: 4 columns x 2 rows, wide and short. Mobile: 2 columns x 4
// rows instead — 4-across read as cramped and tiny on a phone, so mobile
// trades columns for rows and gets noticeably bigger stamps (see
// useStampLayout). Both grids walk the same 8 stamps in the same row-major
// order, so the reading order feels the same at every breakpoint.
const DESKTOP_COLS = [3, 26, 49, 72];
const DESKTOP_ROWS = [6, 55];
const MOBILE_COLS = [6, 54];
const MOBILE_ROWS = [3, 27, 51, 75];

const STAMP_DATA = [
  { label: "Tennis", imageSrc: "/media/about/stamp-tennis.webp", rotate: -6 },
  { label: "Running", imageSrc: "/media/about/stamp-running.webp", rotate: 5 },
  { label: "Pottery", imageSrc: "/media/about/stamp-pottery.webp", rotate: -4 },
  { label: "Bouquet", imageSrc: "/media/about/stamp-bouquet.webp", rotate: 6 },
  { label: "Crochet", imageSrc: "/media/about/stamp-crochet.webp", rotate: 4 },
  { label: "Surfboard wipeout", imageSrc: "/media/about/stamp-wipeout.webp", rotate: -5 },
  { label: "Can't bake", imageSrc: "/media/about/stamp-baking.webp", rotate: 5 },
  { label: "Opera singer", imageSrc: "/media/about/stamp-opera.webp", rotate: -3 },
];

// Size, grid, and board height all move together per breakpoint — kept in
// one hook so they can't drift out of sync with each other.
function useStampLayout() {
  const [layout, setLayout] = useState({
    isMobile: false,
    width: 156,
    height: 208,
    cols: DESKTOP_COLS,
    rows: DESKTOP_ROWS,
    boardHeight: 490,
  });

  useEffect(() => {
    const update = () => {
      const isMobile = window.innerWidth < 640;
      setLayout(
        isMobile
          ? {
              isMobile,
              width: 100,
              height: 133,
              cols: MOBILE_COLS,
              rows: MOBILE_ROWS,
              boardHeight: 660,
            }
          : {
              isMobile,
              width: 156,
              height: 208,
              cols: DESKTOP_COLS,
              rows: DESKTOP_ROWS,
              boardHeight: 490,
            }
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return layout;
}

export function StampBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const { width, height, cols, rows, boardHeight } = useStampLayout();

  return (
    <div
      ref={boardRef}
      className="relative w-full rounded-3xl border border-border bg-surface"
      style={{ height: boardHeight }}
    >
      {STAMP_DATA.map((s, i) => (
        <Stamp
          key={s.label}
          label={s.label}
          imageSrc={s.imageSrc}
          width={width}
          height={height}
          left={`${cols[i % cols.length]}%`}
          top={`${rows[Math.floor(i / cols.length) % rows.length]}%`}
          rotate={s.rotate}
          boardRef={boardRef}
        />
      ))}
    </div>
  );
}
