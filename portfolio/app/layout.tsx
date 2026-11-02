import fs from "node:fs";
import path from "node:path";
import type { Metadata, Viewport } from "next";
import "./fonts.css";
import "./globals.css";
import { site } from "@/content/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: { default: `${site.name} — ${site.role}`, template: `%s — ${site.name}` },
  description: site.description,
  openGraph: { title: site.name, description: site.description, type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

// Reveal script, inlined so it runs before first paint (see motion/reveal.js).
const revealScript = fs.readFileSync(path.join(process.cwd(), "motion/reveal.js"), "utf8");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The reveal script sets data-motion on <html> before hydration.
    <html lang="en-CA" suppressHydrationWarning>
      <head>
        <script id="reveal" dangerouslySetInnerHTML={{ __html: revealScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
