# Redesign progress and QA record — 10 November 2026

Branch `redesign/living-signal` (local Git, created this session; baseline commit `722b891` holds the previous state). Nothing pushed or deployed.

## Verified

| Check | Result | Evidence |
|---|---|---|
| `npm run typecheck` | Pass | — |
| `npm run lint` | Pass (one documented, file-scoped rule exception in `SignalScene.tsx` for R3F frame-loop mutation) | — |
| `npm run build` | Pass — 19 routes, home 175 kB first-load JS (3D loaded separately after idle) | — |
| Playwright (`npm test`) against production build | 12/12 pass | `docs/qa/test-results.json` |
| Intro: shows on first visit, Esc/Skip, stays skipped on reload, Replay works, focus lands on Enter | Pass | test 1 |
| Sound only starts from the Enter click; nav toggle mutes | Pass | test 2 |
| No horizontal scroll at 320, 375, 390, 768, 1024, 1440, 1920; no console/page errors | Pass | `docs/qa/redesign/home-*.png` |
| Nav marks current section; mobile dock reaches every section | Pass | test 4 |
| Seven primary projects present, portfolio not listed, filters correct | Pass | test 5 |
| Expertise evidence links | Pass | test 6 |
| Contact validation + HTTP 422 / app error / success (mocked, no mail sent) | Pass | test 7 |
| No-WebGL fallback | Pass | test 8 |
| Reduced motion: intro usable, scene static | Pass | test 9 |
| Pause control freezes the scene | Pass | test 10 |
| Keyboard: skip link first, then navigation | Pass | test 11 |
| All 11 case studies return 200 with OG metadata; gallery keyboard + focus restore; unknown slug 404 | Pass | test 12 |
| axe-core (WCAG 2.1 A/AA + best practice) on `/` at 1440 and 390, and `/projects/masar-ai` | 0 violations | `docs/qa/redesign/lab-measurements.json` |
| Lab LCP / CLS (desktop) | 864 ms / 0.004 | same file |
| Lab LCP / CLS (390 px, 4× CPU throttle) | 652 ms / 0 | same file |

## Not verified / limits

- **Lighthouse** was not run (not installed; installing it was not requested). Scores are not claimed.
- **Main-thread blocking** in the lab: ~1.0 s desktop and ~1.9 s at 4× throttle, mostly WebGL shader compilation and environment generation under SwiftShader software rendering. Real GPUs should be faster, but this was not measured on physical devices.
- **INP** and field Core Web Vitals: not measurable locally.
- **Real devices** (iOS Safari, Android Chrome, Firefox): not tested; widths were emulated in Chrome.
- **Audio** playback was verified as a state change (play() resolved); it was not listened to.
- **Contact delivery**: Web3Forms responses were mocked; no real message was sent.
- **External links** (LinkedIn, Behance, WhatsApp, live demos) were not re-requested in this session; live demo URLs come from the November 6 verification.


## Update — 11 November 2026 (bilingual, UniFlow, MASAR, cursor)

| Check | Result |
|---|---|
| typecheck, lint | Pass |
| build | Pass — 31 routes (en and ar homes, 22 case studies); home first-load JS 170 kB |
| Playwright on the production build | 18/18 pass (`docs/qa/test-results.json`) |
| Both languages at 320, 375, 430, 768, 1024, 1440, 1920 | No horizontal overflow, no clipped headings, correct lang/dir, no console errors (`docs/qa/i18n/`) |
| Arabic home has no leftover English UI strings; Alexandria/Tajawal applied; no letter-spacing | Pass |
| Language switch keeps section/project, remembers the choice, no intro replay; direct /ar entry stays Arabic | Pass |
| MASAR source link (public repo); SADEEMAN private label | Pass |
| UniFlow linked under Next.js, React, TypeScript, API design, Authentication, OAuth, Roles, File uploads, LLM integration, Vercel hosting | Pass |
| Lime cursor on fine pointers; text cursor in fields; native cursor on touch; trail canvas present | Pass (computed styles) |
| axe-core on /, /ar (1440 and 390), /projects/uniflow, /ar/projects/uniflow, /ar/projects/masar-ai | 0 violations |

**Limits:** Lighthouse not run. Lab main-thread blocking varies between 0.9 and 3.4 s on desktop under SwiftShader and is almost entirely WebGL start-up (0.2–0.4 s with WebGL disabled); not measured on real GPUs or phones. Lab LCP 1.4–1.9 s on desktop and 2.4–4.9 s at 4× CPU throttle. Headless screenshots cannot capture the cursor, so it was reviewed as rendered SVG. Sound has to be turned on again after a language switch, because a full page load cannot resume audio without a gesture.


## Production-readiness pass — 12 November 2026

### Changes
- **3D start-up cost:** shaders now compile with `compileAsync` (KHR_parallel_shader_compile) before the first frame; the studio-reflection materials are precompiled the same way; the canvas fades in once ready; synchronous shader-error checks are off in production. Phones and weak devices (low tier) skip the reflection pass and use a soft emissive tone instead. On a first visit the scene starts building only when the intro shows its Enter buttons, so it no longer competes with the intro animation. Desktop visuals are unchanged.
- **Accessibility:** the intro wordmark's label moved from an invalid `aria-label` on a paragraph to visually hidden text.
- **404:** unknown URLs and unknown projects render a branded bilingual 404 (`app/global-not-found.tsx`, Next `experimental.globalNotFound`).
- **Security headers:** X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy; X-Powered-By removed. No CSP yet.
- **Audio:** if sound was on in this tab's session, it resumes on the first click after a language switch (never on a new visit, never from the sound controls).
- **Fix:** gallery motion props were different on server and client under reduced motion (hydration mismatch).

### Measurements (local production build, Intel UHD 630 via ANGLE/D3D11)
| Check | Before | After |
|---|---|---|
| Main-thread blocking at load, desktop, warm | ~1.1 s | 0.6–0.8 s |
| Same, phone profile (low tier) | 2.3 s | ~0.5 s |
| Lighthouse desktop (en / ar) | Perf 76 / 71, A11y 95 | Perf 83 / 87, A11y 100 |
| Lighthouse mobile (en / ar) | Perf 47 / 57, A11y 95 | Perf 52–62 (run-to-run variance), A11y 100 |
| Best Practices, SEO | 100, 100 | 100, 100 |

Lighthouse 12.8.2 via npx, simulated throttling, first visit (intro shown). Mobile performance is held back by hydration and style/layout of a large client page under 4x CPU throttling (TBT ~1.1–2.1 s, LCP ~4 s); these are lab numbers, not field data. `content-visibility` on sections was tried and reverted: no measurable gain.

### Contact form
A real submission from `http://127.0.0.1:3300` is blocked by Web3Forms' CORS policy for that origin, so delivery cannot be verified locally. The error state and the mailto fallback work. Delivery must be confirmed on a deployed (preview) URL.

### Tests
Playwright: 21/21 pass on the production build (adds 404 + headers and session sound resume).


## Final pass — 12 November 2026

- **Mobile hero (phones, both languages):** the 3D core sat fixed over the lede and the "Currently building" card while scrolling. It now rests at the screen edge, half off-screen and dimmer; the card has a solid glass background; the lede and hero footer have a dark text shadow; the name overlaps the portrait less (-0.28em instead of -0.5em); the hero top padding respects the notch safe area. Reviewed at 320, 375, 390, 430 and 480 px in English and Arabic on a touch profile. Desktop unchanged.
- **Contact form:** real delivery **verified by the owner** (a message sent from the site arrived in his inbox). The earlier local failure was Web3Forms refusing the 127.0.0.1 origin (CORS), not a site bug. No further test messages were sent.
- **Links re-checked:** UniFlow, MerchantFlow and Bella Tavola demos, MASAR and Penguin repositories, Behance — HTTP 200. SADEEMAN repository returns 404 publicly (private, as intended). LinkedIn blocks automated requests (999).
- **Checks:** typecheck and lint pass; production build passes (31 routes); Playwright 21/21 pass.
- **Release:** see `docs/RELEASE.md` (preview first; nothing pushed or deployed).

### Later, optional (not blockers)
- Mobile Lighthouse performance is 52–62 in the lab (hydration and layout under 4x CPU throttling).
- No full Content-Security-Policy yet.
- Unused dependencies from the original template (`@google/genai`, `@tsparticles/*`, `react-parallax-tilt`, `firebase-tools`, …) and the package name `ai-studio-applet`.
- The ambient audio file is 4.2 MB (loaded only after the visitor turns sound on).
- No testing yet on physical iPhone/Android, Safari or Firefox beyond the owner's own phone.

### Follow-up — Arabic mobile name spacing

On phones the first Arabic line ("يوسف", the fa dot) overlapped the portrait frame by 10.5 px (measured on ink, 375/390/430 px). A mobile-only Arabic rule (`html:lang(ar) .hero-name { margin-top: 0.15em }`) now leaves 16.5 px of clearance at all three widths. English (intentional layered overlap) and desktop are unchanged; the glyph-clipping check still passes in both languages; Playwright 21/21.
