"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export interface SearchItem {
  kind: "Book" | "Author" | "Constellation" | "Place" | "Journal";
  title: string;
  subtitle?: string;
  href: string;
  /** Everything searchable, lower-cased. */
  text: string;
}

const KINDS: SearchItem["kind"][] = ["Book", "Author", "Constellation", "Place", "Journal"];
const PLURAL: Record<SearchItem["kind"], string> = { Book: "Worlds", Author: "Authors", Constellation: "Constellations", Place: "Places", Journal: "Journal" };

const normalise = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function SearchClient({ items }: { items: SearchItem[] }) {
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQ(new URLSearchParams(window.location.search).get("q") ?? "");
    input.current?.focus();
  }, []);

  useEffect(() => {
    const url = q ? `?q=${encodeURIComponent(q)}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [q]);

  const results = useMemo(() => {
    const terms = normalise(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return items
      .map((item) => {
        const title = normalise(item.title);
        if (!terms.every((t) => item.text.includes(t))) return null;
        const score = terms.reduce((s, t) => s + (title.startsWith(t) ? 5 : title.includes(t) ? 3 : 1), 0);
        return { item, score };
      })
      .filter((r): r is { item: SearchItem; score: number } => r !== null)
      .sort((a, b) => b.score - a.score);
  }, [q, items]);

  return (
    <div>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="relative">
        <label htmlFor="q" className="sr-only">Search the atlas</label>
        <input
          ref={input}
          id="q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="A title, an author, a place, a feeling…"
          autoComplete="off"
          className="display w-full border-0 border-b border-[var(--rule-strong)] bg-transparent pb-3 text-center text-3xl text-parchment placeholder:text-mist/60 placeholder:italic focus:border-gold-soft focus:outline-none sm:text-4xl"
        />
      </form>

      <div aria-live="polite" className="mt-14">
        {q && results.length === 0 && <p className="text-center text-xl text-mist italic">Nothing in the sky by that name — yet.</p>}
        {KINDS.map((kind) => {
          const group = results.filter((r) => r.item.kind === kind);
          if (!group.length) return null;
          return (
            <section key={kind} className="mb-12">
              <h2 className="label text-gold">{PLURAL[kind]}</h2>
              <ul className="mt-4 divide-y divide-[var(--rule)] border-t border-[var(--rule)]">
                {group.map(({ item }) => (
                  <li key={item.href}>
                    <Link href={item.href} className="group flex flex-col py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                      <span className="display text-2xl text-parchment transition-colors duration-500 group-hover:text-gold-soft">{item.title}</span>
                      {item.subtitle && <span className="text-mist italic">{item.subtitle}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
        {!q && (
          <p className="text-center text-mist italic">
            Try <button type="button" className="link-ink" onClick={() => setQ("lighthouse")}>lighthouse</button>,{" "}
            <button type="button" className="link-ink" onClick={() => setQ("grief")}>grief</button> or{" "}
            <button type="button" className="link-ink" onClick={() => setQ("luminous")}>luminous</button>.
          </p>
        )}
      </div>
    </div>
  );
}
