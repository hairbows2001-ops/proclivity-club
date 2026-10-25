import Link from "next/link";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { images } from "@/content/images";
import { bio } from "@/content/about";
import { ProjectList } from "@/components/ProjectList";
import { Picture } from "@/components/Picture";

export default function Home() {
  return (
    <>
      <section className="intro wrap" aria-labelledby="intro-title">
        <h1 id="intro-title" className="intro-name">
          {site.name}
        </h1>
        <div className="intro-sub grid-12">
          <p className="intro-role">{site.role}</p>
          <p className="intro-statement">{site.statement}</p>
        </div>
      </section>

      <section id="work" className="work wrap" aria-labelledby="work-title">
        <div className="section-head">
          <h2 id="work-title">Selected work</h2>
          <p>2025–2026</p>
        </div>
        <ProjectList projects={projects} />
      </section>

      <section className="about-preview wrap" aria-labelledby="about-title">
        <div className="section-head">
          <h2 id="about-title">About</h2>
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
