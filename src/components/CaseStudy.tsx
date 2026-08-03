import Image from "next/image";
import Link from "next/link";
import { BackButton } from "@/components/BackButton";
import { FadeIn } from "@/components/FadeIn";
import { PhoneFrame } from "@/components/PhoneFrame";
import { profile } from "@/lib/profile";
import { projects, type Project, type ProjectMedia } from "@/lib/projects";

function MetaItem({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="font-grotesk text-[11px] uppercase tracking-[0.08em] text-subtle">
        {label}
      </p>
      <p className="mt-1 text-[13px] leading-relaxed text-foreground">
        {value}
      </p>
    </div>
  );
}

function MediaGroup({ items }: { items: ProjectMedia[] }) {
  const allPhones = items.every((m) => m.kind === "phone");
  return (
    <FadeIn>
      <div
        className={`my-8 grid gap-6 ${
          allPhones && items.length > 1
            ? "grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {items.map((m) => (
          <figure key={m.src} className="flex flex-col items-center gap-2">
            {m.kind === "phone" ? (
              <PhoneFrame src={m.src} poster={m.poster} />
            ) : (
              <div className="relative w-full overflow-hidden rounded-md border border-border">
                <Image
                  src={m.src}
                  alt={m.caption ?? ""}
                  width={1200}
                  height={800}
                  className="h-auto w-full object-cover"
                />
              </div>
            )}
            {m.caption && (
              <figcaption className="max-w-xs text-center text-[12px] leading-relaxed text-subtle">
                {m.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </FadeIn>
  );
}

export function CaseStudy({ project }: { project: Project }) {
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const hero = project.heroImage ?? project.cover;

  return (
    <div className="flex flex-col">
      <div className="relative h-44 w-full overflow-hidden sm:h-56">
        <Image
          src={hero}
          alt={project.title}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-2xl px-6 pb-24 pt-8">
        <FadeIn>
          <BackButton href="/#work" label="Back to work" />
        </FadeIn>
        <FadeIn delay={0.06}>
          <p className="mt-6 font-grotesk text-[13px] text-muted">{project.company}</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="mt-1 text-[20px] text-foreground">{project.title}</h1>
        </FadeIn>

        <FadeIn delay={0.14}>
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
            <MetaItem label="Timeframe" value={project.timeframe} />
            <MetaItem label="Role" value={project.role} />
            <MetaItem label="Team" value={project.team} />
            <MetaItem label="Tools" value={project.tools} />
          </div>
        </FadeIn>

        {project.nda && (
          <FadeIn delay={0.18}>
            <div className="mt-8 flex flex-col gap-2">
              <p className="text-[13px] leading-relaxed text-muted">
                I&rsquo;ve signed an NDA on this project, so the process and
                outcomes aren&rsquo;t fully public. Happy to walk through it
                directly.
              </p>
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent(
                  `${project.title} case study`
                )}`}
                className="w-fit text-[13px] text-foreground underline underline-offset-4"
              >
                Email me about it ↗
              </a>
            </div>
          </FadeIn>
        )}

        <div className="mt-4 flex flex-col">
          {project.sections.map((section, i) => {
            const matchingMedia =
              project.media?.filter((m) => m.after === section.heading) ?? [];
            return (
              <div key={section.heading}>
                <FadeIn delay={0.04 * i}>
                  <div className="py-6">
                    <h2 className="font-grotesk text-[14px] font-medium text-foreground">
                      {section.heading}
                    </h2>
                    <div className="mt-2 flex flex-col gap-3">
                      {section.body.map((paragraph, j) => (
                        <p
                          key={j}
                          className="text-[14px] leading-relaxed text-muted"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </FadeIn>
                {matchingMedia.length > 0 && (
                  <MediaGroup items={matchingMedia} />
                )}
              </div>
            );
          })}
        </div>

        <FadeIn delay={0.1}>
          <Link
            href={`/work/${next.slug}`}
            className="group mt-6 flex items-center justify-between border-t border-border pt-6"
          >
            <div>
              <p className="font-grotesk text-[11px] uppercase tracking-[0.08em] text-subtle">
                Next project
              </p>
              <p className="mt-1 font-grotesk text-[14px] font-medium text-foreground">
                {next.title}
              </p>
            </div>
            <span className="text-subtle transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </FadeIn>
      </div>
    </div>
  );
}
