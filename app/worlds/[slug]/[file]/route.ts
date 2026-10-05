/**
 * Static BookWorld medallions — /worlds/<slug>/medallion.svg
 *
 * Library cards show many engravings at once. Rendering each one as a
 * standalone SVG file at build time keeps pages light (the drawing is
 * downloaded once and cached instead of being repeated inside every page)
 * while looking exactly the same: the file embeds the same stroke, depth and
 * motion rules as the site (app/etching.css) and the same colour tokens.
 *
 *   medallion.svg       the round medallion, as on Library cards
 *   medallion-ink.svg   the same, inking itself in (book pages on phones)
 */

import { createElement } from "react";
import fs from "node:fs";
import path from "node:path";
import { books, getBook } from "@/lib/catalogue";
import { BookWorld } from "@/components/bookworld/BookWorld";
import { renderSvg } from "@/lib/svg-markup";

const FILES = { "medallion.svg": false, "medallion-ink.svg": true } as const;
type FileName = keyof typeof FILES;

export function generateStaticParams() {
  return books.flatMap((b) => (Object.keys(FILES) as FileName[]).map((file) => ({ slug: b.slug, file })));
}

let styles: string | undefined;
function embeddedStyles() {
  if (styles) return styles;
  const globals = fs.readFileSync(path.join(process.cwd(), "app/globals.css"), "utf8");
  const etching = fs.readFileSync(path.join(process.cwd(), "app/etching.css"), "utf8");
  // the colour tokens, taken from the @theme block so there is one source of truth
  const tokens = [...globals.matchAll(/(--color-[a-z-]+:\s*#[0-9a-f]{3,8});/gi)].map((m) => m[1]).join(";");
  styles = `:root{${tokens}}${etching.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ")}`;
  return styles;
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string; file: string }> }) {
  const { slug, file } = await params;
  const book = getBook(slug);
  if (!book || !(file in FILES)) return new Response("Not found", { status: 404 });

  const markup = renderSvg(createElement(BookWorld, { book, variant: "vignette", animate: FILES[file as FileName] }));
  const svg = markup.replace(
    /^<svg /,
    `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="700" `,
  ).replace(/^(<svg[^>]*>)/, `$1<style>${embeddedStyles()}</style>`);

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
