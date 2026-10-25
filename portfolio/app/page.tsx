import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { bio, experience, expertise, portrait } from "@/content/about";
import { ProjectList } from "@/components/ProjectList";
import { Picture } from "@/components/Picture";

export default function Home() {
  const [current, ...previous] = experience;

  return (
    <>
      <section className="intro wrap" aria-labelledby="intro-title">
        <p className="eyebrow">{site.disciplines.join(" · ")}</p>
        <h1 id="intro-title" className="display">
          <span className="visually-hidden">{site.name}, </span>
          Marketer and creative strategist building brands, campaigns and content systems that connect
          strategy with <em>visual storytelling.</em>
        </h1>
        <dl className="intro-facts">
          <div>
            <dt>Currently</dt>
            <dd>
              {current.role}, {current.org}
            </dd>
          </div>
          <div>
            <dt>Previously</dt>
            <dd>{previous.map((e) => `${e.role}, ${e.org}`).join("; ")}</dd>
          </div>
          <div>
            <dt>Education</dt>
            <dd>BA, Liberal Studies, University of Waterloo</dd>
          </div>
        </dl>
      </section>

      <section id="work" className="work wrap" aria-labelledby="work-title">
        <div className="section-head">
          <h2 id="work-title">Selected work</h2>
          <p>2025–2026</p>
        </div>
        <ProjectList projects={projects} />
      </section>

      <section className="about-teaser wrap" aria-labelledby="about-title">
        <div className="section-head">
          <h2 id="about-title">About</h2>
        </div>
        <div className="about-grid">
          <figure className="about-portrait">
            <Picture img={portrait} />
          </figure>
          <div className="about-text">
            <p className="lede">I am a marketer and creative strategist.</p>
            {bio.map((para) => (
              <p key={para.slice(0, 16)}>{para}</p>
            ))}
          </div>
          <div className="about-expertise">
            <h3 className="eyebrow">Expertise</h3>
            <ul className="rule-list">
              {expertise.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
