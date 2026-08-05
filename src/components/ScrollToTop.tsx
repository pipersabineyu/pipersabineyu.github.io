"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

// Every page load should start at the top of that page, never wherever a
// previous page (or a previous visit, on reload) happened to be scrolled
// to. Two separate things fight this by default:
//  1. The browser restores scroll position on reload/back-forward
//     (history.scrollRestoration defaults to "auto") — disabled once below.
//  2. Lenis's virtual scroll position lives on a single instance mounted
//     once at the root layout, so it survives client-side route changes
//     even though the new page's real DOM starts fresh — reset on every
//     pathname change below.
export function ScrollToTop() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return null;
}
