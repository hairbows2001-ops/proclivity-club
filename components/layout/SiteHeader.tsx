"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { mainNav, secondaryNav } from "./nav";
import { StarMark } from "@/components/ui/Ornament";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close the menu whenever the page changes.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      menuButtonRef.current?.focus();
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/" className="label flex items-center gap-3 text-gold transition-colors duration-500 hover:text-gold-soft" aria-label="Proclivity Club — home">
          <StarMark className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Proclivity Club</span>
          <span className="sm:hidden">P · C</span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`label transition-colors duration-500 hover:text-gold-soft ${isActive(item.href) ? "text-gold-soft" : "text-mist"}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/search" aria-label="Search" className={`block transition-colors duration-500 hover:text-gold-soft ${isActive("/search") ? "text-gold-soft" : "text-mist"}`}>
                <SearchGlyph />
              </Link>
            </li>
          </ul>
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          className="label -mr-2 p-2 text-gold md:hidden"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-50 flex flex-col bg-midnight px-6 py-6 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <span className="label flex items-center gap-3 text-gold">
                <StarMark className="h-3.5 w-3.5" /> Proclivity Club
              </span>
              <button ref={closeRef} type="button" className="label -mr-2 p-2 text-gold" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <nav aria-label="Main" className="flex flex-1 flex-col justify-center">
              <ul className="space-y-5">
                {[{ href: "/", label: "Home" }, ...mainNav].map((item, i) => (
                  <motion.li key={item.href} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06, duration: 0.6 }}>
                    <Link href={item.href} className={`display text-4xl ${isActive(item.href) && item.href !== "/" ? "text-gold-soft" : "text-parchment"}`}>
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <ul className="mt-12 flex gap-6 border-t border-[var(--rule)] pt-6">
                {secondaryNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="label text-mist">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function SearchGlyph() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
      <circle cx="8.5" cy="8.5" r="6" />
      <path d="M13 13l5 5" strokeLinecap="round" />
      <path d="M8.5 5.2v1.4M8.5 10.4v1.4M5.2 8.5h1.4M10.4 8.5h1.4" strokeWidth="0.6" />
    </svg>
  );
}
