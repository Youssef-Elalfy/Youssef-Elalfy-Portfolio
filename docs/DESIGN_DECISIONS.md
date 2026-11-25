# ELALFY / Living Signal — design decisions

November 2026 redesign. Sources: the owner's brief (`CLAUDE_MASTER_PROMPT.md`), the three inspiration videos in `assets/` (frames extracted and inspected in this session), and the reference research in `DESIGN_REFERENCE_RESEARCH.md`. The external reference sites listed there were **not re-opened** in this session; the insights below come from the provided research notes and the videos.

## Concept

A software system drawn as light: a faceted glass core (the product) with lime filaments carrying pulses around it (requests, tools, data moving through a system). It is the hero's signature, then steps back into the margins as ambient atmosphere so it never competes with text. The same object re-tints to each project's accent when a visitor focuses a project.

## Tokens

| Token | Value | Role |
|---|---|---|
| Obsidian | `#040605` | Base. A green-tinted black, not neutral grey. |
| Graphite | `#0a0f0c` / `#111914` | Surfaces under glass. |
| Ice | `#eef3ec` | Primary text. |
| Moss | `#a2ada4` / `#7d8a80` | Secondary / tertiary text (both pass WCAG AA on obsidian). |
| Lime | `#c8ff3d` | Interaction and "live" only: CTAs, active states, live status, the signal. |
| Emerald / teal | `#1f7a55` / `#3ee6d0` | Depth in the 3D scene and the "local application" status. |

Type: **Bricolage Grotesque** (variable width and optical size) for display — set at width 88–92 so names read as wordmarks without collapsing; **Geist** for UI and body; **Tajawal** only for Arabic names (`lang="ar"`, `dir="rtl"`).

## Reference → decision

| Insight | Source | ELALFY decision |
|---|---|---|
| Interactive engineering can *be* the story, but links must never hide inside a game. | Bruno Simon (research notes) | The 3D scene is decorative and `aria-hidden`; every project, filter and link is plain HTML that works without WebGL. |
| Premium 3D comes from materials and light, not object count. | Lusion (research notes) | One object, physically based glass (transmission on capable devices), a generated studio environment, no post-processing. 17 draw calls in measurement. |
| One-page WebGL portfolios work when wayfinding is strong. | Merouane Bali (research notes) | A glass segmented nav with a sliding lens that tracks the section in view; the scene reframes itself per section, which doubles as a sense of place. |
| Editorial hierarchy and varied project presentation beat identical cards. | Inspiration 1 | Four flagship projects as large "exhibits" (browser stage + phone, alternating sides); the rest as an editorial index; design studies as a small archive strip. |
| An expressive pointer trail gives a site physical presence. | Inspiration 2 | A thin lime→emerald ribbon that dissolves in ~0.5 s, fine pointers only, never replaces the native cursor, off for reduced motion or paused motion. |
| Glass pill tabs with a high-contrast selected tab. | Inspiration 3 | Light-glass lens on dark glass for the active tab (nav, filters), animated with a spring; on phones the same links become a bottom dock. |
| Motion should be one orchestrated moment, not effects everywhere. | Research takeaway 3 | The preserved intro hands off through an iris opening from the wordmark's lime dot, then the hero plays one entrance. No scroll-triggered fade-ins on every section. |

## The intro — what was kept

The original `CinematicIntro` + `Preloader` (pre-November baseline, restored from `backups/`) defined: the `ELALFY.` wordmark with a neon lime dot, the flicker keyframes, "Design. Develop. Experience.", "Welcome to my digital universe.", **Enter Experience** (with sound) and **Enter Without Sound**, a perspective grid floor, a reactive radial glow, and a once-per-session rule. All of these are still there. Added: real loading progress, letter-by-letter reveal, a scan line, an iris transition into the site, Skip intro / Esc, a "Replay intro" control in the footer, a pre-paint script so returning visitors never see a flash, gentle audio fade-in, `inert` page behind the dialog, and a reduced-motion path.

## What was replaced and why

- **The 3D desk "studio"** (added 6 Nov) → the signal sculpture. The desk read as a generic product render and occupied the hero with a monitor screenshot; the new object carries a brand idea and leaves room for the portrait.
- **Front-End Developer positioning** → Full-Stack Developer / Creative Front-End Engineer / AI-Powered Applications Builder, with an expertise map where every skill links to the projects that use it.
- **Old portraits** (`youssef-about.jpg`, `youssef-main.png`) → the approved `assets/youssef-main.jpg`, only resized and re-encoded (no retouching, no generated content).
- **Particles, custom cursor, typing effect, tilt cards** (pre-November) stay retired; the brief asks for restraint and a native cursor.


## Bilingual site (added 11 November 2026)

- **Routing:** English at `/`, Arabic at `/ar` — two route groups, each with its own root layout, so `<html lang dir>` is correct in the server HTML (no flash, no hydration mismatch). Every case study exists in both. hreflang (en, ar, x-default), canonical, og:locale and a bilingual sitemap are generated.
- **Dictionaries:** `i18n/dictionaries/en.ts` defines the shape and `ar.ts` is typed against it, so a missing Arabic string fails the build. Arabic project content lives in `data/projects.ar.ts`; skills carry both languages in `data/expertise.ts`. Only the current language is sent to the browser (170 kB first load, lower than before).
- **Preference:** the switcher stores the choice; English URLs redirect to Arabic before paint when Arabic was chosen. Arabic URLs are never redirected away, so shared /ar links always open in Arabic. Switching keeps the current section or project and never replays the intro.
- **Typography:** Alexandria for Arabic display — it keeps the geometric weight of Bricolage at the same sizes — and Tajawal for Arabic text. Amiri was not used: a calligraphic serif fought the technical tone. Arabic fonts load with an Arabic-only unicode-range and no Arial fallback, so Latin words inside Arabic keep Bricolage and Geist. Arabic gets no tracking, no uppercase and taller line-heights, and the hero reveal mask has extra bottom room so the dots of a final ي are never clipped.
- **RTL:** logical properties (inset-inline, padding-inline-start, margin-inline-start, text-align: end); directional icons flip with `.flip-rtl`; 3D tilts and the sculpture's positions mirror; gallery arrow keys follow reading direction; English names are isolated with bdi or dir="ltr" spans. Intro words animate whole, never letter by letter, so Arabic shaping stays intact; the ELALFY wordmark stays Latin.

## Cursor (added 11 November 2026)

A 32 px SVG arrow in lime with a dark outline (so it holds contrast on light screenshots too), a soft glow and a bevel highlight; the hotspot is exactly on the tip. On links and buttons a small "signal node" ring appears beside it — the same packet motif as the 3D filaments. Text fields keep the native I-beam; disabled controls show not-allowed. It applies only to (hover: hover) and (pointer: fine); touch devices and forced-colours mode keep native cursors. The ribbon trail is unchanged.
