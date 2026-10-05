import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { paragraphs } from "@/lib/format";
import { books, litThemes, places } from "@/lib/catalogue";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "About", description: site.description };

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title={site.motto} subtitle={site.tagline} />
      <div className="prose-atlas mx-auto px-5 sm:px-0">
        {paragraphs(site.about).map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <dl className="mx-auto mt-20 grid max-w-2xl grid-cols-3 gap-6 border-y border-[var(--rule)] px-5 py-8 text-center">
        {[["Worlds", books.length, "/library"], ["Constellations", litThemes.length, "/constellations"], ["Places", places.length, "/places"]].map(([label, n, href]) => (
          <div key={label as string}>
            <dt className="label text-[0.7rem] text-gold-deep">{label}</dt>
            <dd className="display mt-2 text-5xl text-gold-soft">
              <Link href={href as string}>{n}</Link>
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
