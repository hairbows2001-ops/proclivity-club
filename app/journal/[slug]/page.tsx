import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { booksBySlugs, getEntry, journal } from "@/lib/catalogue";
import { formatDate, paragraphs } from "@/lib/format";
import { BookCard } from "@/components/books/BookCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionMark } from "@/components/ui/Ornament";

export function generateStaticParams() {
  return journal.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const e = getEntry((await params).slug);
  return e ? { title: e.title, description: e.excerpt } : {};
}

export default async function EntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const entry = getEntry((await params).slug);
  if (!entry) notFound();
  const books = booksBySlugs(entry.books ?? []);
  return (
    <article>
      <PageHeader eyebrow={formatDate(entry.date)} title={entry.title} subtitle={entry.excerpt} />
      <div className="prose-atlas mx-auto px-5 sm:px-0">
        {paragraphs(entry.body).map((p, i) => <p key={i}>{p}</p>)}
      </div>
      {books.length > 0 && (
        <section aria-labelledby="worlds" className="mx-auto mt-24 max-w-5xl px-5 sm:px-8">
          <SectionMark id="worlds">Worlds mentioned</SectionMark>
          <ul className="mt-12 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((b) => <li key={b.slug}><BookCard book={b} /></li>)}
          </ul>
        </section>
      )}
      <p className="mt-20 text-center">
        <Link href="/journal" className="label text-gold hover:text-gold-soft">← All entries</Link>
      </p>
    </article>
  );
}
