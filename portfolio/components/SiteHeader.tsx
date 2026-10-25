import Link from "next/link";
import { nav, site } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="site-header wrap">
      <Link href="/" className="wordmark">
        {site.name}
      </Link>
      <nav aria-label="Main">
        <ul className="nav-list">
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
