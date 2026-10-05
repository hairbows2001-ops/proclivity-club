import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { booksBySlugs, getPlace, places } from "@/lib/catalogue";
import { BookCard } from "@/components/books/BookCard";
import { PageHeader } from "@/components/ui/PageHeader";

export function generateStaticParams() {
  return places.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPlace((await params).slug);
  return p ? { title: p.label, description: `Books set in ${p.label}.` } : {};
}

export default async function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const place = getPlace((await params).slug);
  if (!place) notFound();
  const books = booksBySlugs(place.books);
  return (
    <>
      <PageHeader eyebrow="Place" title={place.name} subtitle={place.region} />
      <ul className="mx-auto grid max-w-6xl gap-x-10 gap-y-16 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        {books.map((b) => (
          <li key={b.slug}>
            <BookCard book={b} headingLevel="h2" />
          </li>
        ))}
      </ul>
    </>
  );
}
