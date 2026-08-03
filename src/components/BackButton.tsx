"use client";

import Link from "next/link";

export function BackButton({
  href = "/",
  label = "Back",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3.5 py-1.5 font-grotesk text-[11px] uppercase tracking-[0.14em] text-subtle backdrop-blur-md transition-colors hover:text-foreground"
    >
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
      {label}
    </Link>
  );
}
