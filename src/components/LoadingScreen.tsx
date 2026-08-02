"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";

const SESSION_KEY = "piper-loaded";
const COUNT_DURATION = 2100;
const JUMP_DURATION = 0.55;

function easeOutQuint(t: number) {
  return 1 - Math.pow(1 - t, 5);
}

const CUBE_SIZE = 34;
const HALF = CUBE_SIZE / 2;

// front, back, right, left, top, bottom — shaded like a die catching soft light.
const FACES = [
  { transform: `translateZ(${HALF}px)`, background: "#f6f5f1" },
  { transform: `rotateY(180deg) translateZ(${HALF}px)`, background: "#e2e1db" },
  { transform: `rotateY(90deg) translateZ(${HALF}px)`, background: "#eeeee8" },
  { transform: `rotateY(-90deg) translateZ(${HALF}px)`, background: "#eeeee8" },
  { transform: `rotateX(90deg) translateZ(${HALF}px)`, background: "#f9f8f4" },
  { transform: `rotateX(-90deg) translateZ(${HALF}px)`, background: "#e7e6e0" },
];

const cubeVariants: Variants = {
  bounce: {
    y: [0, -6, -46, -6, 0],
    scaleX: [1.16, 1, 0.9, 1, 1.16],
    scaleY: [0.84, 1, 1.1, 1, 0.84],
    opacity: 1,
    transition: {
      duration: 0.9,
      times: [0, 0.15, 0.45, 0.85, 1],
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  jump: {
    y: [0, -70, -70],
    scale: [1, 1, 2.4],
    opacity: [1, 1, 0],
    transition: {
      duration: JUMP_DURATION,
      times: [0, 0.35, 1],
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// A small stand-in cube that bounces like it's warming up, then leaps and
// grows away — a wink at the real photo cube it's handing off to.
function MiniCube({ phase }: { phase: "counting" | "jump" }) {
  const spinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let ry = 24;
    const rx = -18;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      ry += 0.7;
      const el = spinRef.current;
      if (el) el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      variants={cubeVariants}
      animate={phase === "jump" ? "jump" : "bounce"}
      style={{ perspective: 400 }}
    >
      <div
        ref={spinRef}
        style={{
          position: "relative",
          width: CUBE_SIZE,
          height: CUBE_SIZE,
          transformStyle: "preserve-3d",
        }}
      >
        {FACES.map((face, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 4,
              background: face.background,
              border: "1px solid var(--color-border)",
              backfaceVisibility: "hidden",
              transform: face.transform,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function RefreshIcon() {
  return (
    <svg
      width="16"
      height="16"
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
  );
}

export function LoadingScreen() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<"counting" | "jump">("counting");
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);

  const play = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setShow(true);
    setPhase("counting");
    setCount(0);
    document.body.style.overflow = "hidden";
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_DURATION);
      setCount(Math.round(easeOutQuint(t) * 100));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPhase("jump");
        setTimeout(() => {
          sessionStorage.setItem(SESSION_KEY, "1");
          setShow(false);
        }, JUMP_DURATION * 1000);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useLayoutEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    play();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AnimatePresence onExitComplete={() => (document.body.style.overflow = "")}>
        {show && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col items-center gap-8">
              <MiniCube phase={phase} />
              <span className="font-playfair text-[11vw] leading-none tabular-nums text-foreground sm:text-[6vw]">
                {count}
                <span className="text-muted">%</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={play}
        aria-label="Replay intro animation"
        className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/40 text-subtle backdrop-blur-md transition-colors hover:text-foreground"
      >
        <RefreshIcon />
      </button>
    </>
  );
}
