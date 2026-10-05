import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bookConstellations, books, entriesForBook, getBook, getPlace, relatedBooks } from "@/lib/catalogue";
import { paragraphs, roman } from "@/lib/format";
import { BookWorld } from "@/components/bookworld/BookWorld";
import { BookCard } from "@/components/books/BookCard";
import { BookConstellation } from "@/components/books/BookConstellation";
import { InlineLinks } from "@/components/ui/InlineLinks";
import { Ornament, SectionMark } from "@/components/ui/Ornament";
import { Reveal } from "@/components/ui/Reveal";

/* Every book in content/books.ts gets a page here automatically. */

export function generateStaticParams() {
  return books.map((b) => ({ slug: b.slug }));
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const book = getBook((await params).slug);
  if (!book) return {};
  return { title: `${book.title} — ${book.author}`, description: book.description };
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const book = getBook((await params).slug);
  if (!book) notFound();

  const groups = bookConstellations(book);
  const related = relatedBooks(book, 3);
  const journal = entriesForBook(book.slug);
  const prev = books[book.plate - 2] ?? books[books.length - 1];
  const next = books[book.plate] ?? books[0];

  return (
    <article>
      {/* ── The world ── */}
      <header className="px-3 pt-24 sm:px-8 sm:pt-28">
        <div className="mx-auto max-w-7xl">
          {/* wide plate on larger screens; a large round medallion on phones, where detail matters more than width */}
          <BookWorld book={book} animate className="hidden sm:block" label={`An engraved illustration of the world of ${book.title}.`} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/worlds/${book.slug}/medallion-ink.svg`} alt={`An engraved illustration of the world of ${book.title}.`} width={700} height={700} loading="lazy" className="mx-auto block h-auto w-full max-w-[30rem] sm:hidden" />
          <p className="label mt-4 flex justify-between text-[0.7rem] text-gold-deep">
            <span>Plate {roman(book.plate)}</span>
            <span className="hidden sm:inline">{book.locations[0]}</span>
            <span>{book.yearLabel}</span>
          </p>
        </div>
        <div className="mx-auto max-w-3xl pt-16 text-center">
          <nav aria-label="Breadcrumb" className="label text-[0.7rem] text-mist">
            <Link href="/library" className="hover:text-gold-soft">Library</Link>
            <span aria-hidden className="mx-3 text-gold-deep">/</span>
            <Link href={`/authors/${book.authorSlug}`} className="hover:text-gold-soft">{book.author}</Link>
          </nav>
          <h1 className="display mt-6 text-5xl text-parchment sm:text-7xl">{book.title}</h1>
          <p className="mt-5 text-xl text-mist italic">
            <Link href={`/authors/${book.authorSlug}`} className="link-ink">{book.author}</Link>, {book.yearLabel}
          </p>
          <Ornament className="mt-12" />
        </div>
      </header>

      <div className="mx-auto mt-20 max-w-5xl space-y-28 px-5 sm:px-8">
        {/* ── I. The place ── */}
        <Reveal as="section">
          <SectionMark numeral="I" id="the-place">The Place</SectionMark>
          <div className="mt-10 grid gap-10 md:grid-cols-[1fr_16rem]">
            <div className="prose-atlas">
              {paragraphs(book.setting ?? book.description).map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <aside>
              <p className="label text-[0.7rem] text-gold-deep">Coordinates</p>
              <ul className="mt-3 space-y-2">
                {book.placeSlugs.map((s) => {
                  const place = getPlace(s)!;
                  return (
                    <li key={s}>
                      <Link href={`/places/${s}`} className="link-ink">{place.name}</Link>
                      {place.region && <span className="text-mist italic">, {place.region}</span>}
                    </li>
                  );
                })}
              </ul>
            </aside>
          </div>
        </Reveal>

        {/* ── II. The book ── */}
        <Reveal as="section">
          <SectionMark numeral="II" id="the-book">The Book</SectionMark>
          <div className="mt-10 grid gap-10 md:grid-cols-[1fr_16rem]">
            <p className="prose-atlas">{book.description}</p>
            <dl className="space-y-5">
              {book.cover && (
                <div className="relative aspect-[2/3] w-40 border border-[var(--rule)]">
                  <Image src={book.cover} alt={`Cover of ${book.title}`} fill className="object-cover" sizes="160px" />
                </div>
              )}
              <div>
                <dt className="label text-[0.7rem] text-gold-deep">Genre</dt>
                <dd className="mt-1">{book.genres.join(", ")}</dd>
              </div>
              <div>
                <dt className="label text-[0.7rem] text-gold-deep">Feeling</dt>
                <dd className="mt-1 italic">
                  <InlineLinks items={book.moods.map((m) => ({ label: m, href: `/library?feeling=${encodeURIComponent(m)}` }))} />
                </dd>
              </div>
              {book.read && (
                <div>
                  <dt className="label text-[0.7rem] text-gold-deep">Read</dt>
                  <dd className="mt-1">{book.read}</dd>
                </div>
              )}
            </dl>
          </div>
        </Reveal>

        {/* ── III. The constellation ── */}
        <Reveal as="section">
          <SectionMark numeral="III" id="the-constellation">The Constellation</SectionMark>
          <p className="mt-8 max-w-xl text-mist italic">
            The themes this book belongs to, and the other worlds that share them.
          </p>
          <div className="mt-8 hidden sm:block">
            <BookConstellation book={book} groups={groups} />
          </div>
          <ul className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {groups.map(({ theme, companions }) => (
              <li key={theme.slug} className="border-t border-[var(--rule)] pt-4">
                <Link href={`/constellations/${theme.slug}`} className="label text-gold transition-colors hover:text-gold-soft">
                  {theme.name}
                </Link>
                {theme.latin && <span className="ml-3 text-sm text-mist italic">{theme.latin}</span>}
                <div className="mt-2 text-mist">
                  {companions.length ? (
                    <InlineLinks items={companions.map((c) => ({ label: c.title, href: `/books/${c.slug}` }))} className="italic" />
                  ) : (
                    <span className="italic">A constellation of one, for now.</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* ── IV. What remained ── */}
        <Reveal as="section">
          <SectionMark numeral="IV" id="what-remained">What Remained</SectionMark>
          <div className="mt-10 grid gap-14 md:grid-cols-[1fr_18rem]">
            <div className="prose-atlas">
              {paragraphs(book.reflection).map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="space-y-10">
              {book.quote && (
                <figure className="relative border-y border-[var(--rule-strong)] py-8 text-center">
                  <span aria-hidden className="display absolute -top-6 left-1/2 -translate-x-1/2 bg-midnight px-3 text-5xl leading-none text-gold">&ldquo;</span>
                  <blockquote className="display text-2xl leading-snug text-parchment italic">{book.quote.text}</blockquote>
                  {book.quote.source && <figcaption className="label mt-5 text-[0.7rem] text-gold-deep">{book.quote.source}</figcaption>}
                </figure>
              )}
              {book.observation && (
                <div>
                  <p className="label text-[0.7rem] text-gold-deep">Observation</p>
                  <p className="mt-2 text-lg text-gold-soft italic">{book.observation}</p>
                </div>
              )}
              {journal.length > 0 && (
                <div>
                  <p className="label text-[0.7rem] text-gold-deep">In the Journal</p>
                  <ul className="mt-2 space-y-1">
                    {journal.map((e) => (
                      <li key={e.slug}><Link href={`/journal/${e.slug}`} className="link-ink italic">{e.title}</Link></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Reveal>

        {/* ── V. Related worlds ── */}
        {related.length > 0 && (
          <section aria-labelledby="related-worlds">
            <SectionMark numeral="V" id="related-worlds">Related Worlds</SectionMark>
            <ul className="mt-14 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((b, i) => (
                <Reveal as="li" key={b.slug} delay={i * 0.12}>
                  <BookCard book={b} />
                </Reveal>
              ))}
            </ul>
          </section>
        )}

        <nav aria-label="Other plates" className="flex items-start justify-between gap-6 border-t border-[var(--rule)] pt-8">
          <Link href={`/books/${prev.slug}`} className="group max-w-[45%]">
            <span className="label text-[0.7rem] text-gold-deep">← Plate {roman(prev.plate)}</span>
            <span className="display mt-1 block text-xl text-parchment group-hover:text-gold-soft">{prev.title}</span>
          </Link>
          <Link href={`/books/${next.slug}`} className="group max-w-[45%] text-right">
            <span className="label text-[0.7rem] text-gold-deep">Plate {roman(next.plate)} →</span>
            <span className="display mt-1 block text-xl text-parchment group-hover:text-gold-soft">{next.title}</span>
          </Link>
        </nav>
      </div>
    </article>
  );
}
