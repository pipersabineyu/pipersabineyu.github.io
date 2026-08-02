"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import { FixedUI } from "./FixedUI";
import { CenterStage } from "./CenterStage";

export function HomeExperience() {
  const pinnedRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pinnedRef,
    offset: ["start start", "end end"],
  });

  // `scrollYProgress` clamps at 1 forever once you scroll past the pinned
  // section, so it can't signal "we've moved on" for the fixed overlay text.
  // This tracks scroll distance *after* release, so FixedUI can fade out.
  const { scrollYProgress: exitProgress } = useScroll({
    target: pinnedRef,
    offset: ["end end", "end start"],
  });

  return (
    <>
      <FixedUI progress={scrollYProgress} exitProgress={exitProgress} />

      <section ref={pinnedRef} className="relative h-[600vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
          <CenterStage progress={scrollYProgress} imageSrc="/media/home/photocube.png" />
        </div>
      </section>
    </>
  );
}
