import { FadeIn } from "@/components/FadeIn";
import { profile } from "@/lib/profile";

export function MoreSection() {
  return (
    <div className="relative mx-auto w-full max-w-2xl bg-background px-6 py-24">
      <FadeIn>
        <h2 className="font-grotesk text-[13px] text-foreground">More</h2>
        <p className="mt-3 text-[14px] text-muted">
          Read more about me{" "}
          <a href="/about" className="text-foreground underline underline-offset-4">
            here
          </a>
          , or get in touch at{" "}
          <a
            href={`mailto:${profile.email}`}
            className="text-foreground underline underline-offset-4"
          >
            {profile.email}
          </a>
          .
        </p>
      </FadeIn>
    </div>
  );
}
