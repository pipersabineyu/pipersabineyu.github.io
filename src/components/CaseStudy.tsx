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

// Phone/prototype media sits on its own soft gray "stage" — same off-white
// surface tone as the about page's stamp board — so screen recordings read
// as artifacts being presented, not raw screenshots floating on the page.
function MediaGroup({ items }: { items: ProjectMedia[] }) {
  const allPhones = items.every((m) => m.kind === "phone");

  if (allPhones) {
    return (
      <FadeIn>
        <div className="my-8 rounded-3xl border border-border bg-surface px-6 py-10 sm:px-10 sm:py-14">
          <div
            className={`mx-auto grid grid-cols-1 gap-8 ${
              items.length > 1 ? "max-w-xl sm:grid-cols-2" : "max-w-[260px]"
            }`}
          >
            {items.map((m) => (
              <figure key={m.src} className="flex flex-col items-center gap-3">
                <PhoneFrame src={m.src} poster={m.poster} />
                {m.caption && (
                  <figcaption className="max-w-[220px] text-center text-[12px] leading-relaxed text-subtle">
                    {m.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <div className="my-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {items.map((m) => (
          <figure key={m.src} className="flex flex-col items-center gap-2">
            <div className="relative w-full overflow-hidden rounded-md border border-border">
              <Image
                src={m.src}
                alt={m.caption ?? ""}
                width={1200}
                height={800}
                className="h-auto w-full object-cover"
              />
            </div>
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

// A centered pull-quote break — used to give a single, load-bearing line
// (the core insight or hypothesis) its own visual beat between sections.
function PullQuote({ quote }: { quote: string }) {
  return (
    <FadeIn>
      <div className="my-4 border-y border-border py-10 text-center">
        <p className="mx-auto max-w-lg font-playfair text-[clamp(1.3rem,3.6vw,1.9rem)] leading-snug text-foreground">
          &ldquo;{quote}&rdquo;
        </p>
      </div>
    </FadeIn>
  );
}

// Surfaces several distinct problems side by side, numbered, instead of
// flattening them into one paragraph — makes the complexity legible.
function ChallengeGrid({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3">
      {items.map((c, i) => (
        <div key={c.title}>
          <p className="font-grotesk text-[11px] text-subtle">
            {String(i + 1).padStart(2, "0")}
          </p>
          <p className="mt-2 font-grotesk text-[15px] font-medium text-foreground">
            {c.title}
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            {c.body}
          </p>
        </div>
      ))}
    </div>
  );
}

// Makes a value proposition concrete by naming the old mental model and the
// new one side by side, rather than leaving it implicit in prose.
function StateShift({ before, after }: { before: string; after: string }) {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch">
      <div className="flex-1 rounded-2xl border border-border bg-background px-5 py-4">
        <p className="font-grotesk text-[10px] uppercase tracking-[0.14em] text-subtle">
          Before
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted line-through decoration-border">
          {before}
        </p>
      </div>
      <span className="hidden self-center text-subtle sm:block">→</span>
      <div className="flex-1 rounded-2xl border border-border bg-surface px-5 py-4">
        <p className="font-grotesk text-[10px] uppercase tracking-[0.14em] text-subtle">
          After
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-foreground">
          {after}
        </p>
      </div>
    </div>
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
          <p className="mt-6 font-grotesk text-[11px] uppercase tracking-[0.18em] text-subtle">
            {project.company}
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="mt-3 max-w-2xl font-grotesk text-[clamp(1.6rem,4vw,2.3rem)] font-semibold leading-tight text-foreground">
            {project.title}
          </h1>
        </FadeIn>
        <FadeIn delay={0.13}>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
            {project.blurb}
          </p>
        </FadeIn>

        <FadeIn delay={0.16}>
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

            if (section.kind === "quote" && section.quote) {
              return <PullQuote key={i} quote={section.quote} />;
            }

            return (
              <div key={i}>
                <FadeIn delay={0.04 * i}>
                  <div className="py-6">
                    <h2 className="font-grotesk text-[14px] font-medium text-foreground">
                      {section.heading}
                    </h2>
                    {section.body && (
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
                    )}
                    {section.kind === "challenges" && section.challenges && (
                      <ChallengeGrid items={section.challenges} />
                    )}
                    {section.stateBefore && section.stateAfter && (
                      <StateShift
                        before={section.stateBefore}
                        after={section.stateAfter}
                      />
                    )}
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
