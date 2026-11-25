# Final local verification — 6 November 2026

The implemented production build is running at http://127.0.0.1:3300. No push or deployment was performed. The original source archive remains in `backups/portfolio-before-3d-2026-11-06.zip` (ignored, private).

## Automated checks

- `npm run lint`: passed with no errors.
- `npm run typecheck`: passed.
- `NODE_OPTIONS=--use-system-ca npm run build`: passed; 17 prerendered routes, including nine independent project case studies, icon, Open Graph image, robots and sitemap. Homepage initial JS: 124 KB, excluding the lazy 3D renderer.
- `npm test`: six tests passed in 49.6 seconds on the final unchanged production build.

The browser suite covers all requested widths (320, 390, 768, 1280, 1920), horizontal overflow, real fonts, active project and service controls, mobile navigation/Escape, native form validation, HTTP422/application-error/success responses, autonomous rendering without pointer movement, motion pause, reduced motion, WebGL failure/retry, all nine direct case-study routes and refresh, image-dialog keyboard controls/focus restoration, and unknown-project 404 behavior. Contact submissions were intercepted; no real message was sent. Real email delivery/account ownership was not externally tested.

## Visual review and defects resolved

All five homepage screenshots were inspected. Additional screenshots cover the actual 3D project exhibition, service installation, about, contact, mobile below-copy studio and Nova case study. The independent frontend QA reviewer rechecked tablet work/services and desktop services, finding no remaining P1/P2 visual issues in those states.

Resolved defects: original missing profile path and Open Graph image; forced hidden native cursor; splash gate and automatic audio resumption; false form success; fonts overridden by Arial; mobile monitor behind headline; tablet text over bright geometry; unclickable WebGL recovery; empty project image source. Original AI Labs, Soleuxe and Sakeena routes remain available as clearly labeled design studies.

One exact-pixel pause assertion failed during concurrent browser work. Four isolated instrumented probes subsequently observed no further WebGL draw calls while paused and byte-identical images; the full isolated final suite passed without source/test changes to mask the failure. See `studio-pause-probes.json`. Concurrency as the cause was not conclusively proven.

## Measured performance

The authoritative isolated sample is `performance.json` (also retained as `performance-before-shadow-cache.json`; no shadow-cache change was made). At 1280×900, DPR1, actual ANGLE Intel UHD Graphics630 / D3D11: 239 requestAnimationFrame callbacks over4.0121 seconds (59.57/s), no intervals over50ms, 35 draw calls and41,106 triangles. Canvas sampling reported60FPS. These are observations from one local browser and a short steady-state sample, not a universal frame-rate guarantee. Earlier concurrent runs were materially slower and are not used as an isolated hardware benchmark. `renderer-measurements.json` records raw viewport samples including initial loading/readback conditions.

The mobile renderer disables shadows and caps DPR1.15; desktop caps DPR1.5 and lowers it on sustained low measured delivery. One canvas, instanced keyboard geometry, local reflections, no postprocessing, visibility pause, demand mode for reduced motion and explicit pause, resource cleanup and 18 optimized WebP screenshots (~814KB total, excluding thumbnails/raw provenance captures) limit work and transfer.

## Scope and genuine limits

Six curated application/web projects and three archived design studies are included. Fresh captures cover MerchantFlow, UniFlow and Bella Tavola public demos plus Nova’s actual local landing/demo dashboard/mobile interface. SAYNTRA uses authentic existing application-story captures, explicitly identified as illustrative sample data. Penguin has source evidence but no authentic screenshot and displays an honest fallback.

MASAR AI, CASE404 and SARAB were not added because matching source/media was unavailable in inspected roots and repository listing failed. SAYNTRA remains a local development checkpoint; Nova remains a prototype; no production/customer/business results were invented. Source/media evidence is in `../project-evidence.md`.

The scene is original procedural product modeling with PBR materials and studio reflections. It is not a scanned interior or full cinematic photorealism. Viewport tests are browser emulation, not testing on physical iOS/Android devices. The Facebook reference could not be inspected. Superdesign CLI preflight ran, but no authenticated canvas session was available; design was implemented locally from the supplied brief and installed design/3D skill guidance.
