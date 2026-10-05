import Link from "next/link";
import { BookWorld } from "@/components/bookworld/BookWorld";
import { roman } from "@/lib/format";
import type { Book } from "@/lib/types";

/**
 * A book in the Library: a round engraved medallion of its world,
 * with the plate number, title, author and constellations beneath.
 */
export function BookCard({ book, headingLevel = "h3" }: { book: Book; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <article className="group relative text-center">
      <div className="relative mx-auto aspect-square w-full max-w-[18rem] transition-transform duration-[1.6s] ease-[var(--ease-ink)] group-hover:scale-[1.025]">
        <BookWorld book={book} variant="vignette" />
      </div>
      <p className="label mt-7 text-gold-deep">
        Plate {roman(book.plate)} <span aria-hidden>·</span> {book.year}
      </p>
      <H className="display mt-3 text-3xl text-parchment transition-colors duration-700 group-hover:text-gold-soft">
        <Link href={`/books/${book.slug}`} className="after:absolute after:inset-0 after:content-['']">
          {book.title}
        </Link>
      </H>
      <p className="mt-2 text-mist italic">{book.author}</p>
      <p className="mt-3 text-sm tracking-wide text-mist/80">{book.themes.slice(0, 4).join(" · ")}</p>
    </article>
  );
}
