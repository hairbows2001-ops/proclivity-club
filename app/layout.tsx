import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource-variable/eb-garamond/wght.css";
import "@fontsource-variable/eb-garamond/wght-italic.css";
import "./globals.css";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/url";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { NightSky } from "@/components/celestial/NightSky";
import { MotionProvider } from "@/components/ui/MotionProvider";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { title: site.name, description: site.description, type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#111a38",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="min-h-svh antialiased">
        <a href="#main" className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-midnight focus:p-3 focus:text-gold-soft">
          Skip to content
        </a>
        <MotionProvider>
          <NightSky />
          <SiteHeader />
          <main id="main" className="relative">
            {children}
          </main>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
