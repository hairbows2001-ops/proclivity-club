/** Small engraved marks used throughout the site. */

export function StarMark({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden fill="currentColor">
      <path d="M10 0l1.6 8.4L20 10l-8.4 1.6L10 20l-1.6-8.4L0 10l8.4-1.6z" />
    </svg>
  );
}

/** A centred divider: hairline — star — hairline. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 text-gold ${className}`} aria-hidden>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--rule-strong)] sm:w-24" />
      <svg viewBox="0 0 60 16" className="h-4 w-14" fill="none" stroke="currentColor" strokeWidth="0.6">
        <circle cx="30" cy="8" r="5.5" />
        <path d="M30 0.5v15M22.5 8h15" />
        <path d="M30 3.5l1 3.5 3.5 1-3.5 1-1 3.5-1-3.5-3.5-1 3.5-1z" fill="currentColor" stroke="none" />
        <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
        <circle cx="48" cy="8" r="1" fill="currentColor" stroke="none" />
        <path d="M2 8h6M52 8h6" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--rule-strong)] sm:w-24" />
    </div>
  );
}

/** A section heading in engraved capitals, with an optional numeral. */
export function SectionMark({ numeral, children, id }: { numeral?: string; children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="label flex items-center gap-4 text-gold">
      {numeral && <span className="font-display text-base normal-case tracking-normal text-gold-deep italic">{numeral}</span>}
      <span>{children}</span>
      <span className="h-px flex-1 bg-gradient-to-r from-[var(--rule)] to-transparent" aria-hidden />
    </h2>
  );
}

/**
 * Hanging star pendants — threads of tiny beads ending in four-pointed stars,
 * after old celestial book covers. Purely decorative.
 */
export function Pendants({ count = 9, className = "" }: { count?: number; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none flex justify-between ${className}`}>
      {Array.from({ length: count }, (_, i) => {
        const len = 2.5 + ((i * 37) % 5) * 1.1 + (i % 2) * 1.6; // rem
        const big = i % 3 === 1;
        return (
          <div key={i} className="flex flex-col items-center text-gold" style={{ opacity: big ? 0.8 : 0.5 }}>
            <span className="w-px border-l border-dotted border-gold/60" style={{ height: `${len}rem` }} />
            <svg viewBox="0 0 20 20" className={big ? "h-4 w-4" : "h-2.5 w-2.5"} fill="currentColor">
              <path d="M10 0l1.4 8.6L20 10l-8.6 1.4L10 20l-1.4-8.6L0 10l8.6-1.4z" />
              {big && <circle cx="10" cy="10" r="4.2" fill="none" stroke="currentColor" strokeWidth="0.5" />}
            </svg>
          </div>
        );
      })}
    </div>
  );
}
