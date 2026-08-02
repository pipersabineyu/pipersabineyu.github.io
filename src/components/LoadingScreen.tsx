"use client";

import { useLayoutEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SESSION_KEY = "piper-loaded";
const DURATION = 1400;

function easeOutQuint(t: number) {
  return 1 - Math.pow(1 - t, 5);
}

export function LoadingScreen() {
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      return;
    }

    setShow(true);
    document.body.style.overflow = "hidden";
    let raf: number;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      setCount(Math.round(easeOutQuint(t) * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          sessionStorage.setItem(SESSION_KEY, "1");
          setShow(false);
        }, 250);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence onExitComplete={() => (document.body.style.overflow = "")}>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-playfair text-[15vw] leading-none tabular-nums text-foreground sm:text-[9vw]">
            {count}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
