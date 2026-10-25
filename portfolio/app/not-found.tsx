import Link from "next/link";

export default function NotFound() {
  return (
    <section className="intro wrap">
      <p className="eyebrow">404</p>
      <h1 className="display">This page doesn’t exist.</h1>
      <p className="back-link">
        <Link href="/">Back to the homepage</Link>
      </p>
    </section>
  );
}
