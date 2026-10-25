import type { Metadata } from "next";
import { images } from "@/content/images";
import { bio, education, experience, expertise, lede } from "@/content/about";
import { Picture } from "@/components/Picture";

export const metadata: Metadata = {
  title: "About",
  description: "Maha Fatima — marketer and creative strategist. Experience, education and expertise.",
};

function Timeline({ items }: { items: { role: string; org: string; years: string }[] }) {
  return (
    <ul className="rule-list timeline">
      {items.map((e) => (
        <li key={e.role + e.org}>
          <span className="timeline-role">{e.role}</span>
          <span className="timeline-org">{e.org}</span>
          <span className="timeline-years">{e.years}</span>
        </li>
      ))}
    </ul>
  );
}

export default function AboutPage() {
  return (
    <>
      <header className="page-intro wrap">
        <h1 className="page-title">About</h1>
      </header>

      <section className="about wrap" aria-label="Biography">
        <figure className="about-portrait">
          <Picture img={images.portrait} eager />
        </figure>
        <div className="about-bio">
          <p className="lede">{lede}</p>
          {bio.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
        </div>
      </section>

      <div className="about-details wrap">
        <section aria-labelledby="experience">
          <h2 id="experience" className="case-label">Experience</h2>
          <Timeline items={experience} />
        </section>
        <section aria-labelledby="education">
          <h2 id="education" className="case-label">Education</h2>
          <Timeline items={education} />
        </section>
        <section aria-labelledby="expertise">
          <h2 id="expertise" className="case-label">Expertise</h2>
          <ul className="rule-list">
            {expertise.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
