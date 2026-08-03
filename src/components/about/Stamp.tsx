"use client";

import {
  useCallback,
  useId,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

const STAMP_FILL = "#f6f1e4";
const CORNER_RADIUS = 6;
const NOTCH_RADIUS = 3;
const NOTCH_GAP = 12;

// Classic postage-stamp perforation, built as an SVG mask: a rounded-rect
// punched with evenly-spaced circles along each edge. Notch count is derived
// from the actual size so the scallops stay evenly spaced at any stamp size.
function StampFrame({ width, height }: { width: number; height: number }) {
  const id = useId();
  const notches: Array<[number, number]> = [];

  const hSpan = width - CORNER_RADIUS * 2;
  const hCount = Math.max(2, Math.round(hSpan / NOTCH_GAP));
  for (let i = 0; i <= hCount; i++) {
    const x = CORNER_RADIUS + (hSpan * i) / hCount;
    notches.push([x, 0], [x, height]);
  }

  const vSpan = height - CORNER_RADIUS * 2;
  const vCount = Math.max(2, Math.round(vSpan / NOTCH_GAP));
  for (let i = 0; i <= vCount; i++) {
    const y = CORNER_RADIUS + (vSpan * i) / vCount;
    notches.push([0, y], [width, y]);
  }

  return (
    <div className="absolute inset-0" style={{ filter: "drop-shadow(0 8px 14px rgba(30,28,25,0.2))" }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <mask id={id}>
          <rect x={0} y={0} width={width} height={height} rx={CORNER_RADIUS} fill="white" />
          {notches.map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={NOTCH_RADIUS} fill="black" />
          ))}
        </mask>
        <rect x={0} y={0} width={width} height={height} rx={CORNER_RADIUS} fill={STAMP_FILL} mask={`url(#${id})`} />
      </svg>
    </div>
  );
}

function MoveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="5 9 2 12 5 15" />
      <polyline points="9 5 12 2 15 5" />
      <polyline points="15 19 12 22 9 19" />
      <polyline points="19 9 22 12 19 15" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="12" y1="2" x2="12" y2="22" />
    </svg>
  );
}

export function Stamp({
  label,
  icon,
  imageSrc,
  width,
  height,
  left,
  top,
  rotate,
  boardRef,
}: {
  label: string;
  icon?: ReactNode;
  /** Pre-designed stamp artwork (perforation, caption, everything already
   * baked in) — rendered as-is instead of the icon + SVG frame layout. */
  imageSrc?: string;
  width: number;
  height: number;
  left: string;
  top: string;
  rotate: number;
  boardRef: RefObject<HTMLDivElement | null>;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  // Window-level pointer listeners (not the per-element onPointerMove prop) —
  // more reliable for drag than element-scoped handlers, same pattern used by
  // PhotoCube and the about-page hobby markers.
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const board = boardRef.current;
      const el = wrapperRef.current;
      if (!board || !el) return;

      const boardRect = board.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const restLeft = elRect.left - pos.x;
      const restTop = elRect.top - pos.y;

      const minX = boardRect.left - restLeft;
      const maxX = boardRect.right - restLeft - elRect.width;
      const minY = boardRect.top - restTop;
      const maxY = boardRect.bottom - restTop - elRect.height;

      const start = { x: e.clientX, y: e.clientY, baseX: pos.x, baseY: pos.y };
      setDragging(true);

      // A fast/long drag can otherwise kick off the browser's own
      // text-selection gesture partway through, even though it started on a
      // user-select:none element — `user-select: none` alone doesn't stop
      // this, since selection is driven by the `selectstart` event directly,
      // so block that for the duration of the drag.
      const preventSelectStart = (ev: Event) => ev.preventDefault();
      window.addEventListener("selectstart", preventSelectStart);
      window.getSelection()?.removeAllRanges();

      const move = (ev: PointerEvent) => {
        const dx = ev.clientX - start.x;
        const dy = ev.clientY - start.y;
        setPos({
          x: Math.min(maxX, Math.max(minX, start.baseX + dx)),
          y: Math.min(maxY, Math.max(minY, start.baseY + dy)),
        });
      };
      const up = () => {
        setDragging(false);
        window.removeEventListener("selectstart", preventSelectStart);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    },
    [pos, boardRef]
  );

  return (
    <div
      ref={wrapperRef}
      className="group absolute cursor-grab touch-none select-none active:cursor-grabbing"
      style={{
        left,
        top,
        width,
        height,
        zIndex: dragging ? 30 : 1,
        transform: `translate(${pos.x}px, ${pos.y}px) rotate(${dragging ? 0 : rotate}deg) scale(${dragging ? 1.06 : 1})`,
        transition: dragging ? "none" : "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onPointerDown={onPointerDown}
    >
      {imageSrc ? (
        <div className="absolute inset-0" style={{ filter: "drop-shadow(0 8px 14px rgba(30,28,25,0.2))" }}>
          <img
            src={imageSrc}
            alt={label}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className="h-full w-full"
            style={{ objectFit: "cover", pointerEvents: "none" }}
          />
        </div>
      ) : (
        <>
          <StampFrame width={width} height={height} />
          <div className="relative flex h-full flex-col items-center justify-between px-2 pb-4 pt-3">
            <p className="text-center font-grotesk text-[9px] font-semibold uppercase leading-tight tracking-[0.09em] text-foreground">
              {label}
            </p>
            <div className="flex w-full flex-1 items-center justify-center py-1 text-foreground/85">
              {icon}
            </div>
          </div>
        </>
      )}

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur-sm">
          <MoveIcon />
        </div>
      </div>
    </div>
  );
}
