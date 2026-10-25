import type { Metadata } from "next";
import { images } from "@/content/images";
import { CaseIntro, CaseSection, NextProject } from "@/components/Case";
import { ImageRow } from "@/components/ImageRow";

export const metadata: Metadata = {
  title: "Compass",
  description: "Compass — a concept caregiving app. Brand strategy, identity and digital product.",
};

export default function CompassPage() {
  return (
    <article>
      <CaseIntro
        slug="compass"
        subtitle="Guiding your health. Every day."
        meta={[
          { label: "Disciplines", value: "Brand Strategy, Identity Design, Creative Direction, Digital Product" },
          { label: "Scope", value: "Strategy, Identity, Visual System, Product Experience, UX/UI, Digital" },
          { label: "Sector", value: "Caregiving, Health Tech" },
        ]}
      >
        <p>
          Compass is a conceptual caregiving app designed to help young adults support their aging parents with
          more clarity and less anxiety.
        </p>
      </CaseIntro>

      <div className="case-hero wrap">
        <ImageRow images={[images.compassHero]} eager />
      </div>

      <CaseSection label="Concept" title="Reduce the cognitive load of care.">
        <p>
          Caring for a parent means keeping track of appointments, medication, check-ins and the family members
          sharing the work. Compass brings care coordination, reminders, resources and family communication into
          one calm, guided digital experience.
        </p>
      </CaseSection>

      <CaseSection label="Brand identity" title="Reassurance, simplicity and modern digital design.">
        <p>
          A four-point star held inside a circle — a compass that orients rather than alarms. The identity is
          designed to make care feel more manageable, supportive and human.
        </p>
        <div className="body-image">
          <ImageRow images={[images.compassLogo]} />
        </div>
      </CaseSection>

      <CaseSection
        label="Key screens"
        title="Answer “is everything okay?” first."
        wide={<ImageRow images={[images.compassApp]} />}
      >
        <p>
          The home screen opens on a single status — “All clear. Nothing needs your attention right now.” —
          before check-ins, medication, appointments and who is covering tonight. A shared calendar keeps the
          whole care circle on the same schedule.
        </p>
      </CaseSection>

      <CaseSection
        label="Digital experience"
        title="Know what matters. A calmer way to stay connected."
        wide={<ImageRow images={[images.compassWeb]} />}
      >
        <p>
          The website introduces Compass to families through the same cards they will use in the app, so the
          product is understood before it is downloaded.
        </p>
      </CaseSection>

      <CaseSection label="Visual system" title="Calm by default.">
        <p>
          Deep green, warm lamplight tones and soft translucent cards give the product a domestic rather than
          clinical feel. Status is always written plainly — “All clear”, “Taken”, “Everything handled” — so
          reassurance comes before detail.
        </p>
      </CaseSection>

      <NextProject slug="compass" />
    </article>
  );
}
