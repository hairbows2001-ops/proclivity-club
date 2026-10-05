"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * The Library's catalogue drawers. Cards are drawn on the server and passed
 * in; this component only decides which ones to show. Filters are kept in
 * the address bar so a filtered view can be bookmarked or shared.
 */

export interface LibraryEntry {
  slug: string;
  title: string;
  year: number;
  plate: number;
  facets: Record<FacetKey, string[]>;
  card: React.ReactNode;
}

export type FacetKey = "author" | "genre" | "feeling" | "theme" | "place" | "decade";

const FACETS: { key: FacetKey; label: string }[] = [
  { key: "author", label: "Author" },
  { key: "genre", label: "Genre" },
  { key: "feeling", label: "Feeling" },
  { key: "theme", label: "Theme" },
  { key: "place", label: "Place" },
  { key: "decade", label: "Decade" },
];

const ORDERS = {
  plate: { label: "As catalogued", sort: (a: LibraryEntry, b: LibraryEntry) => a.plate - b.plate },
  year: { label: "By year", sort: (a: LibraryEntry, b: LibraryEntry) => a.year - b.year },
  title: { label: "By title", sort: (a: LibraryEntry, b: LibraryEntry) => a.title.replace(/^(the|a|an) /i, "").localeCompare(b.title.replace(/^(the|a|an) /i, "")) },
};
type Order = keyof typeof ORDERS;

/** "1920s" → 1920, "460s BC" → -460, so decades sort in time order. */
const decadeValue = (d: string) => (d.endsWith("BC") ? -parseInt(d, 10) : parseInt(d, 10));

const NUMBERS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];

export function LibraryBrowser({ entries }: { entries: LibraryEntry[] }) {
  const [filters, setFilters] = useState<Partial<Record<FacetKey, string>>>({});
  const [order, setOrder] = useState<Order>("plate");
  const [open, setOpen] = useState(false);

  // Read filters from the address bar on arrival…
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initial: Partial<Record<FacetKey, string>> = {};
    FACETS.forEach(({ key }) => {
      const v = params.get(key);
      if (v) initial[key] = v;
    });
    if (Object.keys(initial).length) {
      setFilters(initial);
      setOpen(true);
    }
    const o = params.get("order");
    if (o && o in ORDERS) setOrder(o as Order);
  }, []);

  // …and write them back as they change.
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
    if (order !== "plate") params.set("order", order);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [filters, order]);

  const options = useMemo(() => {
    const out = {} as Record<FacetKey, string[]>;
    FACETS.forEach(({ key }) => {
      const values = [...new Set(entries.flatMap((e) => e.facets[key]))];
      out[key] = key === "decade" ? values.sort((a, b) => decadeValue(a) - decadeValue(b)) : values.sort((a, b) => a.localeCompare(b));
    });
    return out;
  }, [entries]);

  const visible = entries
    .filter((e) => FACETS.every(({ key }) => !filters[key] || e.facets[key].includes(filters[key]!)))
    .sort(ORDERS[order].sort);

  const active = Object.values(filters).filter(Boolean).length;
  const count = visible.length;
  const countWord = count < NUMBERS.length ? NUMBERS[count] : String(count);

  return (
    <div>
      <div className="border-y border-[var(--rule)] py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="display text-2xl text-parchment italic" aria-live="polite">
            {countWord} {count === 1 ? "world" : "worlds"}
            {active > 0 && <span className="text-mist"> of {entries.length}</span>}
          </p>
          <div className="flex items-center gap-6">
            <Field label="Order" id="order">
              <select id="order" value={order} onChange={(e) => setOrder(e.target.value as Order)} className={selectClass}>
                {Object.entries(ORDERS).map(([k, o]) => (
                  <option key={k} value={k}>{o.label}</option>
                ))}
              </select>
            </Field>
            <button type="button" className="label text-gold transition-colors hover:text-gold-soft" aria-expanded={open} aria-controls="library-filters" onClick={() => setOpen((v) => !v)}>
              {open ? "Close" : "Refine"}{active > 0 && ` (${active})`}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="library-filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 pt-6 sm:grid-cols-3 lg:grid-cols-6">
                {FACETS.map(({ key, label }) => (
                  <Field key={key} label={label} id={`f-${key}`}>
                    <select
                      id={`f-${key}`}
                      value={filters[key] ?? ""}
                      onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value || undefined }))}
                      className={`${selectClass} w-full`}
                    >
                      <option value="">Any</option>
                      {options[key].map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </Field>
                ))}
              </div>
              {active > 0 && (
                <button type="button" onClick={() => setFilters({})} className="label mt-6 text-mist transition-colors hover:text-gold-soft">
                  Clear all
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {count === 0 ? (
        <div className="py-24 text-center">
          <p className="display text-3xl text-parchment italic">No world lies at these coordinates.</p>
          <button type="button" onClick={() => setFilters({})} className="label mt-6 text-gold hover:text-gold-soft">
            Clear the filters
          </button>
        </div>
      ) : (
        <ul className="mt-16 grid gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((e) => (
              <motion.li key={e.slug} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }}>
                {e.card}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}

const selectClass =
  "appearance-none bg-transparent border-0 border-b border-[var(--rule-strong)] pr-6 pb-1 font-serif text-lg text-parchment focus:border-gold-soft focus:outline-none cursor-pointer bg-[length:10px] bg-[right_2px_center] bg-no-repeat bg-[url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' fill='none' stroke='%23c5a36a' stroke-width='0.8'/></svg>\")] [&>option]:bg-midnight";

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="label text-[0.7rem] text-gold-deep">
        {label}
      </label>
      {children}
    </div>
  );
}
