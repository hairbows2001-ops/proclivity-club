import type { Metadata } from "next";
import { sortedArticles } from "@/content/writing";
import { WritingList } from "@/components/WritingList";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays by Maha Fatima on culture and marketing, published on Substack.",
};

export default function WritingPage() {
  return (
    <>
      <header className="page-intro wrap">
        <h1 className="page-title">
          Selected <em>writing</em>
        </h1>
      </header>
      <section className="writing wrap" aria-label="Articles">
        <p className="small-label writing-label">MISSOSOUP · Culture / Marketing</p>
        <p className="writing-intro">Essays published on Substack. Each title opens the full article.</p>
        <WritingList articles={sortedArticles} />
      </section>
    </>
  );
}
