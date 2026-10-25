import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Maha Fatima about marketing and creative strategy roles.",
};

export default function ContactPage() {
  // Only methods with real values are shown (set them in content/site.ts).
  const methods = [
    site.email && { label: "Email", href: `mailto:${site.email}`, text: site.email },
    site.linkedin && { label: "LinkedIn", href: site.linkedin, text: site.linkedin.replace(/^https?:\/\/(www\.)?/, "") },
    site.cv && { label: "CV", href: site.cv, text: "Download CV (PDF)" },
  ].filter((m): m is { label: string; href: string; text: string } => Boolean(m));

  return (
    <>
      <header className="page-intro wrap">
        <h1 className="page-title">Contact</h1>
      </header>
      <section className="contact wrap" aria-label="Contact details">
        <p className="lede contact-lede">
          For roles, collaborations or a conversation about brand, campaign and content strategy.
        </p>
        {methods.length > 0 && (
          <dl className="contact-methods">
            {methods.map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd>
                  <a href={m.href} {...(m.label === "CV" ? { download: true } : {})}>
                    {m.text}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </section>
    </>
  );
}
