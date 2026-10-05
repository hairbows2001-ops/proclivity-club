import Link from "next/link";
import { atlas, books, journal } from "@/lib/catalogue";
import { formatDate, paragraphs } from "@/lib/format";
import { site } from "@/content/site";
import { HomeHero } from "@/components/home/HomeHero";
import { heroLandscape } from "@/components/home/heroLandscape";
import { BookCard } from "@/components/books/BookCard";
import { ConstellationGlyph } from "@/components/atlas/ConstellationGlyph";
import { Ornament, Pendants, SectionMark } from "@/components/ui/Ornament";
import { Reveal } from "@/components/ui/Reveal";

export default function HomePage() {
  const recent = [...books].reverse().slice(0, 3);
  const latest = journal[0];
  return (
    <>
      <HomeHero landscape={heroLandscape()} />

      {/* An opening paragraph */}
      <section className="relative mx-auto max-w-3xl px-5 pt-24 text-center sm:px-8">
        <Pendants count={7} className="mx-auto mb-16 max-w-md opacity-70" />
        <Reveal>
          <p className="label text-gold">The idea</p>
          <p className="display mt-8 text-[clamp(1.6rem,3.6vw,2.4rem)] leading-snug text-parchment">{paragraphs(site.about)[0]}</p>
        </Reveal>
        <Ornament className="mt-16" />
      </section>

      {/* Constellations */}
      <section aria-labelledby="home-constellations" className="mx-auto mt-28 max-w-6xl px-5 sm:px-8">
        <SectionMark id="home-constellations">The constellations</SectionMark>
        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {atlas.slice(0, 10).map((c, i) => (
            <Reveal as="li" key={c.theme.slug} delay={(i % 5) * 0.08}>
              <Link href={`/constellations/${c.theme.slug}`} className="group block text-center">
                <ConstellationGlyph constellation={c} className="mx-auto h-24 w-24 opacity-80 transition-opacity duration-700 group-hover:opacity-100" />
                <span className="display mt-3 block text-2xl text-parchment transition-colors duration-700 group-hover:text-gold-soft">{c.theme.name}</span>
                {c.theme.latin && <span className="text-sm text-mist italic">{c.theme.latin}</span>}
              </Link>
            </Reveal>
          ))}
        </ul>
        <p className="mt-12 text-center">
          <Link href="/atlas" className="label text-gold hover:text-gold-soft">See them on the chart →</Link>
        </p>
      </section>

      {/* Recently entered */}
      <section aria-labelledby="home-recent" className="mx-auto mt-32 max-w-6xl px-5 sm:px-8">
        <SectionMark id="home-recent">Recently entered worlds</SectionMark>
        <ul className="mt-14 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((b, i) => (
            <Reveal as="li" key={b.slug} delay={i * 0.12}>
              <BookCard book={b} />
            </Reveal>
          ))}
        </ul>
        <p className="mt-14 text-center">
          <Link href="/library" className="label text-gold hover:text-gold-soft">The whole library →</Link>
        </p>
      </section>

      {/* From the journal */}
      {latest && (
        <section aria-labelledby="home-journal" className="mx-auto mt-32 max-w-3xl px-5 text-center sm:px-8">
          <SectionMark id="home-journal">From the journal</SectionMark>
          <Reveal>
            <Link href={`/journal/${latest.slug}`} className="group mt-12 block">
              <time dateTime={latest.date} className="label text-[0.7rem] text-gold-deep">{formatDate(latest.date)}</time>
              <h2 className="display mt-4 text-4xl text-parchment transition-colors duration-700 group-hover:text-gold-soft sm:text-5xl">{latest.title}</h2>
              <p className="mt-4 text-lg text-mist italic">{latest.excerpt}</p>
            </Link>
          </Reveal>
        </section>
      )}
    </>
  );
}
