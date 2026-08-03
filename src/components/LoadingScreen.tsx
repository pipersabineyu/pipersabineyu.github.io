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

export function LoadingScreen() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<"counting" | "grow">("counting");
  const [count, setCount] = useState(0);
  const [cubeSize, setCubeSize] = useState(MINI_SIZE);

  const targetSize = useCubeTargetSize();
  const targetSizeRef = useRef(targetSize);
  targetSizeRef.current = targetSize;

  const rafRef = useRef<number | undefined>(undefined);

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
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <PhotoCube
            src={CUBE_IMAGE_SRC}
            size={cubeSize}
            draggable={false}
            spinSpeed={0.35}
          />

          <span
            className="font-playfair text-[7vw] leading-none tabular-nums text-foreground transition-opacity duration-200 sm:text-[3.2vw]"
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
