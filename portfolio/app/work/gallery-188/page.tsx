import type { Metadata } from "next";
import { images } from "@/content/images";
import { CaseIntro, CaseSection, NextProject } from "@/components/Case";
import { ImageRow } from "@/components/ImageRow";
import { Picture } from "@/components/Picture";

export const metadata: Metadata = {
  title: "Gallery 188",
  description: "Gallery 188 — a concept social and content strategy that makes contemporary art feel less intimidating.",
};

const challenges = [
  {
    title: "Accessibility",
    text: "Contemporary art can feel intimidating or overly academic to people outside traditional arts communities.",
  },
  {
    title: "Discovery",
    text: "Younger audiences increasingly discover exhibitions, artists and cultural spaces through social media.",
  },
  {
    title: "Continuity",
    text: "A gallery needs content between exhibition announcements — not just when a new show opens.",
  },
];

const audiences = [
  {
    tag: "A — 20–30",
    name: "The Culture Browser",
    text: "Interested in fashion, music, cinema, design and culture, but doesn’t necessarily consider themselves an “art person”.",
    needs: ["Accessible entry points", "Cultural connections", "Content worth sharing"],
  },
  {
    tag: "B — Makers",
    name: "The Emerging Creative",
    text: "Artists, photographers, designers, writers and students.",
    needs: ["Inspiration", "Creative process", "Community", "Emerging artists"],
  },
  {
    tag: "C — Already in",
    name: "The Gallery Regular",
    text: "Already engaged with art and cultural programming.",
    needs: ["Exhibition context", "Artist insight", "Event information", "Deeper conversation"],
  },
];

const voiceLines = [
  "“Why does this painting feel uncomfortable?”",
  "What did you notice first?",
  "The detail you probably missed.",
  "You don’t need an art degree to have an opinion.",
  "Look at it before reading the label.",
  "You are allowed to dislike it.",
];

const worlds = [
  { img: images.g188World1, name: "Look Closer", text: "Details, materials, visual observations and artwork close-ups." },
  { img: images.g188World2, name: "Art Without the Homework", text: "Accessible explanations and questions about contemporary art." },
  { img: images.g188World3, name: "188 Questions", text: "Artists, curators and creatives answering unexpected questions." },
  { img: images.g188World4, name: "Behind 188", text: "Installation, studios, work-in-progress and gallery preparation." },
  { img: images.g188World5, name: "188 After Hours", text: "Openings, events, conversations and gallery culture." },
];

const platforms = [
  {
    name: "Instagram",
    role: "Brand world + discovery",
    items: ["Carousels", "Exhibition storytelling", "Artist features", "Reels", "Events", "Visual archive"],
  },
  {
    name: "TikTok",
    role: "Personality + reach",
    items: ["POVs", "Art explainers", "Artist interviews", "Behind the scenes", "Cultural commentary", "Trend-responsive video"],
  },
  {
    name: "LinkedIn",
    role: "Institutional credibility",
    items: ["Partnerships", "Exhibition announcements", "Artist / program news", "Community impact", "Sponsorship", "Gallery milestones"],
  },
];

const posts = [
  {
    img: images.g188Post1,
    name: "Post 01 — Art Without the Homework",
    text: "A question first, context second. The carousel slows the scroll down the same way the gallery slows the visitor down.",
  },
  {
    img: images.g188Post2,
    name: "Post 02 — Behind 188",
    text: "Before an exhibition becomes a quiet white room, it looks a lot more like this. Crates. Levels. Tape. Measurements. Second guesses.",
  },
  {
    img: images.g188Post3,
    name: "Post 03 — 188 Questions",
    text: "The opener of a recurring artist interview series — one unexpected question per artist, per exhibition.",
  },
];

const kpis = [
  { name: "Awareness", items: ["Reach", "Video views", "Profile visits", "Follower growth"] },
  { name: "Engagement", items: ["Shares", "Saves", "Comments", "Completion rate"] },
  { name: "Community", items: ["UGC", "Artist reposts", "Event mentions", "Creator participation"] },
  { name: "Conversion", items: ["Exhibition RSVPs", "Website clicks", "Newsletter sign-ups", "Event attendance"] },
];

const demonstrates = [
  "Social strategy",
  "Content systems",
  "Audience thinking",
  "Platform strategy",
  "Cultural marketing",
  "Campaign development",
  "Short-form video ideation",
  "Creative direction",
];

export default function Gallery188Page() {
  return (
    <article>
      <CaseIntro
        slug="gallery-188"
        subtitle="Social & Content Strategy"
        meta={[
          { label: "Industry", value: "Arts & Culture" },
          {
            label: "Scope",
            value: "Social Strategy, Content Systems, Short-Form Video, Campaign Development, Audience Strategy",
          },
        ]}
      >
        <p>
          Gallery 188 is imagined as an independent contemporary gallery built around emerging artists,
          experimentation and cultural conversation. The social strategy reframes it as more than a place to see
          finished work: a space for curiosity, process, conversation and discovery.
        </p>
      </CaseIntro>

      <div className="case-hero wrap">
        <ImageRow images={[images.g188Hall, images.g188Viewer]} eager />
      </div>

      <CaseSection label="Concept" title="Making contemporary art feel less intimidating.">
        <p>
          Rather than relying on institutional language, the content system gives audiences simple entry points
          into contemporary art — making the experience feel more conversational, social and culturally relevant
          to younger audiences.
        </p>
        <blockquote className="pull">
          The goal is not to simplify the art. It is to make entering the conversation easier.
        </blockquote>
      </CaseSection>

      <CaseSection label="Challenge" title="The gallery has to be interesting before someone walks through the door.">
        <ol className="numbered">
          {challenges.map((c, i) => (
            <li key={c.title}>
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </li>
          ))}
        </ol>
      </CaseSection>

      <CaseSection label="Audience" title="Three ways into the same room.">
        <div className="cols-3">
          {audiences.map((a) => (
            <div key={a.name} className="col">
              <p className="small-label">{a.tag}</p>
              <h3 className="col-title">{a.name}</h3>
              <p>{a.text}</p>
              <p className="small-label needs">Needs</p>
              <ul className="rule-list">
                {a.needs.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CaseSection>

      <CaseSection label="Strategic idea" title={<>Art without the homework.</>}>
        <p>
          Contemporary art explained through curiosity, not lectures. Gallery 188’s social voice begins with
          observation, questions and cultural relevance rather than academic explanation.
        </p>
        <ul className="voice-lines">
          {voiceLines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </CaseSection>

      <CaseSection
        label="Content worlds"
        title="One gallery. Five recurring content worlds."
        wide={
          <ol className="worlds">
            {worlds.map((w, i) => (
              <li key={w.name}>
                <Picture img={w.img} />
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{w.name}</h3>
                <p>{w.text}</p>
              </li>
            ))}
          </ol>
        }
      />

      <CaseSection label="Platform strategy" title="Same gallery. Different behaviour by platform.">
        <div className="cols-3">
          {platforms.map((p) => (
            <div key={p.name} className="col">
              <h3 className="col-title">{p.name}</h3>
              <p className="small-label">{p.role}</p>
              <ul className="rule-list">
                {p.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CaseSection>

      <CaseSection label="Sample content" title="The feed.">
        <div className="feed">
          <figure className="feed-image">
            <Picture img={images.g188Feed} />
          </figure>
          <div className="feed-notes">
            <p className="small-label">Feed balance</p>
            <p>60% photo-led · 25% type-led · 15% hybrid</p>
            <p className="small-label">Voice</p>
            <p>Curious, conversational, culturally aware, slightly irreverent — intelligent without being academic.</p>
            <ul className="rule-list">
              <li>Look at this before we tell you what it means.</li>
              <li>This wall looked completely different yesterday.</li>
              <li>You’re allowed to change your mind about an artwork.</li>
              <li>People came for the opening. They stayed for three hours.</li>
            </ul>
            <p className="muted">Not: “Gallery 188 is pleased to announce…”</p>
          </div>
        </div>
        <ul className="posts">
          {posts.map((p) => (
            <li key={p.name} style={{ maxWidth: p.img.width }}>
              <Picture img={p.img} />
              <h3>{p.name}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ul>
      </CaseSection>

      <CaseSection
        label="Campaign platform"
        title="Don’t just look."
        wide={
          <ImageRow
            images={[images.g188Campaign]}
            caption="Exhibition poster, Instagram, stories, reels and digital invitation."
          />
        }
      >
        <p>
          Gallery 188’s exhibition campaign platform — an invitation to participate, not just observe.
        </p>
        <p className="campaign-lines">
          Look longer.
          <br />
          Have an opinion.
          <br />
          Change your mind.
          <br />
          <em>Don’t just look.</em>
        </p>
      </CaseSection>

      <CaseSection label="Measurement" title="What success looks like.">
        <p className="muted">Proposed KPIs for a speculative concept — no results are claimed.</p>
        <div className="cols-4">
          {kpis.map((k) => (
            <div key={k.name} className="col">
              <p className="small-label">{k.name}</p>
              <ul className="rule-list">
                {k.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="pull">
          Success isn’t just making the gallery look interesting. It’s making people want to participate in it.
        </p>
      </CaseSection>

      <CaseSection label="Project note" title={<>A strategy, <em>not just posts.</em></>}>
        <div className="note">
          <div>
            <p className="small-label">This project demonstrates</p>
            <ul className="rule-list cols-2-list">
              {demonstrates.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
          <figure className="note-image">
            <Picture img={images.g188Closing} />
          </figure>
        </div>
      </CaseSection>

      <NextProject slug="gallery-188" />
    </article>
  );
}
