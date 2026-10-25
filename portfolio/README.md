# Maha Fatima — portfolio

A small Next.js site exported as static HTML. It is independent of the
Proclivity Club site in the repository root.

```bash
cd portfolio
npm install
npm run dev      # http://localhost:3000
npm run build    # static site written to out/
```

Deploy the `out/` folder to any static host, or point Vercel/Netlify at this
folder (root directory `portfolio`, build command `npm run build`, output `out`).

## Editing content

- `content/site.ts` — name, footer line, email address, navigation
- `content/projects.ts` — the selected-work list on the homepage
- `content/about.ts` — biography, experience, education, expertise
- `public/images/` — WebP images cropped from the portfolio PDF pages
