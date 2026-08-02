"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ROLES = ["Designer", "Builder", "Shipper", "Singer"];

export function RoleCycle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ROLES.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-block w-[6.5em] text-left align-top">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={ROLES[index]}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 top-0"
        >
          {ROLES[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
