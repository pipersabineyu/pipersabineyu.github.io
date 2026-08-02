import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { projects } from "@/lib/projects";

export function WorkList() {
  return (
    <div id="work" className="mx-auto w-full max-w-2xl scroll-mt-20 px-6 py-24">
      <FadeIn>
        <h2 className="font-grotesk text-[13px] text-foreground">
          All work
        </h2>
        <div className="mt-1 flex flex-col divide-y divide-border">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="group flex items-center gap-4 py-4"
            >
              <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-md">
                <Image
                  src={project.cover}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.05]"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[14px] text-foreground transition-colors group-hover:text-muted">
                    {project.title}
                  </h3>
                  <span className="shrink-0 text-[12px] text-subtle">
                    {project.company}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[13px] text-muted">
                  {project.blurb}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
