import type { Metadata } from "next";
import { books, getTheme } from "@/lib/catalogue";
import { BookCard } from "@/components/books/BookCard";
import { LibraryBrowser, type LibraryEntry } from "@/components/library/LibraryBrowser";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "The Library",
  description: "Every world in the atlas, catalogued by author, genre, feeling, theme, place and decade.",
};

export default function LibraryPage() {
  const entries: LibraryEntry[] = books.map((b) => ({
    slug: b.slug,
    title: b.title,
    year: b.year,
    plate: b.plate,
    facets: {
      author: [b.author],
      genre: b.genres,
      feeling: b.moods,
      theme: b.themeSlugs.map((s) => getTheme(s)!.name),
      place: b.locations.map((l) => l.split(",")[0].trim()),
      decade: [b.decade],
    },
    card: <BookCard book={b} headingLevel="h2" />,
  }));

  return (
    <>
      <PageHeader eyebrow="The Library" title="Every world, catalogued" subtitle="Each book is a plate in the atlas. Refine the catalogue by author, genre, feeling, theme, place or decade." />
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <LibraryBrowser entries={entries} />
      </div>
    </>
  );
}
