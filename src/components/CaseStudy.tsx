import Image from "next/image";
import Link from "next/link";
import { CaseStudyNav } from "@/components/CaseStudyNav";
import { FadeIn } from "@/components/FadeIn";
import { PhoneFrame } from "@/components/PhoneFrame";
import { WalkthroughEmbed } from "@/components/WalkthroughEmbed";
import { profile } from "@/lib/profile";
import { projects, type Project, type ProjectMedia } from "@/lib/projects";

function sectionId(index: number) {
  return `section-${index}`;
}

// The one small-caps "label" treatment used everywhere — meta labels,
// before/after chips, next-project eyebrow, media captions' context tag.
// Previously each of these had picked a slightly different tracking value;
// consolidated to one so the case study reads as one consistent system.
const EYEBROW = "font-grotesk text-[11px] uppercase tracking-[0.14em] text-subtle";

function MetaItem({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className={EYEBROW}>{label}</p>
      <p className="mt-1 text-[13px] leading-relaxed text-foreground">
        {value}
      </p>
    </div>
  );
}

// Phone/prototype media sits on its own soft gray "stage" — same off-white
// surface tone as the about page's stamp board — so screen recordings read
// as artifacts being presented, not raw screenshots floating on the page.
function PhoneStage({ items }: { items: ProjectMedia[] }) {
  return (
    <FadeIn>
      <div className="my-8 rounded-3xl border border-border bg-surface px-6 py-10 sm:px-10 sm:py-14">
        <div
          className={`mx-auto grid grid-cols-1 gap-x-10 gap-y-12 ${
            items.length > 1 ? "max-w-xl sm:grid-cols-2" : "max-w-[260px]"
          }`}
        >
          {items.map((m) => (
            <figure key={m.src} className="flex flex-col items-center gap-5">
              <PhoneFrame src={m.src} poster={m.poster} />
              {m.caption && (
                <figcaption className="max-w-[240px] text-center text-[12px] leading-relaxed text-subtle">
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

// Reserved for content that isn't a UI screen recording at all — an
// animatic, process footage. No stage, no border, no heading or caption
// of its own — just the video, playing plainly under whatever section
// heading it's attached to.
function ContextMedia({ item }: { item: ProjectMedia }) {
  // A couple of context items are self-contained interactive HTML bundles
  // (the same kind of prototype export used on the Experiments page)
  // rather than a plain video file — those get scaled down as a whole
  // (WalkthroughEmbed) rather than resized, so the real app layout inside
  // doesn't reflow into a broken narrow-viewport state.
  if (item.src.endsWith(".html")) {
    return (
      <FadeIn>
        <div className="mt-2 mb-8">
          <WalkthroughEmbed src={item.src} />
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <div className="mt-2 mb-8">
        <video
          className="w-full rounded-2xl"
          src={item.src}
          poster={item.poster}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </FadeIn>
  );
}

function MediaGroup({ items }: { items: ProjectMedia[] }) {
  const context = items.find((m) => m.kind === "context");
  if (context) return <ContextMedia item={context} />;

  const phones = items.filter((m) => m.kind === "phone");
  if (phones.length > 0) return <PhoneStage items={phones} />;

  // Stacked full-width rather than a side-by-side grid — at half-width
  // these screenshots (real product UI, small text and controls) weren't
  // legible. One per row, as big as the column allows.
  return (
    <FadeIn>
      <div className="my-8 flex flex-col gap-10">
        {items.map((m) => (
          <figure key={m.src} className="flex flex-col items-center gap-3">
            <div className="relative w-full overflow-hidden rounded-md border border-border">
              <Image
                src={m.src}
                alt={m.caption ?? ""}
                width={1600}
                height={1000}
                className="h-auto w-full object-cover"
              />
            </div>
            {m.caption && (
              <figcaption className="max-w-md text-center text-[12px] leading-relaxed text-subtle">
                {m.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </FadeIn>
  );
}

// A left-aligned pull-quote break — used to give a single, load-bearing line
// (the core insight or hypothesis) its own visual beat between sections.
function PullQuote({ quote }: { quote: string }) {
  return (
    <FadeIn>
      <div className="my-10">
        <p className="max-w-lg font-playfair text-[clamp(1.3rem,3.6vw,1.9rem)] leading-snug text-foreground">
          {quote}
        </p>
      </div>
    </FadeIn>
  );
}

// Surfaces several distinct points side by side, numbered, instead of
// flattening them into one paragraph — makes the complexity legible.
// Shared by "challenges" (distinct problems) and "insights" (distinct
// things learned about the landscape before designing anything).
function NumberedGrid({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  return (
    <div className="mt-6 flex flex-col gap-6">
      {items.map((c, i) => (
        <div
          key={c.title}
          className="flex gap-4 border-t border-border pt-6 first:border-t-0 first:pt-0"
        >
          <p className="font-grotesk text-[11px] text-subtle">
            {String(i + 1).padStart(2, "0")}
          </p>
          <div>
            <p className="font-grotesk text-[15px] font-medium text-foreground">
              {c.title}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              {c.body}
            </p>
          </div>
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
        <p className={EYEBROW}>Before</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted line-through decoration-border">
          {before}
        </p>
      </div>
      <span className="hidden self-center text-subtle sm:block">→</span>
      <div className="flex-1 rounded-2xl border border-border bg-surface px-5 py-4">
        <p className={EYEBROW}>After</p>
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

  const navItems = project.sections
    .map((s, i) => {
      const label = s.navLabel ?? (s.kind !== "quote" ? s.heading : undefined);
      return label && label.trim() ? { id: sectionId(i), label } : null;
    })
    .filter((item): item is { id: string; label: string } => item !== null);

  return (
    <div className="flex flex-col">
      <CaseStudyNav items={navItems} />
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
        <Link
          href="/"
          aria-label="Back"
          className="absolute left-6 top-20 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/40 text-foreground backdrop-blur-md transition-colors hover:bg-background/60 sm:left-8 sm:top-24"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>

      <div className="mx-auto w-full max-w-2xl px-6 pb-24 pt-8">
        <FadeIn delay={0.06}>
          <p className={`mt-6 ${EYEBROW}`}>{project.company}</p>
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
            const isQuote = section.kind === "quote" && section.quote;

            return (
              <div key={i} id={sectionId(i)} className="scroll-mt-28">
                {isQuote ? (
                  <PullQuote quote={section.quote!} />
                ) : (
                  <FadeIn delay={0.04 * i}>
                    <div className="py-6">
                      {section.navLabel && (
                        <p className={`mb-2 ${EYEBROW}`}>{section.navLabel}</p>
                      )}
                      <h2 className="font-grotesk text-[19px] font-semibold leading-snug text-foreground sm:text-[21px]">
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
                      {(section.kind === "challenges" ||
                        section.kind === "insights") &&
                        section.cards && (
                          <NumberedGrid items={section.cards} />
                        )}
                      {section.stateBefore && section.stateAfter && (
                        <StateShift
                          before={section.stateBefore}
                          after={section.stateAfter}
                        />
                      )}
                    </div>
                  </FadeIn>
                )}
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
              <p className={EYEBROW}>Next project</p>
              <p className="mt-1 font-grotesk text-[15px] font-medium text-foreground">
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
