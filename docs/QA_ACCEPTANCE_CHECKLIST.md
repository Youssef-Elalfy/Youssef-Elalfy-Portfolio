# ELALFY Portfolio — Actual QA + Delivery Checklist

This is an EXECUTION checklist; tick only after real test or inspection. If blocked, mark `BLOCKED` with reason rather than claiming a pass.

## Design & identity

- [ ] Full-Stack + Creative Developer identity clearly present in hero, about, skills and metadata.
- [ ] Black/obsidian × electric lime/emerald visual identity is coherent and original.
- [ ] Site tells engineering credibility through actual projects and verified details.
- [ ] Design references studied without unlicensed copying.
- [ ] Intro motion and audio flow preserved and meaningfully enhanced (before/after noted).
- [ ] Navbar faithfully interprets `inspiration 3.mp4` glass tab feeling; works on mobile.
- [ ] 3D scene looks alive and cinematic, not a particle-template/rotating generic sphere.
- [ ] Editorial typography clear against WebGL/lighting.
- [ ] New portrait integrated only when real owner-approved file supplied.
- [ ] Existing good features preserved; change log explains replacements.

## Projects & data

- [ ] `ELALFY Portfolio` is NOT listed as a project.
- [ ] SAYNTRA present with truthful state and stack.
- [ ] MASAR AI present with truthful state and stack.
- [ ] SADEEMAN AI present as DISTINCT project with truthful state and stack.
- [ ] Penguin Academy LMS present, clearly educational/experimental.
- [ ] MerchantFlow present.
- [ ] UniFlow present.
- [ ] Bella Tavola/Italic Restaurant present.
- [ ] Existing creative/design projects reviewed for archival retention.
- [ ] Every project image matches the actual project or is visibly marked pending.
- [ ] Every project link tested; no fake demo or dead case-study buttons.
- [ ] Full-stack expertise includes verified backend, DB, APIs, Auth, testing, AI skills.

## Intro, navigation, input

- [ ] First-entry intro not stuck, skip works, returns correctly to hero.
- [ ] Audio can be enabled only after interaction, mute/unmute works, respects user choice.
- [ ] Returning visitor behavior sensible; intro replay possible without trap.
- [ ] All navbar anchors and active states work with pointer/keyboard/touch.
- [ ] Interactive brush/cursor effects do not block native pointer/selection.
- [ ] Work category filters and project details operate.
- [ ] Contact form end-to-end tested or clearly documented fallback, including errors.
- [ ] Social links and external links verified, no localhost in production.

## Responsive / accessibility

- [ ] 320px smartphone layout usable without horizontal scroll.
- [ ] 375/390px portrait phone layout polished.
- [ ] 768px tablet layout and nav polished.
- [ ] 1024px tablet/laptop layout polished.
- [ ] 1440px standard desktop layout polished.
- [ ] 1920px large-screen art direction polished.
- [ ] All visible labels have sufficient contrast and legible size.
- [ ] Accessible headings/forms/navigation, alt text and focus states.
- [ ] Keyboard-only and screen-reader-friendly content paths.
- [ ] Reduced motion and no-WebGL fallback usable with project links available.
- [ ] Touch interactions have no phantom hover trap.

## Technical / production

- [ ] Typecheck passes.
- [ ] Lint/check passes (or existing nonblocking warnings documented).
- [ ] Production build passes.
- [ ] Browser console no unhandled critical errors or hydration failures.
- [ ] 3D resources cleaned up, nonvisible/offscreen behavior sensible.
- [ ] Images/videos/fonts optimized; no huge autoplay downloads.
- [ ] OG image works and metadata domain/canonical/title are correct.
- [ ] Favicon, sitemap/robots where needed, and semantics work.
- [ ] Lighthouse/accessibility audit performed and scores recorded honestly.
- [ ] Core Web Vitals assessed with limitations noted (lab != field data).
- [ ] No secrets exposed; contact endpoint has safe validation and failure states.
- [ ] Before/after screenshots exist for desktop and mobile.
- [ ] Plugins/skills/agents used and install recommendations are reported by exact names.
- [ ] Outstanding user assets/permissions and next steps listed succinctly.
- [ ] Production deployment NOT performed without owner approval.

## Test matrix record (fill in)

| Test | Environment/viewport | Result | Evidence |
| --- | --- | --- | --- |
| Intro and audio | Desktop Chrome/Edge | Not yet tested | — |
| Project gallery and links | Desktop | Not yet tested | — |
| Responsive | 320/390/768/1440/1920 | Not yet tested | — |
| Keyboard and reduced motion | Desktop/mobile | Not yet tested | — |
| WebGL fallback | Unsupported / emulated | Not yet tested | — |
| Build / typecheck / lint | CI/local | Not yet tested | — |
| Performance and accessibility | Lighthouse / browser | Not yet tested | — |
