import Link from "next/link";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { images } from "@/content/images";
import { bio } from "@/content/about";
import { sortedArticles } from "@/content/writing";
import { ProjectList } from "@/components/ProjectList";
import { WritingList } from "@/components/WritingList";
import { Picture } from "@/components/Picture";

export default function Home() {
  const [before, after] = site.statement.split(site.statementAccent);
  const selectedWriting = sortedArticles.slice(0, 4);

  return (
    <>
      <section className="intro wrap" aria-labelledby="intro-title">
        <p className="intro-kicker">Portfolio</p>
        <h1 id="intro-title" className="intro-name">
          {site.name.split(" ").map((word) => (
            <span key={word}>{word} </span>
          ))}
        </h1>
        <div className="intro-sub grid-12">
          <p className="intro-role">{site.role}</p>
          <p className="intro-statement">
            {before}
            <em>{site.statementAccent}</em>
            {after}
          </p>
        </div>
      </section>

      <section id="work" className="work wrap" aria-labelledby="work-title">
        <div className="section-head">
          <h2 id="work-title">Selected work</h2>
          <p>2025–2026</p>
        </div>
        <ProjectList projects={projects} />
      </section>

      {selectedWriting.length > 0 && (
        <section className="selected-writing wrap" aria-labelledby="writing-title">
          <div className="section-head">
            <h2 id="writing-title">Selected writing</h2>
          </div>
          <WritingList articles={selectedWriting} compact />
          <p className="view-all">
            <Link href="/writing/" className="arrow-link">
              View all writing <span aria-hidden="true">→</span>
            </Link>
          </p>
        </section>
      )}

      <section className="about-preview wrap" aria-labelledby="about-title">
        <div className="section-head">
          <h2 id="about-title">About me</h2>
        </div>
        <div className="about-preview-grid">
          <figure className="about-preview-portrait">
            <Picture img={images.portrait} />
          </figure>
          <div className="about-preview-text">
            <p>{bio[0]}</p>
            <p>
              <Link href="/about/" className="arrow-link">
                About Maha <span aria-hidden="true">→</span>
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
