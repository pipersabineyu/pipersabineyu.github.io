"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type CaseStudyNavItem = { id: string; label: string };

// Same color/style as the section items below it (text-subtle, hovers to
// text-foreground) — reads as the first entry in this list, not a
// separate control, so no label: just the arrow.
function BackArrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

// A left-margin table of contents for long case studies — fixed to the
// viewport (not the centered content column) so it holds its position at
// eye level while the page scrolls. Hidden below `lg` — there's no room
// for a third column once the content column itself needs the full width.
// `backHref` renders an arrow-only link above the section items (or alone,
// on pages with no sections, e.g. About) in the exact same style.
export function CaseStudyNav({
  items,
  backHref,
}: {
  items: CaseStudyNavItem[];
  backHref?: string;
}) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    if (items.length === 0) return;
    const handler = () => {
      // The section whose top has scrolled just past this line reads as
      // "current" — matches where a reader's eye actually sits, rather
      // than waiting for a section to reach the very top of the viewport.
      const threshold = 200;
      let current = items[0]?.id;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= threshold) {
          current = item.id;
        }
      }
      setActiveId(current);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [items]);

  if (items.length === 0 && !backHref) return null;

  return (
    <nav
      aria-label="Case study sections"
      className="fixed left-8 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3.5 xl:left-12 lg:flex"
    >
      {backHref && (
        <Link
          href={backHref}
          className="text-subtle transition-colors hover:text-muted"
        >
          <BackArrow />
        </Link>
      )}
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById(item.id)
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className={`font-grotesk text-[11px] uppercase tracking-[0.14em] transition-colors ${
            activeId === item.id
              ? "text-foreground"
              : "text-subtle hover:text-muted"
          }`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
