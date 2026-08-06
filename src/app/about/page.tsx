import type { Metadata } from "next";
import { CaseStudyNav } from "@/components/CaseStudyNav";
import { FadeIn } from "@/components/FadeIn";
import { StampBoard } from "@/components/about/StampBoard";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: `About — ${profile.name}`,
};

const STATS = [
  { value: "08", label: "Projects shipped" },
  { value: "05", label: "Design awards" },
  { value: "09", label: "Contract design projects" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pb-24 pt-24 sm:pt-28">
      <CaseStudyNav items={[]} backHref="/" />
      <FadeIn delay={0.03}>
        <p className="mt-6 font-grotesk text-[11px] uppercase tracking-[0.18em] text-subtle">
          About me
        </p>
        <h1 className="mt-3 max-w-2xl font-grotesk text-[clamp(1.8rem,4.5vw,2.5rem)] font-semibold leading-tight text-foreground">
          {profile.aboutBio}
        </h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="mt-14">
          <p className="font-grotesk text-[11px] uppercase tracking-[0.18em] text-subtle">
            Hobbies and minor disasters
          </p>
          <div className="mt-4">
            <StampBoard />
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.16}>
        <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-[3fr_2fr] sm:gap-8">
          <div>
            <h2 className="font-grotesk text-[13px] text-foreground">
              Experience
            </h2>
            <div className="mt-2 border-t border-border" />
            <div className="mt-5 flex flex-col gap-5">
              {profile.experience.map((job) => (
                <div key={`${job.period}-${job.org}`}>
                  <p className="font-grotesk text-[26px] font-bold leading-none tracking-tight text-foreground sm:text-[30px]">
                    {job.org}{" "}
                    <span className="text-[13px] font-medium text-subtle">
                      {job.period}
                    </span>
                  </p>
                  <p className="mt-1 text-[13px] text-muted">{job.role}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-grotesk text-[13px] text-foreground">
              Stats
            </h2>
            <div className="mt-2 border-t border-border" />
            <div className="mt-5 flex flex-col gap-3">
              {STATS.map((s) => (
                <div key={s.label} className="flex items-baseline gap-3">
                  <span className="font-grotesk text-[40px] font-bold leading-none tracking-tight text-foreground">
                    {s.value}
                  </span>
                  <span className="max-w-[7rem] text-[12px] leading-snug text-muted">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.22}>
        <div className="mt-14">
          <h2 className="font-grotesk text-[13px] text-foreground">
            Education
          </h2>
          <div className="mt-2 border-t border-border" />
          <div className="mt-5 flex flex-col gap-5">
            {profile.education.map((edu) => (
              <div key={edu.org}>
                <p className="font-grotesk text-[20px] font-bold leading-tight text-foreground">
                  {edu.org}
                </p>
                <p className="mt-1 text-[13px] text-muted">{edu.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.26}>
        <div className="mt-14">
          <h2 className="font-grotesk text-[13px] text-foreground">
            Say hi
          </h2>
          <p className="mt-3 text-[14px] text-muted">
            Want to talk about a project, or just say hi? Reach me at{" "}
            <a
              href={`mailto:${profile.email}`}
              className="text-foreground underline underline-offset-4"
            >
              {profile.email}
            </a>
            .
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
