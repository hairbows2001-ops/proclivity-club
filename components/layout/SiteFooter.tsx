import Link from "next/link";
import { site } from "@/content/site";
import { Ornament } from "@/components/ui/Ornament";
import { mainNav, secondaryNav } from "./nav";

export function SiteFooter() {
  return (
    <footer className="relative mt-32 px-5 pb-12 sm:px-8">
      <Ornament />
      <div className="mx-auto mt-10 max-w-3xl text-center">
        <p className="display text-2xl text-gold italic">{site.motto}</p>
        <nav aria-label="Footer" className="mt-8">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            {[...mainNav, ...secondaryNav].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="label text-mist transition-colors duration-500 hover:text-gold-soft">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-10 text-sm text-mist/80 italic">{site.colophon}</p>
      </div>
    </footer>
  );
}
