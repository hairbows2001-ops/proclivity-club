import Link from "next/link";
import { nav, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer wrap">
      <p className="footer-line">{site.footerLine}</p>
      <div className="footer-meta">
        <p>© {new Date().getFullYear()} {site.name}</p>
        {site.email && (
          <p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        )}
        {site.linkedin && (
          <p>
            <a href={site.linkedin}>LinkedIn</a>
          </p>
        )}
        <ul className="nav-list">
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
