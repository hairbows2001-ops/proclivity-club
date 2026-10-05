import type { Metadata } from "next";
import Link from "next/link";
import { atlas, books, booksBySlugs } from "@/lib/catalogue";
import { AtlasMap, type AtlasBook } from "@/components/atlas/AtlasMap";
import { ConstellationGlyph } from "@/components/atlas/ConstellationGlyph";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionMark } from "@/components/ui/Ornament";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "The Atlas",
  description: "A star chart of reading: every theme a constellation, every book a star.",
};

export default function AtlasPage() {
  const bookInfo: Record<string, AtlasBook> = Object.fromEntries(books.map((b) => [b.slug, { title: b.title, author: b.author, year: b.year }]));
  return (
    <>
      <PageHeader eyebrow="The Atlas" title="A chart of the reading sky" subtitle="Every theme is a constellation and every book a star. A book that belongs to several constellations shines in each of them." />

      <section aria-label="Star chart" className="px-3 sm:px-6">
        <AtlasMap constellations={atlas} books={bookInfo} />
        <p className="mx-auto mt-6 max-w-xl text-center text-mist italic">
          Hover a star to read its name; select it to enter the book. Select a constellation&rsquo;s name to see everything gathered beneath it.
        </p>
      </section>

      <section aria-labelledby="index" className="mx-auto mt-28 max-w-6xl px-5 sm:px-8">
        <SectionMark id="index">Index of constellations</SectionMark>
        <ul className="mt-12 grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {atlas.map((c, i) => (
            <Reveal as="li" key={c.theme.slug} delay={(i % 3) * 0.1}>
              <Link href={`/constellations/${c.theme.slug}`} className="group flex gap-5">
                <ConstellationGlyph constellation={c} className="h-20 w-20 shrink-0 transition-opacity duration-700 group-hover:opacity-100 opacity-80" />
                <div>
                  <h3 className="display text-3xl text-parchment transition-colors duration-700 group-hover:text-gold-soft">{c.theme.name}</h3>
                  {c.theme.latin && <p className="text-sm text-mist italic">{c.theme.latin}</p>}
                  <p className="mt-2 text-sm text-mist">{booksBySlugs(c.theme.books).map((b) => b.title).join(" · ")}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
