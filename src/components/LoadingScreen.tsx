"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PhotoCube from "./home/PhotoCube";

const SESSION_KEY = "piper-loaded";
const CUBE_IMAGE_SRC = "/media/home/photocube.png";

const COUNT_DURATION = 2100;
const GROW_DURATION = 700;
const HOLD_DURATION = 150;
const MINI_SIZE = 120;
const MOBILE_MINI_SIZE = 100;
const TEXT_GAP = 28;

// Where the real homepage cube sits relative to true viewport center, from
// CenterStage's DesignLayer container (`pb-28 md:pb-0 md:pl-[340px]`):
// stacked, the 112px bottom pad lifts its center by half that; side-by-side,
// the 340px text-column reserve pushes its center right by half that. The
// loading cube starts dead center and travels exactly this far as it grows,
// so it arrives on top of the real cube instead of jumping at the handoff.
const STACKED_SHIFT_Y = -56;
const SIDE_BY_SIDE_SHIFT_X = 170;

// PhotoCube's tile gap/radius default to fixed px (10/3) sized for the real
// homepage cube — left alone, they'd stay that size even at mini size, so
// the grid would look chunky small and then visibly "relayout" relative to
// the tiles as the cube grows (the fake placeholder box never had this
// problem, having no internal grid at all). Scale both down proportionally
// at mini size, then ease to the exact real-cube values as it grows, so the
// grid's proportions stay visually consistent throughout instead of jumping.
const TARGET_GAP = 10;
const TARGET_RADIUS = 3;

function easeOutQuint(t: number) {
  return 1 - Math.pow(1 - t, 5);
}

// Same formula as CenterStage's useCubeSize (including its safety cap that
// shrinks the cube on narrower side-by-side breakpoints so a fully-dragged
// cube there can never reach the fixed text) — kept in exact sync so the
// loading cube grows into precisely the size the real homepage cube will be
// at. If that formula changes, this one needs to change with it.
// Matches Tailwind's `md:` — keep in sync with CenterStage / FixedUI.
const SIDE_BY_SIDE_MIN_WIDTH = 768;
const TEXT_RIGHT_EDGE = 312;
const TEXT_BLOCK_HEIGHT = 140;
const CUBE_SAFETY_MARGIN = 28;
// Width the fixed text column takes out of the media area on md+.
const TEXT_RESERVE = TEXT_RIGHT_EDGE + CUBE_SAFETY_MARGIN;
const WORST_X_RATIO = 0.85;
const WORST_Y_RATIO = 0.9;

function useCubeTargetSize() {
  const [size, setSize] = useState(420);
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const safeCap =
        vw < SIDE_BY_SIDE_MIN_WIDTH
          ? (vh / 2 - 56 - TEXT_BLOCK_HEIGHT - CUBE_SAFETY_MARGIN) / WORST_Y_RATIO
          : Math.min(
              (vw - TEXT_RESERVE) / 2 / WORST_X_RATIO,
              vh / 2 / WORST_Y_RATIO
            );

      const mediaW = vw < SIDE_BY_SIDE_MIN_WIDTH ? vw : vw - TEXT_RESERVE;
      const preferred = Math.min(420, mediaW * 0.68);

      setSize(Math.max(120, Math.min(preferred, safeCap)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}

// Phones get a slightly smaller mini cube (see MOBILE_MINI_SIZE) — purely
// cosmetic, independent of the layout-shift concern below. Matches
// Tailwind's `sm` breakpoint.
function useIsPhone() {
  const [isPhone, setIsPhone] = useState(false);
  useEffect(() => {
    const update = () => setIsPhone(window.innerWidth < 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return isPhone;
}

// Which way the cube has to travel to reach the real homepage cube — must
// track CenterStage's SIDE_BY_SIDE_MIN_WIDTH (Tailwind's `md`) exactly.
function useIsStacked() {
  const [isStacked, setIsStacked] = useState(false);
  useEffect(() => {
    const update = () =>
      setIsStacked(window.innerWidth < SIDE_BY_SIDE_MIN_WIDTH);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return isStacked;
}

export function LoadingScreen() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<"counting" | "grow">("counting");
  const [count, setCount] = useState(0);
  const [cubeSize, setCubeSize] = useState(MINI_SIZE);

  const targetSize = useCubeTargetSize();
  const targetSizeRef = useRef(targetSize);
  targetSizeRef.current = targetSize;
  const isPhone = useIsPhone();
  const isStacked = useIsStacked();

  const activeMiniSize = isPhone ? MOBILE_MINI_SIZE : MINI_SIZE;
  const activeMiniSizeRef = useRef(activeMiniSize);
  activeMiniSizeRef.current = activeMiniSize;

  const rafRef = useRef<number | undefined>(undefined);

  // How far through the mini->target size grow we are (0 while counting,
  // 0->1 while growing) — drives gap/radius to the same target the real
  // cube uses, arriving exactly there right as size finishes growing.
  const growProgress =
    targetSize > activeMiniSize
      ? Math.min(1, Math.max(0, (cubeSize - activeMiniSize) / (targetSize - activeMiniSize)))
      : 1;
  const miniGap = (activeMiniSize / 420) * TARGET_GAP;
  const miniRadius = (activeMiniSize / 420) * TARGET_RADIUS;
  const cubeGap = miniGap + (TARGET_GAP - miniGap) * growProgress;
  const cubeTileRadius = miniRadius + (TARGET_RADIUS - miniRadius) * growProgress;

  // Text sits a fixed gap below the cube's bottom edge, regardless of the
  // text's own line-box height. The cube is dead center for the whole
  // counting phase (it only travels once the text has faded), so this needs
  // no per-breakpoint correction.
  //
  // The cube's true half-height is NOT half its edge length — it's rotating
  // (ry sweeps the full circle during the free-spin) and rendered with real
  // CSS perspective, both of which push its projected bounding box well
  // past a flat cross-section. Numerically sweeping every ry at the fixed
  // rx=-16 this cube uses gives a worst-case screen-space half-height of
  // ~0.70x the edge length (rising toward ~0.78x with perspective at larger
  // sizes); 0.8 gives headroom for the asymmetric perspective-origin
  // ('50% 46%', not dead center) on top of that measured worst case.
  const CUBE_HALF_HEIGHT_RATIO = 0.8;
  const textTopOffset = activeMiniSize * CUBE_HALF_HEIGHT_RATIO + TEXT_GAP;

  // Same eased 0->1 the size grow is on, so the travel to the homepage
  // cube's position lands in lockstep with the scale and the rotation
  // settle rather than on its own curve.
  const travel = phase === "grow" ? growProgress : 0;
  const shiftX = isStacked ? 0 : SIDE_BY_SIDE_SHIFT_X * travel;
  const shiftY = isStacked ? STACKED_SHIFT_Y * travel : 0;

  const play = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setShow(true);
    setPhase("counting");
    setCount(0);
    setCubeSize(activeMiniSizeRef.current);
    document.body.style.overflow = "hidden";

    const countStart = performance.now();

    const growTick = (growStart: number) => {
      const now = performance.now();
      const t = Math.min(1, (now - growStart) / GROW_DURATION);
      const e = easeOutQuint(t);
      const from = activeMiniSizeRef.current;
      setCubeSize(from + (targetSizeRef.current - from) * e);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(() => growTick(growStart));
      } else {
        setTimeout(() => {
          sessionStorage.setItem(SESSION_KEY, "1");
          setShow(false);
        }, HOLD_DURATION);
      }
    };

    const countTick = (now: number) => {
      const t = Math.min(1, (now - countStart) / COUNT_DURATION);
      setCount(Math.round(easeOutQuint(t) * 100));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(countTick);
      } else {
        setPhase("grow");
        rafRef.current = requestAnimationFrame(() => growTick(performance.now()));
      }
    };

    rafRef.current = requestAnimationFrame(countTick);
  }, []);

  useLayoutEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    play();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = () => play();
    window.addEventListener("piper:replay-intro", handler);
    return () => window.removeEventListener("piper:replay-intro", handler);
  }, [play]);

  return (
    <AnimatePresence onExitComplete={() => (document.body.style.overflow = "")}>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Dead center while counting, then it grows and travels onto
              CenterStage's DesignLayer position, so the handoff fade is a
              pure crossfade — same size, same place, same orientation.
              Mobile uses a slightly smaller mini size (MOBILE_MINI_SIZE). */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div style={{ transform: `translate3d(${shiftX}px, ${shiftY}px, 0)` }}>
              <PhotoCube
                src={CUBE_IMAGE_SRC}
                size={cubeSize}
                gap={cubeGap}
                tileRadius={cubeTileRadius}
                draggable={false}
                spinSpeed={0.35}
                progress={phase === "grow" ? 0 : undefined}
                // Same duration+easing as the size grow below, so rotation
                // and scale finish in lockstep instead of two independent
                // curves drifting apart mid-transition.
                settleDuration={GROW_DURATION}
              />
            </div>
          </div>

          {/* Top-anchored below the cube (exact gap regardless of the
              text's own line-box height) — see textTopOffset above. */}
          <span
            className="pointer-events-none absolute inset-x-0 text-center font-playfair text-[9vw] leading-none tabular-nums text-foreground transition-opacity duration-200 sm:text-[3.2vw]"
            style={{
              top: `calc(50% + ${textTopOffset}px)`,
              opacity: phase === "counting" ? 1 : 0,
            }}
          >
            {count}
            <span className="text-muted">%</span>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
