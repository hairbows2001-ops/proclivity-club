import type { Metadata } from "next";
import Link from "next/link";
import { atlas, booksBySlugs } from "@/lib/catalogue";
import { ConstellationGlyph } from "@/components/atlas/ConstellationGlyph";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = { title: "Constellations", description: "The themes of the atlas, each drawn as a constellation of books." };

export default function ConstellationsPage() {
  return (
    <>
      <PageHeader eyebrow="Constellations" title="The figures of the sky" subtitle="Themes that recur across books, drawn as constellations. Each one is formed automatically from the books that share it." />
      <ul className="mx-auto grid max-w-6xl gap-x-10 gap-y-20 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        {atlas.map((c, i) => (
          <Reveal as="li" key={c.theme.slug} delay={(i % 3) * 0.1}>
            <Link href={`/constellations/${c.theme.slug}`} className="group block text-center">
              <ConstellationGlyph constellation={c} className="mx-auto h-40 w-40 opacity-85 transition-opacity duration-700 group-hover:opacity-100" />
              <h2 className="display mt-6 text-4xl text-parchment transition-colors duration-700 group-hover:text-gold-soft">{c.theme.name}</h2>
              {c.theme.latin && <p className="text-mist italic">{c.theme.latin}</p>}
              <p className="mx-auto mt-4 max-w-xs text-mist">{c.theme.description}</p>
              <p className="label mt-5 text-[0.7rem] text-gold-deep">
                {c.theme.books.length} {c.theme.books.length === 1 ? "star" : "stars"} · {booksBySlugs(c.theme.books).map((b) => b.title).slice(0, 2).join(", ")}
                {c.theme.books.length > 2 && "…"}
              </p>
            </Link>
          </Reveal>
        ))}
      </ul>
    </>
  );
}
