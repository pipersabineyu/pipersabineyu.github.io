import { projects } from "@/lib/projects";

export const TOTAL = projects.length + 1;
export const SEG = 1 / TOTAL;
export const MARGIN = SEG * 0.25;

/** Piecewise-linear interpolation over a set of progress breakpoints. */
export function segmentOpacity(p: number, points: number[], values: number[]) {
  if (p <= points[0]) return values[0];
  for (let k = 0; k < points.length - 1; k++) {
    if (p <= points[k + 1]) {
      const span = points[k + 1] - points[k];
      const t = span === 0 ? 1 : (p - points[k]) / span;
      return values[k] + (values[k + 1] - values[k]) * t;
    }
  }
  return values[values.length - 1];
}
