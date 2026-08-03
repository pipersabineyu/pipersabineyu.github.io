"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/lib/profile";
import { LiveClock } from "@/components/home/LiveClock";
import { RoleCycle } from "@/components/home/RoleCycle";

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 font-grotesk text-foreground ${
        isHome ? "" : "bg-background"
      }`}
    >
      <nav className="flex items-center justify-between p-6 sm:p-8">
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
        <div className="flex items-center gap-4 text-[13px] font-medium tracking-wide sm:gap-5">
          <LiveClock />
          <Link
            href="/about"
            className={
              !isHome && pathname === "/about"
                ? "text-foreground"
                : "text-subtle transition-colors hover:text-foreground"
            }
          >
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
