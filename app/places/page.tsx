import type { Metadata } from "next";
import Link from "next/link";
import { booksBySlugs, places } from "@/lib/catalogue";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Places", description: "The real places these books are set in." };

export default function PlacesPage() {
  return (
    <>
      <PageHeader eyebrow="Gazetteer" title="Places" subtitle="Where the worlds touch the map." />
      <ul className="mx-auto max-w-3xl divide-y divide-[var(--rule)] border-y border-[var(--rule)] px-5 sm:px-0">
        {places.map((p) => (
          <li key={p.slug}>
            <Link href={`/places/${p.slug}`} className="group flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between">
              <span>
                <span className="display text-3xl text-parchment transition-colors duration-700 group-hover:text-gold-soft">{p.name}</span>
                {p.region && <span className="ml-3 text-mist italic">{p.region}</span>}
              </span>
              <span className="text-mist italic">{booksBySlugs(p.books).map((b) => b.title).join(" · ")}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
