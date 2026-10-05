import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/url";
import { authors, books, journal, litThemes, places } from "@/lib/catalogue";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "", "/atlas", "/library", "/constellations", "/journal", "/about", "/authors", "/places", "/search",
    ...books.map((b) => `/books/${b.slug}`),
    ...authors.map((a) => `/authors/${a.slug}`),
    ...litThemes.map((t) => `/constellations/${t.slug}`),
    ...places.map((p) => `/places/${p.slug}`),
    ...journal.map((e) => `/journal/${e.slug}`),
  ];
  return paths.map((p) => ({ url: siteUrl + p }));
}
