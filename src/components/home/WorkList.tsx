import { FadeIn } from "@/components/FadeIn";
import { PhoneFrame } from "@/components/PhoneFrame";
import { experiments } from "@/lib/experiments";

// Quick standalone UI explorations — iPhone-frame prototypes that don't
// warrant a full case study, unlike the projects covered in the hero
// scroll-through above. Distinct from that section on purpose: this one
// is for the work-in-progress/sketch-quality stuff.
export function WorkList() {
  return (
    <div id="work" className="mx-auto w-full max-w-2xl scroll-mt-20 px-6 py-24">
      <FadeIn>
        <h2 className="font-grotesk text-[13px] text-foreground">
          Experiments
        </h2>
        {experiments.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {experiments.map((exp) => (
              <PhoneFrame key={exp.title} src={exp.src} poster={exp.poster} />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-[13px] text-subtle">Coming soon.</p>
        )}
      </FadeIn>
    </div>
  );
}
