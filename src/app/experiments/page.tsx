import type { Metadata } from "next";
import { FadeIn } from "@/components/FadeIn";
import { PrototypeFrame } from "@/components/PrototypeFrame";
import { experiments } from "@/lib/experiments";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: `Experiments — ${profile.name}`,
};

export default function ExperimentsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pb-24 pt-24 sm:pt-28">
      <FadeIn delay={0.03}>
        <p className="mt-6 font-grotesk text-[11px] uppercase tracking-[0.18em] text-subtle">
          Prototypes & Experiments
        </p>
        <h1 className="mt-3 max-w-2xl font-grotesk text-[clamp(1.8rem,4.5vw,2.5rem)] font-semibold leading-tight text-foreground">
          Quick standalone UI prototypes that don&rsquo;t warrant a full case
          study.
        </h1>
      </FadeIn>

      {experiments.length > 0 ? (
        <FadeIn delay={0.1}>
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2">
            {experiments.map((exp) => (
              <PrototypeFrame key={exp.title} src={exp.src} title={exp.title} />
            ))}
          </div>
        </FadeIn>
      ) : (
        <FadeIn delay={0.1}>
          <p className="mt-10 text-[13px] text-subtle">Coming soon.</p>
        </FadeIn>
      )}
    </div>
  );
}
