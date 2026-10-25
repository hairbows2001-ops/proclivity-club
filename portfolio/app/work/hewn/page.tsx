import type { Metadata } from "next";
import { images } from "@/content/images";
import { CaseIntro, CaseSection, NextProject } from "@/components/Case";
import { ImageRow } from "@/components/ImageRow";

export const metadata: Metadata = {
  title: "HEWN",
  description: "HEWN — sculptural objects for movement. A concept wellness brand: strategy, identity, packaging, digital and retail.",
};

export default function HewnPage() {
  return (
    <article>
      <CaseIntro
        slug="hewn"
        subtitle="Sculptural Objects for Movement"
        meta={[
          { label: "Disciplines", value: "Brand Strategy, Identity Design, Packaging, Creative Direction, Digital" },
          { label: "Scope", value: "Strategy, Identity, Visual System, Experience, Digital + Retail" },
          { label: "Sector", value: "Wellness" },
        ]}
      >
        <p>
          A conceptual wellness brand built at the intersection of movement, interiors and industrial design.
          HEWN transforms traditionally utilitarian exercise equipment into sculptural objects designed to be
          seen as much as they are used.
        </p>
        <p>
          The brand combines natural materials, restrained forms and architectural visual language to make
          movement feel like part of the home rather than something stored away.
        </p>
      </CaseIntro>

      <div className="case-hero wrap">
        <ImageRow images={[images.hewnHero]} eager />
      </div>

      <CaseSection label="Strategy" title="Designed to be seen. Made to be used.">
        <p>
          Most exercise equipment is made to be put away. HEWN positions it as something to live with: objects
          in oak, ash and stone that earn a place in the room, then get picked up and used.
        </p>
        <dl className="pairs">
          <div>
            <dt>Line</dt>
            <dd>Objects for movement.</dd>
          </div>
          <div>
            <dt>Promise</dt>
            <dd>Sculptural fitness equipment designed to be seen. Made to be used.</dd>
          </div>
          <div>
            <dt>Belief</dt>
            <dd>Movement deserves a place in the home.</dd>
          </div>
        </dl>
      </CaseSection>

      <CaseSection
        label="Visual identity"
        title="A heavy, geometric wordmark and a palette taken from the materials."
        wide={
          <>
            <div className="identity-grid">
              <ImageRow images={[images.hewnLogo]} />
              <div className="identity-stack">
                <ImageRow images={[images.hewnConstruct]} />
                <ImageRow images={[images.hewnPalette]} />
              </div>
            </div>
            <ImageRow images={[images.hewnApplications]} caption="Identity in use: stationery, swing tag, signage, bottle, shipping box." />
          </>
        }
      >
        <p>
          The wordmark is drawn on a strict construction grid. Colour comes from the objects themselves: Black
          Ash, Bone, Sand, Oak, Sage and Slate.
        </p>
      </CaseSection>

      <CaseSection
        label="Product system"
        title="Two collections, one language."
        wide={<ImageRow images={[images.hewnOak, images.hewnBlackAsh]} />}
      >
        <p>
          The Oak Collection brings together six sculptural objects in solid oak. The Black Ash Collection
          reworks four classic dumbbell forms in black ash and natural stone.
        </p>
      </CaseSection>

      <CaseSection
        label="Packaging"
        title="An unboxing in seven steps."
        wide={<ImageRow images={[images.hewnPackaging, images.hewnGrain]} />}
      >
        <p>
          Box, sleeve, foam, dust bag, weight, care guide and certificate of authenticity. Each piece arrives
          like a crafted object rather than gym equipment.
        </p>
      </CaseSection>

      <CaseSection
        label="Digital"
        title="E-commerce with the same restraint."
        wide={<ImageRow images={[images.hewnProduct, images.hewnWood]} />}
      >
        <p>
          Product pages lead with large photography, then materials, weight options and specifications, with
          related objects kept quiet underneath.
        </p>
      </CaseSection>

      <CaseSection
        label="Retail & environment"
        title="A pop-up exhibition, not a shop."
        wide={
          <div className="stack">
            <ImageRow images={[images.hewnPopup]} />
            <ImageRow images={[images.hewnInterior]} />
          </div>
        }
      >
        <p>
          The pop-up presents the collections on stone plinths under gallery lighting, carrying the line
          “Sculpted strength. Designed to be seen. Made to be used.”
        </p>
      </CaseSection>

      <NextProject slug="hewn" />
    </article>
  );
}
