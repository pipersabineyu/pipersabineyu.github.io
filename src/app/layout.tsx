import type { Metadata } from "next";
import { Figtree, Space_Grotesk, Playfair_Display } from "next/font/google";
import { ReactLenis } from "lenis/react";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LoadingScreen } from "@/components/LoadingScreen";
import { profile } from "@/lib/profile";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.title}`,
  description: profile.heroBio,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${figtree.variable} ${spaceGrotesk.variable} ${playfairDisplay.variable}`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <ReactLenis root options={{ lerp: 0.1, duration: 1.2 }} />
        <LoadingScreen />
        <Nav />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
