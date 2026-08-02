import type { Metadata } from "next";
import { CaseStudy } from "@/components/CaseStudy";
import { getProject } from "@/lib/projects";

const project = getProject("digital-pool")!;

export const metadata: Metadata = {
  title: `${project.title} — ${project.company}`,
  description: project.blurb,
};

export default function Page() {
  return <CaseStudy project={project} />;
}
