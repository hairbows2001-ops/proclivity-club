import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
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

// Fetch the latin font files with the page, so text is set in its final fonts on first paint
// instead of reflowing (and shifting the layout) when they arrive.
const fontFiles = [
  "/fonts/bodoni-moda-latin-opsz-normal.woff2",
  "/fonts/cormorant-garamond-latin-400-italic.woff2",
  "/fonts/inter-latin-wght-normal.woff2",
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  for (const href of fontFiles) preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return (
    <html lang="en-CA">
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
