import Link from "next/link";

/** A row of links separated by small dots — used for themes, places and moods. */
export function InlineLinks({ items, className = "" }: { items: { href?: string; label: string }[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${className}`}>
      {items.map((item, i) => (
        <li key={item.label} className="flex items-baseline gap-3">
          {i > 0 && <span aria-hidden className="text-gold-deep">·</span>}
          {item.href ? (
            <Link href={item.href} className="link-ink">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
