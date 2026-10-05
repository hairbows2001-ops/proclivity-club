<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Proclivity Club — notes for contributors

- Content lives in `content/` and is edited by a non-developer. Keep it plain data with generous comments; never require edits elsewhere to add a book.
- All derived data (themes, authors, places, related books, Atlas layout) comes from `lib/catalogue.ts`. Pages must read from there, not from `content/` directly.
- Engraving primitives in `components/bookworld/` consume a shared seeded RNG and must be rendered on the server (client strict-mode double-renders would desynchronise it). Pass server-rendered SVG into client components as children/props, as `HomeHero` does.
- Every stroked SVG path goes through `<Ink>` (it sets `pathLength=1` for the ink-in animations). Round computed coordinates with `r1()` in client components to avoid hydration mismatches.
