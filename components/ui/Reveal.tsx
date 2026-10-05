"use client";

import { motion } from "framer-motion";

/** Content that fades gently into view as it is scrolled to. */
export function Reveal({ children, delay = 0, className, as = "div" }: { children: React.ReactNode; delay?: number; className?: string; as?: "div" | "section" | "li" }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.4, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </M>
  );
}
