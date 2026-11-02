import Link from "next/link";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { images } from "@/content/images";
import { preview } from "@/content/about";
import { sortedArticles } from "@/content/writing";
import { ProjectList } from "@/components/ProjectList";
import { WritingList } from "@/components/WritingList";
import { Picture } from "@/components/Picture";

export default function Home() {
  const [before, after] = site.intro.split(site.introAccent);
  const selectedWriting = sortedArticles.slice(0, 4);

  return (
    <>
      <section className="intro wrap" aria-labelledby="intro-title">
        <h1 id="intro-title" className="intro-name" data-reveal="mask">
          <span className="mask-line">
            {site.name.split(" ").map((word) => (
              <span key={word}>{word} </span>
            ))}
          </span>
        </h1>
        <div className="intro-sub grid-12">
          <p className="intro-role" data-reveal="fade" style={{ "--d": "260ms" } as React.CSSProperties}>
            {site.role}
          </p>
          <div className="intro-body">
            <p className="intro-statement" data-reveal="fade" style={{ "--d": "380ms" } as React.CSSProperties}>
              {before}
              <em>{site.introAccent}</em>
              {after}
            </p>
            <p className="intro-more" data-reveal="fade" style={{ "--d": "540ms" } as React.CSSProperties}>
              <a href="#work" className="arrow-link">
                View selected work <span aria-hidden="true">↓</span>
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="work-across wrap" aria-labelledby="across-title">
        <div className="work-across-grid" data-reveal="section">
          <h2 id="across-title" className="work-across-title">
            what I work across
          </h2>
          <ul className="work-across-list">
            {site.workAcross.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="work" className="work wrap" aria-labelledby="work-title">
        <div className="section-head" data-reveal="head">
          <h2 id="work-title">Selected work</h2>
          <p>2025–2026</p>
        </div>
        <ProjectList projects={projects} />
      </section>

      {selectedWriting.length > 0 && (
        <section className="selected-writing wrap" aria-labelledby="writing-title">
          <div className="section-head" data-reveal="head">
            <h2 id="writing-title">Selected writing</h2>
          </div>
          <WritingList articles={selectedWriting} compact />
          <p className="view-all" data-reveal="fade">
            <Link prefetch={false} href="/writing/" className="arrow-link">
              View all writing <span aria-hidden="true">→</span>
            </Link>
          </p>
        </section>
      )}

      <section className="about-preview wrap" aria-labelledby="about-title">
        <div className="section-head" data-reveal="head">
          <h2 id="about-title">About me</h2>
        </div>
        <div className="about-preview-grid">
          <figure className="about-preview-portrait" data-reveal="image">
            <Picture img={images.portrait} />
          </figure>
          <div className="about-preview-text" data-reveal="fade" style={{ "--d": "140ms" } as React.CSSProperties}>
            <p>{preview}</p>
            <p>
              <Link prefetch={false} href="/about/" className="arrow-link">
                About Maha <span aria-hidden="true">→</span>
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
