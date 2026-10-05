import type { Metadata } from "next";
import { authors, booksBySlugs, books, journal, litThemes, places } from "@/lib/catalogue";
import { SearchClient, type SearchItem } from "@/components/search/SearchClient";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Search", description: "Search the atlas." };

const norm = (...parts: (string | undefined)[]) =>
  parts.filter(Boolean).join(" ").normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function SearchPage() {
  const items: SearchItem[] = [
    ...books.map((b) => ({
      kind: "Book" as const,
      title: b.title,
      subtitle: `${b.author}, ${b.year}`,
      href: `/books/${b.slug}`,
      text: norm(b.title, b.author, String(b.year), b.description, b.setting, b.reflection, b.quote?.text, ...b.themes, ...b.locations, ...b.moods, ...b.genres, b.world.landmark, b.world.landscape),
    })),
    ...authors.map((a) => ({ kind: "Author" as const, title: a.name, subtitle: booksBySlugs(a.books).map((b) => b.title).join(" · "), href: `/authors/${a.slug}`, text: norm(a.name, a.bio) })),
    ...litThemes.map((t) => ({ kind: "Constellation" as const, title: t.name, subtitle: t.latin, href: `/constellations/${t.slug}`, text: norm(t.name, t.latin, t.description) })),
    ...places.map((p) => ({ kind: "Place" as const, title: p.name, subtitle: p.region, href: `/places/${p.slug}`, text: norm(p.label) })),
    ...journal.map((e) => ({ kind: "Journal" as const, title: e.title, subtitle: e.excerpt, href: `/journal/${e.slug}`, text: norm(e.title, e.excerpt, e.body) })),
  ];
  return (
    <>
      <PageHeader eyebrow="Search" title="Consult the index" />
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SearchClient items={items} />
      </div>
    </>
  );
}
