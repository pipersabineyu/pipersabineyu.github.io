"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { projects, type Project } from "@/lib/projects";
import PhotoCube from "./PhotoCube";
import { TOTAL, SEG, MARGIN, segmentOpacity } from "./segmentOpacity";

function opacityAt(p: number, i: number) {
  const start = i * SEG;
  const end = (i + 1) * SEG;
  const isFirst = i === 0;
  const isLast = i === TOTAL - 1;

  const points = [
    isFirst ? 0 : start,
    Math.min(start + MARGIN, end),
    Math.max(end - MARGIN, start),
    isLast ? 1 : end,
  ];
  const values = [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0];

  return segmentOpacity(p, points, values);
}

function useLayerOpacity(progress: MotionValue<number>, i: number) {
  const [opacity, setOpacity] = useState(() => opacityAt(progress.get(), i));
  useMotionValueEvent(progress, "change", (latest) => {
    setOpacity(opacityAt(latest, i));
  });
  return opacity;
}

// Keeps the cube from overflowing narrow viewports — the 3D face math needs
// an actual px number, so this can't just be done with a CSS max-width.
function useCubeSize() {
  const [size, setSize] = useState(420);
  useEffect(() => {
    const update = () => setSize(Math.min(420, window.innerWidth * 0.68));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}

function DesignLayer({
  progress,
  imageSrc,
}: {
  progress: MotionValue<number>;
  imageSrc?: string;
}) {
  const opacity = useLayerOpacity(progress, 0);
  const size = useCubeSize();

  // Segment-local progress (0→1 across just this first segment) drives the
  // cube's base rotation as you scroll; dragging still adds momentum on top.
  const [cubeProgress, setCubeProgress] = useState(() =>
    Math.min(1, Math.max(0, progress.get() / SEG))
  );
  useMotionValueEvent(progress, "change", (latest) => {
    setCubeProgress(Math.min(1, Math.max(0, latest / SEG)));
  });

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pb-28 sm:pb-0"
      style={{ opacity, pointerEvents: opacity > 0.02 ? "auto" : "none" }}
    >
      <PhotoCube src={imageSrc} progress={cubeProgress} size={size} />
    </div>
  );
}

function ProjectLayer({
  progress,
  index,
  project,
}: {
  progress: MotionValue<number>;
  index: number;
  project: Project;
}) {
  const opacity = useLayerOpacity(progress, index + 1);
  return (
    <div
      className="absolute inset-0 flex items-center justify-center p-6 pb-32 sm:p-16"
      style={{ opacity, pointerEvents: opacity > 0.02 ? "auto" : "none" }}
    >
      <div className="relative aspect-[4/3] w-full max-w-2xl overflow-hidden rounded-2xl shadow-[0_30px_80px_-30px_rgba(20,20,20,0.3)]">
        <Image
          src={project.cover}
          alt=""
          fill
          sizes="(min-width: 640px) 700px, 90vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}

export function CenterStage({
  progress,
  imageSrc,
}: {
  progress: MotionValue<number>;
  imageSrc?: string;
}) {
  return (
    <>
      <DesignLayer progress={progress} imageSrc={imageSrc} />
      {projects.map((project, i) => (
        <ProjectLayer
          key={project.slug}
          progress={progress}
          index={i}
          project={project}
        />
      ))}
    </>
  );
}
