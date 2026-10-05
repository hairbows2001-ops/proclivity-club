import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { authors, booksBySlugs, getAuthor, getTheme, places } from "@/lib/catalogue";
import { BookCard } from "@/components/books/BookCard";
import { InlineLinks } from "@/components/ui/InlineLinks";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionMark } from "@/components/ui/Ornament";
import { Reveal } from "@/components/ui/Reveal";

export function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getAuthor((await params).slug);
  return a ? { title: a.name, description: a.bio ?? `Books by ${a.name} in the atlas.` } : {};
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const author = getAuthor((await params).slug);
  if (!author) notFound();
  const books = booksBySlugs(author.books);
  const themeSlugs = [...new Set(books.flatMap((b) => b.themeSlugs))];
  const authorPlaces = places.filter((p) => p.books.some((b) => author.books.includes(b)));
  const dates = author.born ? `${author.born}–${author.died ?? ""}` : undefined;

  return (
    <>
      <PageHeader eyebrow="Author" title={author.name} subtitle={dates} />
      <div className="mx-auto max-w-6xl space-y-24 px-5 sm:px-8">
        {author.bio && <p className="prose-atlas mx-auto text-center">{author.bio}</p>}

        <section aria-labelledby="worlds">
          <SectionMark id="worlds">{books.length === 1 ? "One world" : `${books.length} worlds`} in the atlas</SectionMark>
          <ul className="mt-14 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((b, i) => (
              <Reveal as="li" key={b.slug} delay={(i % 3) * 0.1}>
                <BookCard book={b} />
              </Reveal>
            ))}
          </ul>
        </section>

        <section aria-labelledby="charts" className="grid gap-12 sm:grid-cols-2">
          <div>
            <SectionMark id="charts">Constellations</SectionMark>
            <InlineLinks className="mt-6 text-lg" items={themeSlugs.map((s) => ({ label: getTheme(s)!.name, href: `/constellations/${s}` }))} />
          </div>
          <div>
            <SectionMark>Places</SectionMark>
            <InlineLinks className="mt-6 text-lg" items={authorPlaces.map((p) => ({ label: p.name, href: `/places/${p.slug}` }))} />
          </div>
        </section>
      </div>
    </>
  );
}
