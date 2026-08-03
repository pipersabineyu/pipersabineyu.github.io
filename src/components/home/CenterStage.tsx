"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { projects, type Project } from "@/lib/projects";
import PhotoCube from "./PhotoCube";
import { TOTAL, SEG, MARGIN, segmentOpacity } from "./segmentOpacity";

// A diagonal open/view arrow (white halo behind ink so it reads on any
// photo), used as the cursor over a project cover to hint it's clickable.
const OPEN_CURSOR =
  "url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDM2IDM2Ij48ZyBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZmlsbD0ibm9uZSI+PGxpbmUgeDE9IjEwIiB5MT0iMjYiIHgyPSIyNiIgeTI9IjEwIi8+PHBvbHlsaW5lIHBvaW50cz0iMTQgMTAgMjYgMTAgMjYgMjIiLz48L2c+PGcgc3Ryb2tlPSIjMjExZjFjIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJub25lIj48bGluZSB4MT0iMTAiIHkxPSIyNiIgeDI9IjI2IiB5Mj0iMTAiLz48cG9seWxpbmUgcG9pbnRzPSIxNCAxMCAyNiAxMCAyNiAyMiIvPjwvZz48L3N2Zz4=\") 10 26, pointer";

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
      <Link
        href={`/work/${project.slug}`}
        className="relative block aspect-[4/3] w-full max-w-2xl overflow-hidden rounded-2xl shadow-[0_30px_80px_-30px_rgba(20,20,20,0.3)]"
        style={{ cursor: OPEN_CURSOR }}
      >
        <Image
          src={project.cover}
          alt=""
          fill
          sizes="(min-width: 640px) 700px, 90vw"
          className="object-cover"
        />
      </Link>
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
