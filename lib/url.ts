import { site } from "@/content/site";

/**
 * The site's absolute address, used for the sitemap and link previews.
 * 1. NEXT_PUBLIC_SITE_URL, once a real domain is chosen (set it in Vercel);
 * 2. otherwise the address Vercel gives this deployment (previews work correctly);
 * 3. otherwise the placeholder in content/site.ts.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : site.url)
).replace(/\/$/, "");
