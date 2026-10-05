import type { Metadata } from "next";
import Link from "next/link";
import { journal } from "@/lib/catalogue";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = { title: "Journal", description: "Notes from the observatory." };

export default function JournalPage() {
  return (
    <>
      <PageHeader eyebrow="Journal" title="Notes from the observatory" subtitle="Observations, wanderings and second readings." />
      <ul className="mx-auto max-w-3xl space-y-16 px-5 sm:px-8">
        {journal.map((e, i) => (
          <Reveal as="li" key={e.slug} delay={i * 0.08}>
            <Link href={`/journal/${e.slug}`} className="group block">
              <time dateTime={e.date} className="label text-[0.7rem] text-gold-deep">{formatDate(e.date)}</time>
              <h2 className="display mt-3 text-4xl text-parchment transition-colors duration-700 group-hover:text-gold-soft sm:text-5xl">{e.title}</h2>
              <p className="mt-3 text-lg text-mist italic">{e.excerpt}</p>
            </Link>
          </Reveal>
        ))}
      </ul>
    </>
  );
}
