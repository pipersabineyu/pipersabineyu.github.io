"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/lib/profile";
import { LiveClock } from "@/components/home/LiveClock";
import { RoleCycle } from "@/components/home/RoleCycle";

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

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isCaseStudy = pathname.startsWith("/work/");
  const isAbout = pathname === "/about";

  const back = isCaseStudy
    ? { href: "/#work", label: "Back to work" }
    : isAbout
      ? { href: "/", label: "Back" }
      : null;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 font-grotesk text-foreground ${
        isHome ? "" : "bg-background"
      }`}
    >
      <nav className="flex items-center justify-between p-6 sm:p-8">
        {/* Back sits noticeably further from the brand link than the two
            right-side links sit from each other — it's a page-specific
            escape hatch, not another item in the persistent site nav, so
            the spacing keeps it from reading as part of that group. */}
        <div className="flex items-center gap-7 sm:gap-8">
          {back && (
            <Link
              href={back.href}
              className="hidden items-center gap-1.5 text-[13px] font-medium tracking-wide text-foreground transition-colors hover:text-subtle sm:inline-flex"
            >
              <BackArrow />
              {back.label}
            </Link>
          )}
          <Link
            href="/"
            className="text-[13px] font-medium tracking-wide transition-opacity hover:opacity-60"
          >
            {profile.name}
            {isHome && (
              <span className="hidden sm:inline">
                <span className="text-subtle"> — </span>
                <RoleCycle />
              </span>
            )}
          </Link>
        </div>
        <div className="flex items-center gap-4 text-[13px] font-medium tracking-wide sm:gap-5">
          <LiveClock />
          <Link
            href="/about"
            className={
              pathname === "/about"
                ? "text-subtle"
                : "text-foreground transition-colors hover:text-subtle"
            }
          >
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
