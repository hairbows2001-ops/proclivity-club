import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { authors, booksBySlugs, getConstellation, litThemes, neighbouringThemes } from "@/lib/catalogue";
import { ConstellationChart } from "@/components/atlas/ConstellationChart";
import { ConstellationGlyph } from "@/components/atlas/ConstellationGlyph";
import { BookCard } from "@/components/books/BookCard";
import { InlineLinks } from "@/components/ui/InlineLinks";
import { Ornament, SectionMark } from "@/components/ui/Ornament";
import { Reveal } from "@/components/ui/Reveal";

export function generateStaticParams() {
  return litThemes.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getConstellation((await params).slug);
  return c ? { title: `${c.theme.name} — a constellation`, description: c.theme.description } : {};
}

export default async function ConstellationPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getConstellation((await params).slug);
  if (!c) notFound();
  const books = booksBySlugs(c.theme.books);
  const neighbours = neighbouringThemes(c.theme);
  const writers = authors.filter((a) => a.books.some((b) => c.theme.books.includes(b)));

  return (
    <>
      <header className="mx-auto max-w-4xl px-5 pt-36 text-center sm:px-8 sm:pt-44">
        <p className="label text-gold">
          <Link href="/constellations" className="hover:text-gold-soft">Constellation</Link>
        </p>
        <h1 className="display mt-5 text-6xl text-parchment sm:text-8xl">{c.theme.name}</h1>
        {c.theme.latin && <p className="mt-2 text-xl text-mist italic">{c.theme.latin}</p>}
        <p className="mx-auto mt-8 max-w-2xl text-xl">{c.theme.description}</p>
        <div className="mt-14">
          <ConstellationChart constellation={c} books={books} />
        </div>
        <p className="label mt-6 text-[0.7rem] text-gold-deep">
          {books.length} {books.length === 1 ? "star" : "stars"}
          {writers.length > 0 && <> · charted by {writers.map((w) => w.name).join(", ")}</>}
        </p>
        <Ornament className="mt-14" />
      </header>

      <div className="mx-auto mt-20 max-w-6xl space-y-28 px-5 sm:px-8">
        <section aria-labelledby="stars">
          <SectionMark id="stars">The stars of {c.theme.name}</SectionMark>
          <ul className="mt-14 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((b, i) => (
              <Reveal as="li" key={b.slug} delay={(i % 3) * 0.1}>
                <BookCard book={b} />
              </Reveal>
            ))}
          </ul>
        </section>

        {neighbours.length > 0 && (
          <section aria-labelledby="neighbours">
            <SectionMark id="neighbours">Neighbouring constellations</SectionMark>
            <p className="mt-6 max-w-xl text-mist italic">Constellations that share stars with {c.theme.name}, nearest first.</p>
            <ul className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
              {neighbours.map(({ theme, shared }) => {
                const nc = getConstellation(theme.slug)!;
                return (
                  <li key={theme.slug}>
                    <Link href={`/constellations/${theme.slug}`} className="group block text-center">
                      <ConstellationGlyph constellation={nc} className="mx-auto h-20 w-20 opacity-80 group-hover:opacity-100" />
                      <span className="display mt-3 block text-2xl text-parchment group-hover:text-gold-soft">{theme.name}</span>
                      <span className="text-sm text-mist italic">{shared} shared {shared === 1 ? "star" : "stars"}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <InlineLinks className="justify-center text-mist" items={[{ label: "Return to the Atlas", href: "/atlas" }, { label: "All constellations", href: "/constellations" }]} />
      </div>
    </>
  );
}
