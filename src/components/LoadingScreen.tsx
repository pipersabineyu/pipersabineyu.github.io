"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";

const SESSION_KEY = "piper-loaded";
const COUNT_DURATION = 2100;
const GROW_DURATION = 750;
const HOLD_DURATION = 150;
const MINI_SIZE = 56;

// Matches PhotoCube's own initial base rotation (rx: -16, ry: -30), so
// growing into it lines up instead of snapping to a new angle.
const TARGET_RX = -16;
const TARGET_RY = -30;

function easeOutQuint(t: number) {
  return 1 - Math.pow(1 - t, 5);
}

// Same formula as CenterStage's useCubeSize, so the mini cube grows into
// exactly the size the real cube will be at.
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

function faceTransforms(half: number) {
  return [
    `translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateY(-90deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ];
}

// front, back, right, left, top, bottom — a light source from directly above,
// so each face sits at its own clear tonal step (studio-render style), and
// the step itself — not a stroke — is what reads as the edge between faces.
const FACE_GRADIENTS = [
  "linear-gradient(180deg, #f7f6f2 0%, #eae9e3 100%)",
  "linear-gradient(180deg, #c2c1bb 0%, #b4b3ad 100%)",
  "linear-gradient(180deg, #d5d4ce 0%, #c7c6c0 100%)",
  "linear-gradient(180deg, #dedcd6 0%, #d0cfc9 100%)",
  "linear-gradient(180deg, #fdfcfa 0%, #f6f5f1 100%)",
  "linear-gradient(180deg, #bdbcb6 0%, #b0afa9 100%)",
];

// A 1×1 stand-in for the homepage photo cube — same six-face geometry, plain
// shaded faces instead of photo tiles. It scales and rotates in place to
// match the real cube's starting size and angle exactly, so growing into it
// at 100% reads as one continuous object rather than a swap.
function MiniCube({ size, rx, ry }: { size: number; rx: number; ry: number }) {
  const half = size / 2;
  const radius = size * 0.06;
  return (
    // The drop-shadow lives on this outer wrapper, not the preserve-3d cube
    // itself — a `filter` on a preserve-3d element flattens its children to
    // a single 2D layer in most browsers, hiding every face but one.
    <div style={{ filter: "drop-shadow(0 18px 24px rgba(30,28,25,0.14))" }}>
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          transformStyle: "preserve-3d",
          transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
        }}
      >
        {faceTransforms(half).map((t, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: radius,
              background: FACE_GRADIENTS[i],
              boxShadow: "inset 0 0 0.45em rgba(30,28,25,0.12)",
              backfaceVisibility: "hidden",
              transform: t,
            }}
          />
        ))}
      </div>
    </div>
  );
}

const bounceVariants: Variants = {
  bounce: {
    y: [0, -6, -46, -6, 0],
    scaleX: [1.16, 1, 0.9, 1, 1.16],
    scaleY: [0.84, 1, 1.1, 1, 0.84],
    transition: {
      duration: 0.9,
      times: [0, 0.15, 0.45, 0.85, 1],
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  settle: {
    y: 0,
    scaleX: 1,
    scaleY: 1,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
};

export function LoadingScreen() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<"counting" | "grow">("counting");
  const [count, setCount] = useState(0);
  const [cubeSize, setCubeSize] = useState(MINI_SIZE);
  const [rot, setRot] = useState({ rx: -18, ry: 0 });

  const targetSize = useCubeTargetSize();
  const targetSizeRef = useRef(targetSize);
  targetSizeRef.current = targetSize;

  const spin = useRef({ rx: -18, ry: 0 });
  const rafRef = useRef<number | undefined>(undefined);

  const play = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setShow(true);
    setPhase("counting");
    setCount(0);
    setCubeSize(MINI_SIZE);
    spin.current = { rx: -18, ry: 0 };
    setRot({ ...spin.current });
    document.body.style.overflow = "hidden";

    const countStart = performance.now();

    const growTick = (growStart: number, from: { rx: number; ry: number }) => {
      const now = performance.now();
      const t = Math.min(1, (now - growStart) / GROW_DURATION);
      const e = easeOutQuint(t);
      setRot({
        rx: from.rx + (TARGET_RX - from.rx) * e,
        ry: from.ry + (TARGET_RY - from.ry) * e,
      });
      setCubeSize(MINI_SIZE + (targetSizeRef.current - MINI_SIZE) * e);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(() => growTick(growStart, from));
      } else {
        setTimeout(() => {
          sessionStorage.setItem(SESSION_KEY, "1");
          setShow(false);
        }, HOLD_DURATION);
      }
    };

    const countTick = (now: number) => {
      spin.current.ry += 2.1;
      setRot({ ...spin.current });

      const t = Math.min(1, (now - countStart) / COUNT_DURATION);
      setCount(Math.round(easeOutQuint(t) * 100));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(countTick);
      } else {
        setPhase("grow");
        const from = { ...spin.current };
        const growStart = performance.now();
        rafRef.current = requestAnimationFrame(() => growTick(growStart, from));
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
          <div className="absolute inset-0 flex items-center justify-center pb-28 sm:pb-0">
            <motion.div
              variants={bounceVariants}
              animate={phase === "counting" ? "bounce" : "settle"}
              style={{ perspective: 900 }}
            >
              <MiniCube size={cubeSize} rx={rot.rx} ry={rot.ry} />
            </motion.div>
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 top-[62%] text-center transition-opacity duration-200"
            style={{ opacity: phase === "counting" ? 1 : 0 }}
          >
            <span className="font-playfair text-[11vw] leading-none tabular-nums text-foreground sm:text-[6vw]">
              {count}
              <span className="text-muted">%</span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
