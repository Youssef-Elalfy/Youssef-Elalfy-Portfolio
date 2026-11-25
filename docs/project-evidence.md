# Verified portfolio project evidence

## Update — 11 November 2026

### UniFlow Campus — corrected scope

No source repository was found locally (searched D:/My Works, Desktop, Documents) and no public GitHub repository exists under Youssef-Elalfy. The scope was therefore verified from the **live production build** at https://uniflow-campus.vercel.app/ (HTTP 200, `Server: Vercel`, Vinext/Rolldown chunk names, `X-Vinext-*` headers), by downloading its public JavaScript chunks and reading the API calls and route maps they contain. No account was created and no signed-in flow was exercised.

Confirmed in the production client:
- About 30 server API routes, including `/api/auth/sign-in/email`, `/api/auth/sign-up/email`, `/api/auth/sign-in/social`, `link-social`, `/api/auth/callback/facebook`, `/api/auth/change-password`, `/api/auth/recovery/*` (email and authenticator), `/api/auth/security/*` (overview, deletion), `/api/auth/sign-out`, `/api/registration`, `/api/institutions`, `/api/campuses`, `/api/staff-invites`, `/api/student-directory`, `/api/student-record`, `/api/grade-overview`, `/api/upload`, `/api/profile-photo`, `/api/verification-file/*`, `/api/files/*`, `/api/workspace`, `/api/study`, `/api/study/conversations`, `/api/study/settings`, `/api/login-providers`.
- Role map: student → dashboard, courses, assignments, schedule, grades, attendance; instructor → instructor tools; admin → admin, grades, directory; plus `institution-review` approvals with downloadable proof documents.
- Attendance cards per course (recorded sessions, absences).
- Google and Facebook account linking; authenticator-app recovery.
- Transactional email through Brevo (rate-limit message in the client).
- AI study assistant with Groq, Gemini, OpenAI, Claude and DeepSeek on user-supplied keys.
- Arabic/English strings throughout; Tailwind utility classes.

Not claimed: the database engine (not visible from the client), test coverage, user numbers, institutional deployments.

### Repository visibility

- MASAR AI — `github.com/Youssef-Elalfy/masar-ai-agent` is **public** (GitHub API visibility public, page HTTP 200). The site links it as "View source code".
- Penguin Academy — `github.com/Youssef-Elalfy/penguin-academy-lms` is **public**; linked as well.
- SADEEMAN AI — remains private; no link.

## Update — 10 November 2026

Two projects were added from their local source folders (read-only; no `.env` file was opened).

### MASAR AI (مَسَار)

- Source: `Desktop/RAHHAL_AI_AGENT` (git remote `github.com/Youssef-Elalfy/masar-ai-agent`), `README.md`, `docs/GITHUB_RELEASE_REPORT.md`.
- Repository visibility is **private**; the site shows "Private GitHub repository" instead of a link.
- README states: no public hosted deployment; company, programs and prices are demonstration data; screenshots were captured against the deterministic test server (`e2e-scripted` model label).
- Stack and features copied from the README's feature and technology tables. Test counts from the README are not repeated on the site.
- Media: `docs/assets/masar-*.jpg` (4 files) → `public/projects/masar-ai/*.webp`.

### SADEEMAN AI (سَدِيمًا)

- Exact branding from `Desktop/Sadeeman/README.md`: **سَدِيمًا | SADEEMAN AI**. "SEEDMA" does not appear in the source.
- Source: README, `CLAUDE_HANDOFF/IMPLEMENTATION_STATUS.md`, `CLAUDE_HANDOFF/PROJECT_ARCHITECTURE.md`, `apps/*/package.json` (Fastify 5, Next.js 16, React 19, Three.js 0.187, Zod 4, Supabase JS). Git remote `github.com/Youssef-Elalfy/sadeeman-ai`, treated as private.
- Status: in development; production API deliberately gated; no public deployment; CRM removed by owner decision on 2026-11-06.
- Media: `.private/production-qa/desktop.png` and `mobile.png` (welcome screen). Handoff screenshots containing "TEST ONLY" messages were deliberately not used.

### Other changes

- Penguin Academy is labelled **Educational project**.
- Nova Learning moved to the "Earlier prototypes and design studies" archive so the primary gallery matches the owner's seven-project list.
- The portfolio itself is not listed anywhere as a project.

---


Checked 6 November 2026. This file is the factual basis for `data/projects.ts`; it is not a claim that every sibling application was retested. All work was local. No repository was pushed and no deployment was created.

## SAYNTRA

- Sources: sibling `sayntra/README.md`, `STATUS.md`, `frontend/package.json`, frontend source and existing browser test captures.
- Status: local working development checkpoint, explicitly not production-ready or deployed.
- Verified in source/docs: Laravel 13, Sanctum, MySQL, Next.js/React/TypeScript; scoped organizations, customer/device intake, technician assignment, diagnosis, role-based dashboards, team invitations and a Three.js marketing experience.
- Not delivered in the authoritative archive: estimates, inventory movements, invoicing, payments, warranty, notifications and the full delivery lifecycle. These are excluded from portfolio feature claims.
- Media: `frontend/test-results/story/en-1440-stage1.png`, `en-1440-stage4.png`, `ar-390-stage1.png`. These are actual screenshots of the marketing story; its 3D phone uses explicitly labeled illustrative sample data. They do not prove a working tracking portal.

## UniFlow Campus

- Sources: original portfolio data; `D:/My Works/UniFlow_Behance_Full_Case_Study_2026/UniFlow_Behance_Editorial_2026/Behance_Description.txt` and original `assets/*.webp`.
- Creator documentation identifies front-end/web development, product/UI design and visual presentation; no employment or measured business results are claimed.
- Actual provided screens: dashboard, courses, timetable, attendance, grades and study assistant. These are described as interface features, not independently audited backend capabilities.
- Fresh public browser verification: `https://uniflow-campus.vercel.app/` returned HTTP 200. Its current public entry is a sign-in page. Desktop and mobile screenshots captured with installed Playwright/Chromium.
- Status: public personal-project demo; authenticated workflows and institutional use not revalidated.

## MerchantFlow

- Sources: `MerchantFlow_Complete_Source_2026-10-15/MerchantFlow/README.md`, source structure and `MerchantFlow_Real_Screenshots_For_Mohimtak/README.txt`.
- Creator text identifies interface development/refinement, responsive alignment, code review and Vercel deployment.
- Source records React 19/TypeScript/Tailwind 4, Motion, Recharts, Radix, Vinext/App Router conventions, provider adapters and server-side domain services. Existing D1/R2 and Supabase provider paths are documented; the portfolio does not claim to have re-audited those services.
- Actual features described: catalog, orders, customer records, variants, inventory, reporting, storefront and cart, reviewable WhatsApp drafts and deterministic local order extraction.
- Exclusions: no LLM claim for local extraction, no automatic WhatsApp delivery, no card processing or paid subscriptions.
- Fresh browser verification: `https://merchantflow-mu.vercel.app/` returned HTTP 200; desktop and mobile landing captures saved. Dashboard and storefront media are genuine creator-provided application screenshots.
- Noura Fashion records, revenue and customer information are explicitly fictional demo data, never portfolio achievements.

## Penguin Academy

- Sources: sibling `penguin-academy/README.md`, Laravel source, routes, controllers, views and documented milestones.
- Local Laravel 13/Fortify/MySQL application with Bootstrap/Blade interfaces and a versioned REST API; explicitly no service deployed.
- Verified from source/docs: three roles, courses, lessons, enrollment, withdrawal/re-enrollment, persisted completion/progress and scoped learning reports.
- The documented historical QA counts are deliberately not repeated as tests performed in this portfolio session.
- No legitimate application screenshot was found in the available archive. No runnable Windows PHP/MySQL environment was established. The portfolio presents an explicit screenshot-unavailable fallback and genuine source-based case study.

## Nova Learning

- Sources: sibling `Nova Learning - Saas/package.json`, `src/app`, `src/lib/ai/provider.ts`, `src/lib/api/index.ts`, Zustand stores and feature routes.
- Next.js/React/TypeScript/Tailwind, Zustand/TanStack Query, form/schema libraries, Supabase integration scaffolding and demo responses are present.
- Classified as prototype. The presence of API routes or provider abstractions does not prove production configuration or live AI delivery. No database integration was invoked and no secrets were read.
- The original `nova-learning-showcase.png` is a promotional composition, so it is not passed off as a raw application screenshot.
- A sanitized, source-only temporary copy was launched locally with existing dependencies referenced read-only; no `.env` or credentials were copied. After overcoming a cross-drive Next.js path issue, the actual frontend returned HTTP 200. Playwright clicked the real Explore as Demo control and reached the actual dashboard. Fresh landing, dashboard and 390 px mobile dashboard screenshots are integrated as optimized WebP. Only the Next.js development indicator was hidden for clean capture; application UI was not fabricated or altered. All displayed learning statistics are fictional demo data. Temporary copies and capture servers were removed/stopped afterward.

## Bella Tavola / Italic Restaurant

- The sibling folder is named `Italic Resturant`, but its README and rendered public page identify the product as **Bella Tavola**.
- Sources: sibling README, HTML/CSS/JavaScript source, creator-provided screenshots.
- Pure HTML5, CSS and vanilla JavaScript; responsive menu, dialogs/lightbox, focus handling, Intersection Observer reveals, validated demonstration forms and reduced-motion behavior.
- Fresh public browser verification: `https://italic-resturant.vercel.app/` returned HTTP 200; desktop and mobile screenshots captured.
- Fictional restaurant concept. Reservation/newsletter forms simulate processing and do not transmit bookings or email. Testimonials and restaurant claims are illustrative.

## Projects not added without evidence

MASAR AI, CASE 404 and SARAB were requested, but no matching source or verified media was located in the inspected sibling project roots. The GitHub connector returned an unavailable-tool error for repository listing. No repository URLs, stacks, deployments, screenshots or features were invented. These projects need their actual source/repository or media to be added credibly.

AI Labs, Soleuxe and Sakeena remain available at their original direct routes through the archivedProjects/allProjects exports, clearly identified as design concepts with original promotional artwork and original Behance links. The primary projects export curates six source-verifiable application/web projects.

## Media processing and verification

- Three public demos freshly captured at 1440×960 and 390×844 using already-installed Playwright/Chromium. Nova was additionally launched and captured from its actual local prototype, including its explicit demo dashboard and mobile layout. See `project-capture-results.json` and `project-image-manifest.json`.
- Raw public captures are retained next to optimized assets for provenance. Existing project screenshots are copied through Sharp processing, not recreated.
- WebP maximum width 1600, no enlargement, quality 88. Thumbnail width 800, quality 84. Next Image provides responsive delivery on the site.
- `project-image-manifest.json` records every source, destination, actual dimensions and optimized byte size.
- Images were visually inspected for authenticity and sensitive content before integration. Demo sales figures remain explicitly identified as fictional.
- Gallery aspect ratios are derived from actual optimized metadata to avoid layout shift.

## Portfolio checks performed by content agent

- TypeScript: `npx tsc --noEmit` passed after case-study and gallery changes.
- Public pages: three HTTP 200 responses and real desktop/mobile captures recorded.
- Main agent owns the final integrated production build, responsive/browser QA and console checks.


