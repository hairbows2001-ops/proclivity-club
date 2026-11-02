import Link from "next/link";
import { nav, site } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="site-header wrap">
      {/* No prefetch: prefetching Home would add its hero-image preload to every page. */}
      <Link href="/" className="wordmark" prefetch={false}>
        {site.name}
      </Link>
      <nav aria-label="Main">
        <ul className="nav-list">
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} prefetch={false}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
