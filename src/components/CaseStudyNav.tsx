"use client";

import { useEffect, useState } from "react";

export type CaseStudyNavItem = { id: string; label: string };

// A left-margin table of contents for long case studies — fixed to the
// viewport (not the centered content column) so it holds its position at
// eye level while the page scrolls. Hidden below `lg` — there's no room
// for a third column once the content column itself needs the full width.
export function CaseStudyNav({ items }: { items: CaseStudyNavItem[] }) {
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

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Case study sections"
      className="fixed left-8 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3.5 xl:left-12 lg:flex"
    >
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
