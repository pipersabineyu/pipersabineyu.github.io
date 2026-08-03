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

// PhotoCube's tile gap/radius default to fixed px (10/3) sized for the real
// homepage cube — left alone, they'd stay that size even at MINI_SIZE, so
// the grid would look chunky small and then visibly "relayout" relative to
// the tiles as the cube grows (the fake placeholder box never had this
// problem, having no internal grid at all). Scale both down proportionally
// at mini size, then ease to the exact real-cube values as it grows, so the
// grid's proportions stay visually consistent throughout instead of jumping.
const TARGET_GAP = 10;
const TARGET_RADIUS = 3;
const MINI_GAP = (MINI_SIZE / 420) * TARGET_GAP;
const MINI_RADIUS = (MINI_SIZE / 420) * TARGET_RADIUS;

function easeOutQuint(t: number) {
  return 1 - Math.pow(1 - t, 5);
}

// Same formula as CenterStage's useCubeSize, so the cube grows into exactly
// the size the real homepage cube will be at.
function useCubeTargetSize() {
  const [size, setSize] = useState(420);
  useEffect(() => {
    const update = () => setSize(Math.min(420, window.innerWidth * 0.68));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}

// On phones the cube read as muddy (photo tiles are illegible at that size
// after the crop) and crowded the percentage — mobile gets just the number,
// larger breakpoints keep the cube. Matches Tailwind's `sm` breakpoint.
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return isMobile;
}

export function LoadingScreen() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<"counting" | "grow">("counting");
  const [count, setCount] = useState(0);
  const [cubeSize, setCubeSize] = useState(MINI_SIZE);

  const targetSize = useCubeTargetSize();
  const targetSizeRef = useRef(targetSize);
  targetSizeRef.current = targetSize;
  const isMobile = useIsMobile();

  const rafRef = useRef<number | undefined>(undefined);

  // How far through the mini->target size grow we are (0 while counting,
  // 0->1 while growing) — drives gap/radius to the same target the real
  // cube uses, arriving exactly there right as size finishes growing.
  const growProgress =
    targetSize > MINI_SIZE
      ? Math.min(1, Math.max(0, (cubeSize - MINI_SIZE) / (targetSize - MINI_SIZE)))
      : 1;
  const cubeGap = MINI_GAP + (TARGET_GAP - MINI_GAP) * growProgress;
  const cubeTileRadius = MINI_RADIUS + (TARGET_RADIUS - MINI_RADIUS) * growProgress;

  const play = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setShow(true);
    setPhase("counting");
    setCount(0);
    setCubeSize(MINI_SIZE);
    document.body.style.overflow = "hidden";

    const countStart = performance.now();

    const growTick = (growStart: number) => {
      const now = performance.now();
      const t = Math.min(1, (now - growStart) / GROW_DURATION);
      const e = easeOutQuint(t);
      setCubeSize(MINI_SIZE + (targetSizeRef.current - MINI_SIZE) * e);

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
          {/* Cube only above the mobile breakpoint — see useIsMobile. Identical
              centering to CenterStage's DesignLayer so it sits at the exact
              position, size, and — via the progress handoff in PhotoCube —
              orientation the real homepage cube starts at. */}
          {!isMobile && (
            <div className="absolute inset-0 flex items-center justify-center">
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
          )}

          {/* Desktop: top-anchored below the cube (exact gap regardless of
              the text's own line-box height — 50% + half the mini cube +
              a fixed gap). Mobile: no cube to sit below, so just centered. */}
          <span
            className={`pointer-events-none absolute inset-x-0 text-center font-playfair leading-none tabular-nums text-foreground transition-opacity duration-200 ${
              isMobile
                ? "top-1/2 -translate-y-1/2 text-[12vw]"
                : "top-[calc(50%+88px)] text-[3.2vw]"
            }`}
            style={{ opacity: phase === "counting" ? 1 : 0 }}
          >
            {count}
            <span className="text-muted">%</span>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
