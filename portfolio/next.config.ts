import path from "node:path";
import type { NextConfig } from "next";

// Static export: `npm run build` writes a plain HTML/CSS site to `out/`,
// which can be hosted anywhere (Vercel, Netlify, GitHub Pages, S3…).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  // This folder is a standalone project; don't pick up config from the repo root.
  turbopack: { root: path.join(__dirname) },
};

export default nextConfig;
