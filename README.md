# ELALFY — Youssef Elalfy's portfolio

Full-Stack Developer · Creative Front-End Engineer · AI-Powered Applications Builder.

Next.js 15 (App Router), React 19, strict TypeScript, Tailwind CSS 4 (reset + tokens), Motion, GSAP + ScrollTrigger for scroll reveals, and a single React Three Fiber / Three.js scene. Design notes: `docs/DESIGN_DECISIONS.md`. Project sources: `docs/project-evidence.md`.

## Run locally

```powershell
npm install
npm run dev
```

No secrets are required. The contact form uses the existing public Web3Forms identifier; delivery depends on that account.

## Verify

```powershell
npm run lint
npm run typecheck
$env:NODE_OPTIONS='--use-system-ca'; npm run build
npm run start -- --hostname 127.0.0.1 --port 3300
```

In a second terminal:

```powershell
npm test                                         # Playwright, 18 tests, both languages, uses installed Chrome
node docs/qa/measure-redesign.cjs http://127.0.0.1:3300   # lab LCP/CLS + axe-core scan
```

Don't run `next dev` and `next start` against the same `.next` folder at the same time. If images ever hang in production locally, delete `.next/cache/images` (regenerated automatically).

## Where things live

| Path | What |
|---|---|
| `components/intro/CinematicIntro.tsx` | The original ELALFY intro, preserved and extended (loading, iris hand-off, Skip/Esc, Replay). |
| `components/nav/SiteNav.tsx` | Glass segmented navigation and the mobile dock. |
| `components/scene/` | `SceneLayer` (capability detection, fallback, pause) and `SignalScene` (the 3D sculpture). |
| `components/SignalTrail.tsx` | Pointer ribbon for fine pointers. |
| `components/home/` | Hero, work gallery, expertise explorer, about, contact. |
| `data/projects.ts`, `data/projects.ar.ts` | Seven primary projects and the archive: English facts, Arabic text. The portfolio itself is never a project. |
| `i18n/` | Locale config, typed en/ar dictionaries, project localization. English at `/`, Arabic at `/ar`. |
| `app/(en)`, `app/(ar)/ar` | One root layout per language (correct lang/dir in the server HTML); pages render shared components from `components/site`. |
| `data/expertise.ts` | Skills, each mapped to the projects that use it. |
| `lib/store.ts`, `lib/audio.ts` | Shared state between DOM and WebGL; gesture-only ambient audio. |
| `components/site/ProjectPage.tsx` | Case studies, statically generated in both languages. |

## Deployment

Not deployed. The Vercel project link in `.vercel/` is untouched. Deploy only after the owner approves.
