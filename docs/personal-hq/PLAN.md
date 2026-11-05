# Personal HQ — Planning & Design Specification

> **Status:** Draft for approval · **Prepared:** 5 November 2026 · **No production code has been written.**
>
> **Principle:** *Track once, understand everything.*
>
> **Where this lives:** it is drafted in the `proclivity-club` repository because that is the only repository in this session. Personal HQ is a separate product and should get its own private repository (`personal-hq`) once the plan is approved (see §13). Nothing here touches the Proclivity Club site.

---

## Contents

0. [Summary, assumptions and open questions](#0-summary-assumptions-and-open-questions)
1. [Product requirements](#1-product-requirements-document)
2. [Information architecture and user flows](#2-information-architecture-and-user-flows)
3. [Technical stack assessment](#3-technical-stack-assessment)
4. [Database schema and event provenance model](#4-database-schema-and-event-provenance-model)
5. [Integration feasibility matrix](#5-integration-feasibility-matrix)
6. [HealthKit companion architecture](#6-healthkit-companion-architecture)
7. [Privacy and security model](#7-privacy-and-security-model)
8. [Visual design system](#8-visual-design-system)
9. [Desktop and mobile wireframe plan](#9-desktop-and-mobile-wireframe-plan)
10. [Phased implementation roadmap](#10-phased-implementation-roadmap)
11. [Testing and acceptance criteria](#11-testing-and-acceptance-criteria)
12. [External accounts, permissions and local tools](#12-required-external-accounts-permissions-and-local-tools)
13. [Repository structure, and browser vs native iOS](#13-repository-structure-and-browser-vs-native-ios)

---

## 0. Summary, assumptions and open questions

### 0.1 In one paragraph

Personal HQ is a single-owner, private web app (Next.js on Vercel, Supabase Postgres with row-level security) that holds goals, fitness sessions, habits, savings deposits and projects as **events with provenance**: every fact records where it came from (manual entry, Apple Health, a file import), when it was last confirmed, and whether the owner corrected it. A small SwiftUI companion app on the iPhone reads **only Pilates and strength-training workouts** from HealthKit (after the owner grants permission) and sends them to Personal HQ. The browser never touches HealthKit. The "Habits" app connector stays **unverified** until the exact app and a supported export path are confirmed; until then, habits are tracked natively in Personal HQ.

### 0.2 Assumptions (please confirm or correct)

| # | Assumption | Why it matters |
|---|---|---|
| A1 | One user (you). No sharing, teams or public pages. | Simplifies auth and RLS; signups are disabled. |
| A2 | Home time zone **America/Toronto**; all "today/this week/this month" boundaries computed there. Editable. | Workouts near midnight and DST changes (Nov 1 2026) must land on the right day. |
| A3 | Weeks run **Monday–Sunday**. Editable. | Defines "3 gym sessions per week". |
| A4 | Currency **CAD**; amounts stored as integer cents. | No floating-point money. |
| A5 | "Gym session" = a strength-training workout (Apple types *Traditional Strength Training* and *Functional Strength Training*), or a manual log classified as Gym. | Classification rules (§4.6) are editable. |
| A6 | "WHE" = Women's Habitat (of Etobicoke) campaign; the **November 25** launch is a real deadline. IWD 2027 is **8 March 2027**. | Seeds the Projects module. |
| A7 | You have (or will get) a Mac with Xcode and an iPhone for the companion. | Required for any HealthKit work. |
| A8 | No bank connection. Savings are logged manually. | Reduces financial data collected to "amount, date, note". |
| A9 | English-only UI, en-CA formatting (e.g. "Nov 30", "$1,000.00"). | |

### 0.3 Open questions / unresolved dependencies

1. **Which "Habits" app?** Several App Store apps use that name. I need the developer name or App Store link before researching its export, Shortcuts or API support (§5.2). Until then the connector is **Unverified**.
2. **LSAT practice target.** What counts — minutes, practice sections, full tests? How often? (Proposed default: 3 sessions/week, no minute target.)
3. **Portfolio case studies** — do you want a per-case-study checklist (draft → edit → publish) or a single counter?
4. **Weekly targets in partial weeks.** November 2026 starts on a Sunday. Proposed rule: weekly targets apply to every Monday–Sunday week; the month view counts the **four full weeks plus partial weeks prorated** (e.g. Nov 30 alone = 1/7 of a week, so no target). Alternative: ignore partial weeks entirely. Choose one.
5. **Sign-in method.** Recommended: email magic link **plus** a passkey or TOTP second factor. Acceptable?
6. **Apple Developer Program** ($99 USD/year) — willing to enrol? Required for TestFlight installs that don't expire every 7 days and for HealthKit background delivery (§12).
7. **Toronto art scene** — keep as a lightweight "Interests" journal with **no targets or streaks** (recommended, honours "don't turn every interest into a project"), or give it a gentle monthly count?
8. Anything other than workout data you'd *eventually* want from Apple Health (e.g. none)? The plan assumes **workouts only, forever**, unless you say otherwise.

---

## 1. Product requirements document

### 1.1 Goals

- One calm place to see whether this month is on track across fitness, habits, savings and projects.
- Logging takes **under 10 seconds** on an iPhone for the common cases (log a workout, tick a habit, record a deposit).
- Data from Apple Health appears without re-typing and **never double-counts** a session.
- Progress language is encouraging and factual; nothing punishes a missed day.

### 1.2 Non-goals (v1)

- Bank/brokerage connections, budgeting, spending categorisation.
- Social features, sharing, public profiles.
- Reading any Health data beyond workouts (no heart rate, weight, sleep, cycle, location, routes).
- Native iPhone version of the whole app — the companion only syncs workouts; the web app is the UI.
- AI coaching or auto-generated goals.
- Calendar (Google/iCloud) sync — candidate for later.

### 1.3 Personas & context

Single owner; uses desktop for planning (Sunday review, project work) and iPhone for quick logging during the day.

### 1.4 Functional requirements by module

**Global**
- G1 Authenticated access only; every page private.
- G2 Global "Log" action reachable from every screen (workout / habit / deposit / milestone / note).
- G3 Every goal, target frequency, date, currency amount and classification rule editable in **Settings**; changes are versioned so past months keep the targets they had (see `goal_targets` effective dates).
- G4 Data export (JSON + CSV zip) and full account deletion.
- G5 Thoughtful empty states that explain what will appear and offer one action.
- G6 Works offline-tolerant: logging forms keep a draft if the network drops; no full offline mode in v1.

**1 — Overview dashboard**
- O1 Month card per goal area with progress (e.g. "Gym 5 of 12 · on pace").
- O2 This week's focus (1–3 owner-written priorities from last Weekly Review) and next milestones (≤14 days).
- O3 Today: planned items, logged activities, habits due.
- O4 Recent accomplishments (last 7 days, completed milestones, workouts, deposits).
- O5 Source status strip: Apple Health (state + last synced), Habits connector (Unverified), Manual (always on).

**2 — Fitness Studio**
- F1 Weekly targets: Gym 3, Pilates 2 (editable).
- F2 Week calendar showing **scheduled** (planned) and **completed** sessions, distinctly.
- F3 Manual log: type, date/time, duration (optional), note.
- F4 Corrections: change type, date, or hide a synced workout without deleting its source record; corrections survive re-sync.
- F5 Classification rules mapping source activity types → Gym / Pilates / Not counted.
- F6 Duplicate prevention (§4.7) with a visible "merged from 2 sources" indicator and an "unmerge" action.
- F7 Trends: sessions per week over 12 weeks; target hit-rate per month.
- F8 Apple Health connection page with states (§6.6) and "Sync now" instructions.

**3 — Habits**
- H1 Habits with schedules: daily, specific weekdays, N times per week, monthly.
- H2 One-tap check-in; optional quantity (e.g. 20 min).
- H3 Month calendar heatmap per habit and combined.
- H4 Streaks computed **per schedule** (a 3×/week habit keeps its streak if 3 happen that week); show "longest" and "current" plus a 30-day consistency %.
- H5 Pausing a habit (travel, illness) excludes those days from consistency — no broken streak.
- H6 Connector slot for "Habits" app, status **Unverified**; file import only after verification.

**4 — Savings**
- S1 Goal: CAD $1,000 by 30 Nov 2026 (editable; supports future multi-month goals).
- S2 Deposits: amount, date, optional note, optional goal allocation. Withdrawals recorded as negative entries with a reason.
- S3 **Planned transfers are separate** and never count toward progress. On or after the planned date, the app asks "Did this transfer happen?" → Yes creates a confirmed deposit (pre-filled, editable), No/Later leaves it planned.
- S4 Progress: saved, remaining, days left, amount per remaining week to finish (presented as information, not a demand).
- S5 Monthly history (bars) and running total.

**5 — Projects & Goals**
- P1 Projects (Women's Habitat campaigns, Portfolio launch, MISSOSOUP, Learning) with status: Not started / Active / Waiting / Blocked / Done / Paused.
- P2 Milestones with due dates, status, optional dependency on another milestone; a milestone with an unmet dependency shows "Waiting on…".
- P3 Blockers: free-text with owner (me / external) and date raised.
- P4 Goals: monthly and quarterly, linked to projects or to measurable metrics (count of workouts, essays published, $ saved).
- P5 Month and quarter views (list + timeline).
- P6 "Interests" journal (art scene, learning notes) — entries only, no targets unless you add one.

**6 — Weekly Review**
- W1 Generated summary: completed activities, planned vs actual per goal, highlights.
- W2 Reflection prompts (editable list), e.g. *What gave you energy this week?* *What would make next week 10% easier?*
- W3 Set 1–3 priorities for next week → become "Weekly focus" on Overview.
- W4 Copy rules: no red "failed" states, no streak-loss alarms; misses phrased as "2 of 3 gym sessions — one short of the target" with an optional "what got in the way?" note.
- W5 Reviews are saved and browsable.

### 1.5 Initial seed data (November 2026, all editable)

| Area | Goal | Measure | Target | Period |
|---|---|---|---|---|
| Fitness | Gym | workouts classified *gym* | 3 / week | weekly |
| Fitness | Pilates | workouts classified *pilates* | 2 / week | weekly |
| Financial | November savings | confirmed deposits | CAD 1,000 | by 2026-11-30 |
| Career | Launch Portfolio V1 | milestone | done | by 2026-11-30 (confirm) |
| Career | Portfolio case studies | count | 3 | Nov |
| Career | WHE campaign launch | milestone | executed | 2026-11-25 |
| Career | IWD 2027 comms roadmap | milestone | prepared | Nov (roadmap for 2027-03-08) |
| Creative | MISSOSOUP essays | count published | 2 | Nov |
| Personal | LSAT practice | sessions | TBD (Q2) | weekly |
| Personal | Toronto art scene | journal entries | none | — |
| Personal | Learning | journal entries | none | — |

### 1.6 Non-functional requirements

- Performance: Overview LCP < 1.5 s on 4G iPhone; interactions < 100 ms perceived.
- Accessibility: WCAG 2.2 AA; full keyboard use; screen-reader-labelled charts with data-table equivalents; respects `prefers-reduced-motion`; 44×44 pt touch targets.
- Reliability: idempotent ingest; no data loss on duplicate or out-of-order sync.
- Privacy: §7.

---

## 2. Information architecture and user flows

### 2.1 Site map

```
/                       Overview
/log                    Quick log sheet (also a modal from anywhere)
/fitness                Week view (default) · /fitness/history · /fitness/sources
/habits                 Today's habits · /habits/[id] calendar & streak · /habits/sources
/savings                Goal progress · /savings/history · /savings/planned
/projects               All projects · /projects/[id] milestones, blockers
/goals                  Month view · /goals/quarter
/interests              Journal
/review                 This week's review · /review/[week] archive
/settings               Goals & targets · Schedule & time zone · Classification rules
                        · Connections (Apple Health devices, Habits) · Data (export/delete) · Security
/sign-in                Magic link + second factor
```

### 2.2 Navigation

- **Desktop (≥1024 px):** left rail with sections grouped *Today* (Overview, Log) · *Tracks* (Fitness, Habits, Savings) · *Work* (Projects, Goals, Interests) · *Reflect* (Review) · Settings at the foot.
- **Tablet (640–1023 px):** collapsible rail (icons + labels on hover/focus).
- **iPhone (<640 px):** bottom tab bar with 5 items — **Today · Fitness · Habits · Savings · More** — and a centred floating **Log** button above the bar. "More" opens Projects, Goals, Interests, Review, Settings. Tab bar respects safe-area insets.

### 2.3 Key user flows

**F-1 Log a Pilates class (phone, manual)**
Log → "Workout" → type chips (Gym · Pilates · Other) → date defaults to now → Save. Toast: "Pilates logged — 2 of 2 this week." *(3 taps.)*

**F-2 Apple Watch workout arrives**
Watch records *Pilates* → owner opens companion (or background delivery fires) → companion fetches changes via anchored query → posts to ingest → server classifies → dedupe check against manual log of the same class → if matched, merge (one session, two sources) → Overview shows it with a small source glyph.

**F-3 Correct a misclassified workout**
Fitness → session → "Change type" → Gym → saved as an **override**; the source record is untouched; future syncs of the same workout keep the override.

**F-4 Confirm a planned savings transfer**
Planned transfer on Nov 15 → on Nov 15 Overview shows "Planned $250 transfer — did it happen?" → *Yes, $250* / *Yes, different amount* / *Not yet*. Only "Yes" changes progress.

**F-5 Weekly Review (Sunday)**
Review → auto summary → answer 2–4 prompts → choose up to 3 priorities → Save. Priorities appear on Overview Monday.

**F-6 Edit a target**
Settings → Goals → Gym → "3 per week" → 2 per week, effective from *next week* (default) or *this week*. Past weeks keep their original target.

**F-7 Disconnect Apple Health**
Settings → Connections → iPhone → Revoke device. Token invalidated; option "Also delete workouts imported from this device" (keeps manual logs).

---

## 3. Technical stack assessment

| Layer | Proposed | Verdict | Notes |
|---|---|---|---|
| Web framework | **Next.js (App Router, current major — 16.x)** with React Server Components and Server Actions | ✅ Keep | Server-rendered data pages keep secrets server-side and reduce client JS. This Next version has breaking changes vs older docs; the implementation must follow the bundled `node_modules/next/dist/docs/` guides. |
| Language | **TypeScript** (strict) | ✅ Keep | Generate DB types from Supabase; validate all inputs with **Zod** at server boundaries. |
| Styling | **Tailwind CSS v4** (CSS-first `@theme` tokens) | ✅ Keep | Design tokens in one CSS file (§8). Hand-built components; no heavy UI kit. Use **Radix primitives** (or React Aria) only for accessible dialogs, menus, popovers. |
| Charts & calendars | **Custom SVG components** | ✅ Recommend | Calendars/heatmaps/bar charts are simple; custom SVG gives the editorial look and full a11y control. Avoids a large chart dependency. |
| Database & Auth | **Supabase** (Postgres 15+, Auth, RLS, Edge Functions) | ✅ Keep, with conditions | Choose **ca-central-1 (Canada)** region. Disable public signups. Use `@supabase/ssr` for cookie sessions. Service-role key never in the browser and ideally not in Vercel at all (see below). |
| Migrations | **Supabase CLI SQL migrations** + `supabase gen types` | ✅ | Plain SQL is easiest to review for RLS. An ORM (Drizzle) is optional; not needed. |
| Hosting | **Vercel** | ✅ Keep | Set function region near Supabase. **Do not enable Vercel Web Analytics/Speed Insights in v1**, or enable only after confirming they capture no URL params containing data. Use Vercel environment variables (encrypted) for secrets. |
| Device ingest | **Supabase Edge Function** `ingest-workouts` | ✅ Recommend (change) | Keeps the device-facing endpoint separate from the web app, uses a per-device revocable token, and is the only place a privileged DB role is used. |
| iOS | **SwiftUI + HealthKit**, iOS 18+ deployment target, `supabase-swift` not required | ✅ Keep | Companion talks only to the ingest function over HTTPS; token in Keychain. |
| Testing | Vitest (unit), Playwright (e2e + axe a11y), pgTAP via `supabase test db` (RLS), Swift Testing/XCTest (iOS) | ✅ | §11. |
| Email | Supabase Auth with **custom SMTP** (Resend or Postmark) | ✅ | Default Supabase SMTP is rate-limited and not for production. |
| Error monitoring | **None in v1**, or Sentry with PII scrubbing and `sendDefaultPii: false` and request bodies dropped | ⚠️ Optional | Only after a redaction test passes (§7.6). |

**Recommended changes vs the brief**
1. Device ingest via Edge Function + scoped device token rather than giving the phone a full user session — least privilege.
2. No third-party analytics at all initially.
3. Passkey/TOTP second factor in addition to magic link.

**Alternatives considered:** Firebase (weaker relational modelling, no RLS-style SQL policies), Clerk + Neon (more vendors, more secrets), a fully native iOS app (doesn't meet "desktop and iPhone" and multiplies UI work). None beat the proposed stack for a single-owner app.

---

## 4. Database schema and event provenance model

### 4.1 Principles

1. **Source records are immutable-ish evidence; canonical activities are what you see.** Sync updates evidence; your corrections live in overrides on the canonical row, so a re-sync never undoes them.
2. **Everything that counts toward a goal is an event with a provenance chain** — `source` → `source_record` → `activity` → `goal progress`.
3. **Planned ≠ done.** Plans and confirmations are separate tables.
4. **Collect the minimum.** Workout rows store type, start, end, duration and the source's stable ID. Nothing else from Health.
5. Every table has `user_id uuid not null references auth.users` and RLS `user_id = auth.uid()`.

### 4.2 Entity overview

```
profiles ─┬─ settings (tz, week_start, currency)
          ├─ goal_areas ── goals ── goal_targets (effective-dated)
          │                   └── goal_links (→ project | metric)
          ├─ data_sources ── devices (companion installs, token hash)
          │        └── ingest_batches ── source_records (raw minimal evidence)
          │                                    └── activity_evidence ──┐
          ├─ activities (canonical workouts, habit check-ins) ◄────────┘
          │        └── activity_overrides (owner corrections)
          ├─ classification_rules
          ├─ planned_sessions (scheduled workouts)
          ├─ habits ── habit_schedules ── habit_pauses
          ├─ savings_goals ── savings_entries (confirmed) · planned_transfers
          ├─ projects ── milestones ── milestone_dependencies · blockers
          ├─ journal_entries (interests/learning)
          ├─ weekly_reviews ── review_answers · weekly_priorities
          └─ audit_events (security-relevant actions, no health payloads)
```

### 4.3 Core tables (DDL sketch — illustrative, not final)

```sql
-- Settings
create table settings (
  user_id uuid primary key references auth.users on delete cascade,
  time_zone text not null default 'America/Toronto',
  week_start smallint not null default 1,          -- 1 = Monday (ISO)
  currency char(3) not null default 'CAD',
  partial_week_rule text not null default 'prorate' check (partial_week_rule in ('prorate','ignore'))
);

-- Goals with effective-dated targets
create table goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  area text not null check (area in ('fitness','financial','career','creative','personal')),
  title text not null,
  metric text not null,          -- 'activity_count' | 'savings_amount' | 'milestone' | 'manual_count' | 'none'
  metric_filter jsonb,           -- e.g. {"category":"gym"}
  period text not null check (period in ('weekly','monthly','quarterly','by_date','none')),
  starts_on date not null,
  ends_on date,
  archived_at timestamptz
);
create table goal_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  goal_id uuid not null references goals on delete cascade,
  target_value numeric not null,  -- 3 (sessions) or 100000 (cents)
  effective_from date not null,   -- target in force from this date until the next row
  unique (goal_id, effective_from)
);

-- Sources & devices
create table data_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  kind text not null check (kind in ('manual','healthkit','habits_app','file_import')),
  status text not null default 'not_connected',  -- see §6.6 / §5.2
  verified boolean not null default false,       -- false for the Habits connector until confirmed
  last_success_at timestamptz,
  last_attempt_at timestamptz,
  last_error_code text                           -- code only, never payloads
);
create table devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  source_id uuid not null references data_sources on delete cascade,
  label text not null,                    -- "iPhone"
  token_hash bytea not null,              -- SHA-256 of a random 32-byte token; token shown once to the device
  scopes text[] not null default '{workouts:write}',
  created_at timestamptz not null default now(),
  last_seen_at timestamptz,
  revoked_at timestamptz
);

-- Evidence
create table ingest_batches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  device_id uuid references devices,
  received_at timestamptz not null default now(),
  added_count int not null default 0,
  deleted_count int not null default 0,
  client_anchor_hash text                 -- hash of HK anchor, for diagnostics only
);
create table source_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  source_id uuid not null references data_sources,
  external_id text not null,              -- HKWorkout UUID, or manual row id
  external_type text not null,            -- e.g. 'HKWorkoutActivityType.pilates'
  origin_app text,                        -- source revision bundle name, e.g. "Workout" (for dedupe); optional
  started_at timestamptz not null,
  ended_at timestamptz not null,
  duration_s int,
  first_seen_batch uuid references ingest_batches,
  last_seen_batch uuid references ingest_batches,
  revision int not null default 1,        -- bumps when the same external_id arrives with changed fields
  deleted_at_source timestamptz,          -- set from HKDeletedObject
  unique (source_id, external_id)
);

-- Canonical activities
create table activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  kind text not null check (kind in ('workout','habit_checkin')),
  category text,                          -- 'gym' | 'pilates' | 'other' (derived or overridden)
  habit_id uuid references habits,
  occurred_on date not null,              -- local date in user's tz at time of creation
  started_at timestamptz,
  ended_at timestamptz,
  quantity numeric,                       -- habit minutes etc.
  status text not null default 'active' check (status in ('active','hidden','source_deleted')),
  created_via text not null,              -- 'manual' | 'healthkit' | 'import' | 'merge'
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table activity_evidence (
  activity_id uuid references activities on delete cascade,
  source_record_id uuid references source_records on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  link_reason text not null,              -- 'origin' | 'auto_merge' | 'manual_merge'
  primary key (activity_id, source_record_id)
);
create table activity_overrides (
  activity_id uuid primary key references activities on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  category text, occurred_on date, hidden boolean, note text,
  updated_at timestamptz not null default now()
);
create table classification_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  source_kind text not null,              -- 'healthkit'
  external_type text not null,            -- 'HKWorkoutActivityType.traditionalStrengthTraining'
  category text not null,                 -- 'gym' | 'pilates' | 'ignore'
  min_duration_s int default 600,         -- workouts under 10 min don't count (editable)
  priority int not null default 100,
  unique (user_id, source_kind, external_type)
);
create table planned_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  category text not null, planned_on date not null, planned_time time,
  fulfilled_by uuid references activities,  -- linked when a matching activity occurs
  note text
);

-- Savings
create table savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null, target_cents bigint not null check (target_cents > 0),
  currency char(3) not null default 'CAD',
  starts_on date not null, due_on date not null, archived_at timestamptz
);
create table savings_entries (                -- CONFIRMED money movement only
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  goal_id uuid references savings_goals,
  amount_cents bigint not null check (amount_cents <> 0),  -- negative = withdrawal
  occurred_on date not null,
  note text,
  confirmed_from_plan uuid,                 -- references planned_transfers(id)
  created_at timestamptz not null default now()
);
create table planned_transfers (              -- NEVER counted in progress
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  goal_id uuid references savings_goals,
  amount_cents bigint not null check (amount_cents > 0),
  planned_on date not null,
  recurrence text,                           -- RRULE, optional
  state text not null default 'planned' check (state in ('planned','confirmed','skipped'))
);
```

Habits, projects, milestones, dependencies, blockers, journal, reviews follow the same pattern (uuid PK, `user_id`, timestamps). Notable constraints:
- `milestone_dependencies(milestone_id, depends_on_id)` with a check preventing self-reference and a trigger rejecting cycles.
- `habit_schedules.rule` uses a small JSON schema: `{"type":"daily"}`, `{"type":"weekdays","days":[1,3,5]}`, `{"type":"times_per_week","n":3}`.
- `habit_pauses(habit_id, from_date, to_date)`.

### 4.4 Derived views (no stored totals)

- `v_activities_effective` — `activities` with overrides applied (`coalesce(override.category, category)` etc.) and `status <> 'hidden'`.
- `v_week_progress(user, week_start)` — counts by category vs target in force that week.
- `v_savings_progress(goal)` — `sum(savings_entries.amount_cents)` only. Planned transfers are a separate column `planned_remaining_cents` labelled "planned, not yet confirmed".

Computing progress from events (rather than storing counters) guarantees that an edit, deletion or merge is reflected everywhere.

### 4.5 Provenance chain shown in the UI

Every activity has an "About this entry" disclosure: *Source: Apple Health (iPhone) · Workout app · first synced Nov 4 18:02 · last confirmed Nov 5 07:10 · You changed type from Other → Gym on Nov 5.* This is the "track once, understand everything" promise made inspectable.

### 4.6 Classification rules (default, editable)

| Source type | Category | Counts if |
|---|---|---|
| HealthKit `pilates` | Pilates | duration ≥ 10 min |
| HealthKit `traditionalStrengthTraining` | Gym | duration ≥ 10 min |
| HealthKit `functionalStrengthTraining` | Gym | duration ≥ 10 min |
| HealthKit `coreTraining` | *Not requested by default* — can be enabled → Gym or Pilates | |
| Manual "Gym" / "Pilates" | as chosen | always |
| Anything else | not collected (filtered on device) | — |

The companion's HealthKit query is **filtered to the enabled types**, so other workouts never leave the phone.

### 4.7 Duplicate-prevention rules

Applied in order inside one transaction during ingest (and when a manual log is saved):

1. **Exact identity.** Same `(source_id, external_id)` → update the existing `source_record` (bump `revision` if fields changed); never create a second one. Makes ingest idempotent and replay-safe.
2. **Cross-source match.** A new record matches an existing *active* activity when: same effective category **and** time ranges overlap ≥ 50 % of the shorter one **or** (for manual logs without times) same local date and no other same-category activity that day. → Link as additional evidence (`auto_merge`); one activity remains.
3. **Same-source near-duplicate** (e.g. Watch + third-party app both write the same class to Health): different `external_id`, different `origin_app`, overlap ≥ 80 % → auto-merge, flagged "merged — review" on the session.
4. **Ambiguity** (two candidate matches) → don't merge; create the activity with a "possible duplicate" badge for one-tap resolution.
5. **Owner decisions win.** Manual merge/unmerge is recorded as `link_reason='manual_merge'` or a tombstone preventing re-merge of that pair.

### 4.8 Edits, deletions and permission changes

- **Edited in Health** (rare; e.g. a third-party app rewrites a workout — HealthKit typically surfaces this as delete + new sample): handled by rules 1 + 2; the new record re-attaches to the same activity when it overlaps.
- **Deleted in Health:** `HKDeletedObject` UUID → `source_records.deleted_at_source` set. If the activity has **no other active evidence and no owner override**, its status becomes `source_deleted` (excluded from progress, shown in a "Removed from Apple Health" list for 30 days with "Keep anyway"). If the owner had corrected it, it stays and is labelled "kept — source deleted".
- **Permission removed:** HealthKit doesn't tell apps that *read* access was denied; queries just return nothing. The companion therefore reports "no data visible" rather than deleting anything. Existing records are **never** deleted because data stopped arriving. The web shows state "Permission may be off" after the companion reports an empty full re-query (§6.6).

---

## 5. Integration feasibility matrix

### 5.1 Matrix

| Integration | Method | Supported & documented? | Data | Direction | Feasibility | Notes / risks |
|---|---|---|---|---|---|---|
| Apple Health → web, direct from browser | — | **No.** HealthKit has no web API; Safari cannot read it. | — | — | ❌ Not possible | Explicitly out. |
| Apple Health via native companion | HealthKit (`HKAnchoredObjectQuery`, `HKObserverQuery`) | ✅ Apple-documented | Workouts: type, start, end, duration, UUID | Read-only | ✅ High | Needs Mac, Xcode, Apple Developer account, user permission. |
| HealthKit background delivery | `enableBackgroundDelivery` + observer query | ✅ documented, **best-effort** | same | Read-only | ⚠️ Medium | iOS decides timing; throttled; may not run if app was force-quit or phone is in Low Power Mode. Never promised as real-time. |
| Apple Health manual fallback | Manual log in web app | ✅ | same | — | ✅ | Always available. |
| Apple Health export file (`export.zip` from Health app) | Upload & parse XML | ✅ Apple feature, format undocumented-but-stable | All Health data (huge, highly sensitive) | Import | ⚠️ Low priority | **Not recommended**: the file contains far more health data than needed. If ever built, parse in the browser and send only filtered workouts. |
| "Habits" app (unspecified) | Unknown | ❓ **Unverified** | — | — | ❓ | See §5.2. |
| Generic habit CSV import | File upload | ✅ (ours) | dates + habit names | Import | ✅ | Built as the first connector implementation. |
| iOS Shortcuts → Personal HQ | Shortcut "Get Contents of URL" POST to an ingest endpoint with a device token | ✅ Apple feature | whatever the shortcut sends | Push | ✅ Medium | Useful bridge if the Habits app exposes Shortcuts actions. |
| Bank/savings data | — | — | — | — | Out of scope | Manual by design. |

### 5.2 The "Habits" connector — status **Unverified**

What I will **not** do: guess an API, scrape the app, read its private container, its iCloud/CloudKit database, or its backups.

Verification steps once you name the app:
1. Identify developer + App Store listing.
2. Check the developer's documentation/support pages for: (a) a public API, (b) CSV/JSON export, (c) App Intents / Shortcuts actions (visible in the Shortcuts app under the app's name), (d) Apple Health writes (some habit apps log *Mindful Minutes* — not relevant to our workout-only scope and would need a new permission, so not planned).
3. Record findings in `docs/integrations/habits.md` with links and the date checked.

Connector interface (implemented regardless, so the native tracker works today):

```ts
type ConnectorStatus = 'unverified' | 'not_connected' | 'connected' | 'needs_attention' | 'disabled';

interface HabitConnector {
  id: 'habits_app' | 'csv';
  displayName: string;
  status: ConnectorStatus;
  verified: boolean;                 // must be true before any import UI is shown
  capabilities: { fileImport?: boolean; pushViaShortcut?: boolean; pull?: boolean };
  parse?(file: File): Promise<HabitImportPreview>;   // runs client-side; preview before commit
  mapToCheckins(preview: HabitImportPreview, mapping: HabitMapping): CheckinDraft[];
}
```

Import always shows a preview, maps external habit names to Personal HQ habits, and dedupes on `(habit_id, local_date)` (+ external id when present).

---

## 6. HealthKit companion architecture

### 6.1 Scope

A tiny SwiftUI app — **"Personal HQ Sync"** — with three screens: *Connect*, *Status*, *Settings*. It does not display goals or history (the web app does). Read-only; it never writes to Health.

### 6.2 Permissions

- Entitlement: `com.apple.developer.healthkit` (+ `com.apple.developer.healthkit.background-delivery` if background delivery is used).
- `Info.plist`: `NSHealthShareUsageDescription` — *"Personal HQ reads your Pilates and strength-training workouts (type, time and duration) so they count toward your weekly fitness goals. Nothing else is read."* No `NSHealthUpdateUsageDescription` (we don't write).
- Request read for `HKObjectType.workoutType()` **only**. (HealthKit grants workouts as one type; filtering to Pilates/strength happens in the query predicate, so other workout kinds are never loaded into our code's output or sent.)
- Request is made only after an in-app explainer screen; never at first launch.

### 6.3 Sync algorithm

```
1. Pair: user signs in on the web → Settings → Connections → "Add iPhone" shows a
   one-time code (8 chars, 10-min expiry) / QR. Companion submits code → receives
   device token (random 32 bytes) → stored in Keychain (kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly).
2. Query: HKAnchoredObjectQuery(type: workoutType,
          predicate: OR(predicateForWorkouts(activityType: .pilates),
                        .traditionalStrengthTraining, .functionalStrengthTraining)
                     AND startDate >= syncFloor (default: 1 Oct 2026, editable),
          anchor: storedAnchor)
   → returns added [HKWorkout] + deleted [HKDeletedObject].
3. Map to minimal DTO: {uuid, activityType, start, end, duration, originAppName}.
4. POST /functions/v1/ingest-workouts  (Authorization: Bearer <device token>)
   body: {batchId (UUID, client-generated), added:[…], deleted:[uuid…], full: false}
   — batched ≤ 200 items; retried with exponential backoff; idempotent on batchId and uuid.
5. Only after a 2xx response, persist the new anchor (Keychain or app-group file).
   If the server is unreachable, the anchor isn't advanced → no data lost.
6. Triggers: app foreground; "Sync now" button; HKObserverQuery background delivery
   (frequency .hourly — iOS may deliver later); BGAppRefreshTask as a secondary nudge.
7. Reconcile (weekly or on demand): full non-anchored query of the last 60 days,
   sent with full: true so the server can mark records missing from the phone
   as "not seen" (never auto-deleted; surfaced for review).
```

### 6.4 Server ingest (Edge Function)

1. Hash bearer token → look up active, non-revoked device → derive `user_id`. Reject otherwise (401, generic body).
2. Validate payload with a strict schema (types whitelist, max sizes, timestamps sane, duration ≤ 6 h).
3. In one transaction: upsert `ingest_batches`, upsert `source_records`, apply classification (§4.6), dedupe (§4.7), deletions (§4.8), update `data_sources.last_success_at`.
4. Respond `{accepted, merged, ignored}` counts only. Log only counts + batch id + status code. **Never log the request body.**
5. Rate limit per device (e.g. 60 requests/hour).

### 6.5 Companion storage

- Keychain: device token, anchor.
- No local database of workouts; nothing cached beyond the in-flight batch.
- No third-party SDKs (no analytics, crash reporters) — Xcode Organizer crash logs only.

### 6.6 Connection states (shown on web and in the companion)

| State | Meaning | Shown as |
|---|---|---|
| Not connected | No device paired | "Connect your iPhone to bring in workouts automatically. Manual logging always works." |
| Paired, awaiting permission | Device token exists, no successful sync | "Open Personal HQ Sync on your iPhone to allow workout access." |
| Connected | Last successful sync < 48 h | "Apple Health · synced 2 h ago" |
| Quiet | Sync succeeding but no workouts returned in 21 days while manual workouts were logged | "No workouts visible from Apple Health lately. If you changed Health permissions, check Settings › Health › Data Access." |
| Stale | No successful sync > 48 h | "Last synced Tue 18:02. Open the iPhone app to refresh." |
| Needs attention | Repeated ingest errors / token revoked | "Your iPhone needs to reconnect." |
| Disconnected | Device revoked by owner | "Disconnected on Nov 5. Imported workouts kept." |

Note: HealthKit deliberately hides whether *read* permission was denied, so "Quiet" is phrased as a possibility, not an assertion.

### 6.7 Distribution

Personal use via **TestFlight** (internal tester = you) or direct Xcode install. App Store submission is not required. HealthKit apps need a privacy policy if submitted publicly; we prepare one anyway.

---

## 7. Privacy and security model

### 7.1 Data inventory & minimisation

| Data | Sensitivity | Collected | Not collected |
|---|---|---|---|
| Workouts | Health (special category) | type, start/end, duration, HK UUID, origin app name | HR, calories, routes, location, device model, any other Health type |
| Savings | Financial | amount, date, note | account numbers, bank names, balances, institution credentials |
| Habits, projects, journal | Personal | what you enter | — |
| Auth | Identity | email, auth factors (handled by Supabase Auth) | name, phone (optional) |

### 7.2 Authentication

- Supabase Auth, **signups disabled**; only your email allowlisted.
- Magic link + **required second factor** (TOTP via Supabase MFA, assurance level `aal2` enforced in RLS for all data tables: `(auth.jwt()->>'aal') = 'aal2'`). Passkeys when available in Supabase Auth for the project.
- Session cookies: `HttpOnly`, `Secure`, `SameSite=Lax`; short access-token lifetime with refresh.

### 7.3 Authorization (least privilege)

- **RLS enabled on every table**, policies `using (user_id = auth.uid())` and `with check (user_id = auth.uid())` for select/insert/update/delete. A CI check fails if any table in `public` lacks RLS.
- Web app uses the **anon key + user session** — RLS does the enforcement; no service role in Vercel.
- Ingest Edge Function: validates device token, then calls a `security definer` SQL function `ingest_workouts(device_id, payload)` that can write only workout-evidence tables for that device's user. The function owner role has no other grants.
- Device tokens: hashed at rest, scope `workouts:write` only (cannot read anything), revocable, rotated on re-pair.
- Export/delete endpoints require a fresh `aal2` session (re-auth within 10 min).

### 7.4 Secrets management

- Vercel encrypted env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public by design), `SUPABASE_PROJECT_REF`. No service-role key in Vercel.
- Supabase Edge Function secrets: service role (only if the definer approach needs it; preferred: none), SMTP key.
- Local: `.env.local` git-ignored; `.env.example` with names only; secret scanning enabled on the GitHub repo.
- iOS: no secrets in the binary; only the ingest URL. Device token arrives at pairing.

### 7.5 Transport & storage

- HTTPS only, HSTS; strict CSP (`default-src 'self'`; no third-party scripts); `Referrer-Policy: no-referrer`; `Permissions-Policy` denying camera/mic/geolocation.
- Supabase encrypts at rest; region ca-central-1. Point-in-time recovery if on a paid plan; otherwise daily backups (note: backups retain deleted data until they expire — disclosed on the deletion screen).

### 7.6 Logging & analytics

- **No product analytics** in v1.
- Server logs: route, status, duration, batch id, counts. A logging wrapper redacts bodies by default; health and money routes are on a denylist that logs **nothing but status**.
- URLs never carry data (no `?amount=` or workout types in query strings) so platform request logs stay clean.
- Automated test: run ingest with a sentinel value (e.g. workout type `"SENTINEL_PILATES"`) and assert it doesn't appear in captured logs.

### 7.7 Export & deletion

- **Export:** Settings › Data › Export → zip with `personal-hq-export.json` (all tables, provenance included) + per-module CSVs. Generated on demand, streamed, never stored.
- **Delete by scope:** delete imported Apple Health data (keeps manual), delete a module's data, or **delete everything** (cascades from `auth.users`; device tokens revoked; confirmation by typing a phrase).
- Companion: "Disconnect" deletes token + anchor from Keychain.

### 7.8 Threat model highlights

| Threat | Mitigation |
|---|---|
| Stolen session cookie | aal2 MFA, short tokens, HttpOnly, sign-out-everywhere |
| Leaked device token | write-only scope, rate-limited, revocable, can't read data |
| Missing RLS on a new table | CI check + pgTAP tests |
| Data in logs/analytics | none installed; redaction tests |
| Supply-chain (npm) | lockfile, Dependabot, minimal deps, no third-party scripts |
| Phishing magic link | MFA required; link expiry 10 min |

---

## 8. Visual design system

### 8.1 Character

*An editorial planner on good paper.* Generous margins, a serif masthead per page, quiet hairline rules, data that reads like a well-set table. Motion is slow and small. Colour is mostly ivory and charcoal; sage is a highlight, not a theme.

### 8.2 Colour tokens (light)

| Token | Hex | Use | Contrast (approx.) |
|---|---|---|---|
| `--paper` | `#F6F2E9` | page background | — |
| `--card` | `#FBF8F2` | card surface | — |
| `--ink` | `#24231F` | primary text | ~14:1 on paper |
| `--ink-muted` | `#5C5950` | secondary text | ~6.5:1 |
| `--rule` | `#E2DCCD` | borders, hairlines | decorative |
| `--rule-strong` | `#CFC7B4` | input borders | ≥3:1 for UI components (verify) |
| `--sage` | `#8C9C7F` | chart fills, progress tracks | decorative only (not text) |
| `--sage-deep` | `#4E6046` | links, focus, active nav, "done" text | ~6:1 |
| `--sage-wash` | `#E4EADC` | selected day, chip background | — |
| `--clay` | `#A8633F` | attention (blocked, needs attention) — used sparingly, never for "missed" | ~4.6:1 |
| `--clay-wash` | `#F3E4D8` | attention background | — |

**Dark ("evening") theme** (follows system): paper `#1C1B18`, card `#24231F`, ink `#ECE7DB`, muted `#A9A496`, rule `#38362F`, sage-deep `#A7BA98`. All values to be verified with a contrast checker in Phase 0; numbers above are targets.

**Semantic rules:** progress is never red. "Below pace" uses `--ink-muted` text and an unfilled segment. Clay is reserved for things that need *you* (a blocker, a broken connection).

### 8.3 Typography

- **Headings:** *Newsreader* (variable, optical sizes; Google Fonts / self-hosted via `next/font`). Display 40/44, H1 32/38, H2 24/30, H3 19/26. Weight 400–500; italics for kicker lines.
- **Body/UI:** *Inter* (variable) 16/24 body, 14/20 secondary, 12/16 caption (uppercase tracking +0.06em for labels). **Tabular numerals** (`font-variant-numeric: tabular-nums`) everywhere numbers align.
- Minimum body size 16 px on mobile (also prevents iOS zoom on inputs).

### 8.4 Space, shape, elevation

- 4-px base grid; spacing scale 4, 8, 12, 16, 24, 32, 48, 64.
- Radius: 10 px cards, 8 px inputs, full for chips.
- Borders over shadows: 1 px `--rule`; one soft shadow only for floating elements (Log button, sheets).
- Layout: 12-column grid, max content width 1200 px, gutters 24 px desktop / 16 px mobile.

### 8.5 Motion

- 160–240 ms, `cubic-bezier(.2,.7,.2,1)`. Progress fills ease once on load; check-ins get a gentle ink-fill on the circle. No confetti, no bouncing.
- `prefers-reduced-motion`: all transitions → opacity-only or none.

### 8.6 Components (initial inventory)

Masthead (page title + date kicker) · Card (title, meta, body, footer link) · ProgressBar (segmented for counts, continuous for money) · ProgressRing (habit day) · WeekStrip (7 days with planned ○ / done ● / both ◉) · MonthCalendar (habit heatmap, 5 intensity steps of sage + pattern for "paused") · BarChart (weekly sessions, monthly savings) · Sparkline · StatusPill (source states) · SourceGlyph (manual / Apple Health / import) · Chip · Segmented control · Sheet (mobile bottom sheet for Log) · Dialog · Toast · EmptyState (illustration-free: a serif line + one action) · Timeline (milestones) · ReflectionPrompt.

### 8.7 Data-visualisation rules

- Every chart has a visible title, a text summary sentence ("4 of 5 sessions this week"), and an accessible data table (visually hidden or toggle).
- Never encode meaning in colour alone: done = filled + check glyph; planned = outline; paused = diagonal hatch.
- Targets are drawn as a thin dashed line, not a red zone.

### 8.8 Voice & copy

- Calm, specific, second person. "You saved $640 — $360 to go, with 25 days left." Not "Only 64%!"
- Misses: state facts, offer context. "2 of 3 gym sessions. Want to note what got in the way?" (optional).
- Empty states, e.g. Habits: *"No habits yet. Start with one you already do most days — it's easier to keep."* [Add a habit]

---

## 9. Desktop and mobile wireframe plan

Low-fidelity layouts; high-fidelity mocks come in Phase 0 after approval.

### 9.1 Overview — desktop

```
┌────────────┬──────────────────────────────────────────────────────────────────┐
│ Personal HQ│  Thursday, 5 November                                [+ Log]     │
│            │  Good afternoon.                                                 │
│ Today      │──────────────────────────────────────────────────────────────────│
│ • Overview │ ┌ November ───────────────────────────────────────────────────┐  │
│   Log      │ │ Gym  ●●○  1 of 3 this week   Pilates ●○  1 of 2   │ Savings │  │
│ Tracks     │ │ ███████░░░░░ 5/17 month       ██████░░░ 3/11       │ $400 of │  │
│   Fitness  │ │                                                    │ $1,000  │  │
│   Habits   │ │ Essays 0/2 · Case studies 1/3 · Portfolio V1: In progress    │  │
│   Savings  │ └─────────────────────────────────────────────────────────────┘  │
│ Work       │ ┌ This week's focus ───────┐ ┌ Coming up ──────────────────────┐ │
│   Projects │ │ 1 Finish case study #2   │ │ Nov 12  Portfolio copy freeze   │ │
│   Goals    │ │ 2 WHE assets to design   │ │ Nov 25  WHE campaign launch     │ │
│   Interests│ │ 3 Two Pilates classes    │ │ Nov 30  Savings goal date       │ │
│ Reflect    │ └──────────────────────────┘ └─────────────────────────────────┘ │
│   Review   │ ┌ Today ───────────────────┐ ┌ Recently ───────────────────────┐ │
│            │ │ ○ LSAT practice          │ │ ✓ Gym · Tue  (Apple Health)     │ │
│ Settings   │ │ ○ Read 20 min            │ │ ✓ Deposit $150 · Mon            │ │
│            │ │ ◌ Pilates 18:00 planned  │ │ ✓ Case study #1 drafted         │ │
│            │ └──────────────────────────┘ └─────────────────────────────────┘ │
│            │ Sources:  Apple Health · synced 2 h ago   Habits app · Unverified│
└────────────┴──────────────────────────────────────────────────────────────────┘
```

### 9.2 Overview — iPhone

```
┌──────────────────────────┐
│ Thu 5 Nov                │
│ Good afternoon.          │
│ ┌ This week ───────────┐ │
│ │ Gym ●●○   Pilates ●○ │ │
│ │ Savings $400 / 1,000 │ │
│ │ ███████░░░░░░░       │ │
│ └──────────────────────┘ │
│ ┌ Today ───────────────┐ │
│ │ ○ LSAT practice      │ │
│ │ ◌ Pilates 18:00      │ │
│ └──────────────────────┘ │
│ ┌ Focus ───────────────┐ │
│ │ 1 Case study #2 …    │ │
│ └──────────────────────┘ │
│ Coming up · Recently …   │
│                 ( + )    │
│──────────────────────────│
│ Today Fitness Habits $ ⋯ │
└──────────────────────────┘
```

### 9.3 Other screens (layout notes)

| Screen | Desktop | iPhone |
|---|---|---|
| Fitness week | 7-column week grid with planned/done per category; right column: targets, trend sparkline, source status | Horizontal WeekStrip, then list of sessions by day; tap → detail sheet with provenance and Correct/Hide |
| Fitness history | 12-week bar chart + table | Same chart, full width; table collapsible |
| Habits | Habit list with today's check circles left; month heatmap right | List with large check targets; tap habit → calendar + streak |
| Savings | Big progress figure + ledger table + monthly bars; Planned transfers panel separate & labelled | Progress card, "Add deposit" primary button, ledger list, planned transfers section below a divider |
| Projects | Board by status or list; project page: milestones timeline, dependencies, blockers | List of projects; project page stacked: next milestone, blockers, timeline |
| Goals | Month grid of goals by area; toggle Quarter | Grouped list by area |
| Weekly Review | Two-column: generated summary left, reflection form right | Stepper: Summary → Reflect → Priorities → Done |
| Settings | Sectioned form, effective-date pickers for targets | Same, one section per screen |
| Log sheet | Centered dialog | Bottom sheet, type chips, numeric keypad for amounts |

Breakpoints: `sm` 640, `md` 768, `lg` 1024, `xl` 1280. Designs are validated at 375 × 812 (iPhone 13 mini–15 width class) and 393/430 widths, and at 1440 desktop.

---

## 10. Phased implementation roadmap

Dates are suggestions from today (Thu 5 Nov 2026) to make the tool useful for the rest of November; each phase ends with a demo and your sign-off.

| Phase | Scope | Exit criteria | Suggested window |
|---|---|---|---|
| **0 — Foundations** | New `personal-hq` repo; Next.js + Tailwind tokens; Supabase project (ca-central-1); auth with MFA; RLS baseline + CI check; design tokens and 8–10 core components; layout shell with desktop rail and mobile tab bar; settings table; seed November goals | Sign in on desktop & iPhone; empty Overview renders with empty states; RLS tests green; Lighthouse a11y ≥ 95 | Nov 6–10 |
| **1 — Manual MVP** | Global Log; Fitness (manual logs, week view, targets, corrections); Savings (deposits, planned transfers with confirmation, progress); Overview cards; Goals list w/ editable targets | You can track November fitness + savings end-to-end on your phone | Nov 10–16 |
| **2 — Habits, Projects, Review** | Habits (schedules, check-ins, calendar, streaks, pauses); Projects & milestones (WHE, Portfolio, MISSOSOUP, IWD 2027); Interests journal; Weekly Review + priorities → Overview; export & deletion | First Weekly Review completed on Sun Nov 22; export zip validated | Nov 16–22 |
| **3 — HealthKit companion** | Event provenance tables; classification + dedupe engine (shared fixtures); ingest Edge Function; pairing flow; SwiftUI companion (connect, sync, status); connection states | A Watch-recorded Pilates class shows up once, merges with a manual log of the same class, deletion in Health is reflected | Late Nov – early Dec (needs Apple Developer enrolment) |
| **4 — Habits connector** | Only after the app is verified: CSV import or Shortcuts push, or a documented API | Import preview + dedupe works on a real export | After verification |
| **5 — Hardening & longer horizons** | Multi-month savings goals; quarterly views; trends; performance budget; backup/restore drill; optional dark theme polish | Restore drill passes; Q1 2027 goals set up | December |

**Can the HealthKit work start earlier?** The server-side half (provenance, dedupe, ingest) can be built in Phase 1–2 against fixtures, so the iPhone app becomes a thin final step.

---

## 11. Testing and acceptance criteria

### 11.1 Test layers

| Layer | Tool | Covers |
|---|---|---|
| Unit | Vitest | week/month boundary maths in America/Toronto (incl. DST end Nov 1 2026), streak rules, progress calc, dedupe matcher, classification, money formatting |
| Database | pgTAP (`supabase test db`) | RLS: user B cannot select/insert/update/delete user A's rows on every table; device token can only call ingest; cycle prevention on milestone deps |
| Contract | Shared JSON fixtures in `packages/contracts/fixtures` used by Vitest **and** Swift tests | Companion DTO ↔ ingest schema stay in sync |
| E2E | Playwright (desktop Chromium + WebKit iPhone emulation) + `@axe-core/playwright` | Core flows F-1…F-7, zero serious axe violations |
| iOS | Swift Testing / XCTest with a mocked `HKHealthStore` protocol | Anchor only advances after 2xx; deletions forwarded; predicate excludes other workout types; token in Keychain |
| Privacy | Log-capture test with sentinel values | No health/money values in logs |
| Manual | VoiceOver (iOS) + keyboard-only pass each phase | |

### 11.2 Acceptance criteria (selected, Given/When/Then)

**Fitness**
- Given a manual Pilates log at 18:00 on Nov 10 and an Apple Health Pilates workout 18:05–18:55 the same day, when the workout syncs, then the week shows **one** Pilates session with two sources.
- Given the same HealthKit batch is sent twice, then counts are unchanged (idempotent).
- Given a synced workout I re-classified as Gym, when it re-syncs, then it remains Gym.
- Given a workout is deleted in Apple Health and I never edited it, when the deletion syncs, then it no longer counts and appears in "Removed from Apple Health".
- Given a 23:30 workout on Sat Nov 7 (Toronto), it counts in the week of Nov 2–8, not the next.
- Given a cycling workout in Health, it is never sent to the server.

**Habits**
- A 3×/week habit done Mon, Wed, Sat keeps its streak; done twice shows "2 of 3" with no "streak broken" alarm language.
- Paused days are excluded from consistency %.
- The Habits-app connector displays "Unverified" and offers no import until `verified = true`.

**Savings**
- Given a planned $250 transfer for Nov 15 and no confirmation, progress is unchanged on Nov 16.
- Confirming "Yes, $200" adds exactly $200.00; remaining = target − confirmed sum.
- Amounts are stored in cents; $0.10 + $0.20 shows $0.30.

**Projects & Review**
- A milestone depending on an incomplete milestone shows "Waiting on …".
- Weekly Review copy contains no words from the banned list (`failed`, `missed streak`, `behind!`, `lazy`…), enforced by a unit test over copy strings.
- Priorities saved on Sunday appear on Monday's Overview.

**Settings**
- Changing Gym target from 3 → 2 effective next week leaves past weeks evaluated at 3.

**Security & privacy**
- Unauthenticated requests to any page redirect to sign-in; API returns 401.
- Without MFA (aal1), data queries return zero rows.
- A revoked device token gets 401 on next ingest.
- Export includes every table with provenance; "Delete everything" leaves no rows for the user.

**Accessibility & performance**
- All interactive elements reachable by keyboard with visible focus (`--sage-deep` 2 px ring).
- Charts have text summaries and data tables.
- Overview LCP < 1.5 s on throttled 4G (Lighthouse mobile).

---

## 12. Required external accounts, permissions and local tools

### 12.1 Accounts

| Account | Needed for | Cost | Phase |
|---|---|---|---|
| GitHub (existing) | private `personal-hq` repo, CI, secret scanning | free | 0 |
| Vercel | hosting, preview deploys | Hobby is free *for personal, non-commercial use* — fits | 0 |
| Supabase | Postgres, Auth, Edge Functions | Free tier works; **Pro (~$25 USD/mo)** recommended for daily backups/PITR and no project pausing | 0 |
| Email sending (Resend or Postmark) | magic-link email via custom SMTP | free tier | 0 |
| Domain (optional) | e.g. `hq.yourdomain.ca` | ~$15/yr | 0–1 |
| **Apple Developer Program** | HealthKit entitlement on device, TestFlight, background delivery | $99 USD/yr | 3 |
| Apple ID on the iPhone with Health data | testing | — | 3 |

### 12.2 Permissions to grant (by you)

- Supabase: create project in **ca-central-1**; enable MFA (TOTP); disable signups; add your email.
- Vercel: connect GitHub repo; set env vars; restrict preview deployments with Vercel Authentication.
- iPhone: allow "Personal HQ Sync" to read **Workouts** in Health; optionally allow Background App Refresh.

### 12.3 Local development tools

| Tool | Purpose |
|---|---|
| Node.js 22 LTS (or current LTS) + pnpm | web app |
| Supabase CLI + Docker Desktop (or OrbStack) | local Postgres/Auth, migrations, pgTAP |
| Git, VS Code (or editor of choice) | |
| Playwright browsers | e2e |
| **macOS + current Xcode** (26.x or later) | iOS companion — required, cannot be done on Linux/Windows or in a cloud browser session |
| iPhone running iOS 18+ (Health data lives on the device; the Simulator's Health app can be seeded for tests) | real-device testing |
| Optional: Apple Watch | real workout data |

---

## 13. Repository structure, and browser vs native iOS

### 13.1 Proposed repository (`personal-hq`, private)

```
personal-hq/
├─ apps/
│  ├─ web/                         Next.js app (App Router)
│  │  ├─ app/
│  │  │  ├─ (auth)/sign-in/
│  │  │  ├─ (app)/                 authenticated layout: rail + tab bar
│  │  │  │  ├─ page.tsx            Overview
│  │  │  │  ├─ fitness/ habits/ savings/ projects/ goals/ interests/ review/ settings/
│  │  │  │  └─ log/
│  │  │  └─ api/export/route.ts
│  │  ├─ components/ui/            design-system primitives
│  │  ├─ components/charts/        SVG calendars, bars, sparklines
│  │  ├─ lib/
│  │  │  ├─ domain/                pure TS: time (tz/week), progress, streaks, dedupe, classification
│  │  │  ├─ data/                  server-only queries & actions (Supabase)
│  │  │  └─ connectors/            HabitConnector interface, csv, habits_app (unverified stub)
│  │  ├─ styles/tokens.css         Tailwind v4 @theme tokens
│  │  └─ tests/ (unit, e2e)
│  └─ ios/
│     └─ PersonalHQSync/           Xcode project (SwiftUI)
│        ├─ App/ Features/Connect, Status, Settings
│        ├─ Health/                HealthStoreProtocol, WorkoutQuery, AnchorStore
│        ├─ Sync/                  IngestClient, BatchBuilder, Retry
│        └─ Tests/
├─ packages/
│  └─ contracts/                   JSON Schema for ingest payload + shared fixtures
├─ supabase/
│  ├─ migrations/                  SQL (tables, RLS, views, definer functions)
│  ├─ functions/ingest-workouts/   Edge Function (Deno/TS)
│  ├─ tests/                       pgTAP RLS & function tests
│  └─ seed.sql                     November 2026 goals (dev only)
├─ docs/
│  ├─ PLAN.md                      this document
│  ├─ integrations/healthkit.md, habits.md
│  ├─ privacy-policy.md
│  └─ decisions/                   ADRs
├─ .github/workflows/ci.yml        typecheck, lint, unit, pgTAP, e2e, RLS-coverage check
└─ .env.example
```

The **dedupe and classification logic lives in one place** (`lib/domain`, mirrored in the SQL ingest function or invoked by it); shared fixtures in `packages/contracts` keep the Swift client, TypeScript and SQL in agreement.

### 13.2 Browser vs native iOS

| Capability | Browser (web app, desktop & iPhone Safari) | Requires native iOS companion |
|---|---|---|
| All dashboards, calendars, charts, review, projects, savings, habits | ✅ | |
| Manual workout logging and corrections | ✅ | |
| Add to Home Screen (PWA-style icon, standalone display) | ✅ | |
| Reading Apple Health workouts | ❌ impossible | ✅ HealthKit |
| Reacting to new workouts in the background | ❌ | ⚠️ best-effort background delivery |
| Detecting Health permission changes | ❌ | ⚠️ indirectly ("no data visible") |
| Reading another app's data ("Habits") | ❌ | ❌ also not allowed natively; only via that app's own export/Shortcuts/API |
| Receiving pushes from iOS Shortcuts | ✅ (endpoint) | Shortcut runs on iPhone |
| Web push reminders (optional, later) | ✅ iOS 16.4+ for Home-Screen web apps | |

---

## Approval checklist

Please confirm or adjust before any production code is written:

- [ ] Assumptions A1–A9
- [ ] Answers to open questions 1–8 (especially **which Habits app**, LSAT target, partial-week rule, sign-in method, Apple Developer enrolment)
- [ ] Stack, including the Edge-Function ingest and no-analytics decisions
- [ ] Visual direction (palette, Newsreader + Inter)
- [ ] Roadmap phasing and the creation of a separate private `personal-hq` repository
