import type { Metadata } from "next";
import Link from "next/link";
import { authors, booksBySlugs } from "@/lib/catalogue";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = { title: "Authors", description: "The writers whose worlds appear in the atlas." };

export default function AuthorsPage() {
  return (
    <>
      <PageHeader eyebrow="Authors" title="The cartographers" subtitle="The writers who drew these worlds." />
      <ul className="mx-auto max-w-3xl divide-y divide-[var(--rule)] border-y border-[var(--rule)] px-5 sm:px-0">
        {authors.map((a, i) => (
          <Reveal as="li" key={a.slug} delay={i * 0.06}>
            <Link href={`/authors/${a.slug}`} className="group flex flex-col gap-1 py-7 sm:flex-row sm:items-baseline sm:justify-between">
              <span className="display text-4xl text-parchment transition-colors duration-700 group-hover:text-gold-soft">{a.name}</span>
              <span className="text-mist italic">
                {booksBySlugs(a.books).map((b) => b.title).join(" · ")}
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </>
  );
}
