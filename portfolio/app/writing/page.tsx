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
        <h1 className="page-title">Writing</h1>
      </header>
      <section className="writing wrap" aria-label="Articles">
        <p className="writing-intro">
          Essays on culture and marketing, published on Substack. Each opens the full article.
        </p>
        <WritingList articles={sortedArticles} />
      </section>
    </>
  );
}
