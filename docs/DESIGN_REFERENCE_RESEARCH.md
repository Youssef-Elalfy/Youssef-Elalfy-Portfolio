# ELALFY — International Reference Research

## Design benchmark principles, not a cloning license

These are verifiable public references researched November 2026. They demonstrate patterns, not a guarantee of awards or that every page is identical today. Claude must open current versions during execution and cite all research when producing `DESIGN_DECISIONS.md` in the repository. Screenshots/media/logo/copy from reference sites are NOT bundled.

| Reference | Verifiable URL | What to learn | ELALFY-original application | Pitfall to avoid |
| --- | --- | --- | --- | --- |
| Bruno Simon | https://www.bruno-simon.com/ | Interactive 3D portfolio that makes engineering the experience; explicit quality/audio controls and alternate inputs | A recognizable 3D signature motif, opt-in exploration, quality/fallback controls | Do not copy car driving gameplay or bury project links in a 3D game |
| Lusion | https://lusion.co/ | Immersive 3D brand storytelling, high-quality materials and striking transitions | Cinematic physically plausible glass, coherent lighting, premium scene composition | Do not clone brand worlds, objects or create huge unoptimized scenes |
| Merouane Bali | https://www.cssdesignawards.com/sites/merouane-bali-portfolio/46855/ | Award-recognized responsive WebGL one-page portfolio, strong futuristic organization | Translate backend/AI/frontend categories into coherent wayfinding within one visual world | Don't copy the neon grid/map verbatim or make a UI inaccessible |
| Toshihito Endo | https://www.awwwards.com/sites/toshihito-endos-portfolio | Immersive/game-like 3D portfolio and visitor affordances | Use sophisticated camera motion and readable interaction cues | Avoid making keyboard game controls mandatory |
| Awwwards portfolio gallery | https://www.awwwards.com/websites/portfolio/ | Current editorial composition and creative portfolio trends | Premium typography, brave whitespace, varied asymmetry, strong project art direction | Awards gallery is not proof of conversion or accessibility |
| Owner inspiration videos | bundled `assets/` | Art-directed websites, organic interactive brush motion and glass navigation | Brand-specific coherent style, original emerald/lime motion, glass nav | Do not copy third-party footage or images into the final site |

## Evidence and supporting references

- Bruno Simon's current public page describes a portfolio navigable via keyboard, mouse, tablet and gamepad, with audio/quality controls and Three.js mentioned in the behind-the-scenes section: https://www.bruno-simon.com/
- Lusion's site explicitly emphasizes 3D visual storytelling, motion and interactive work: https://lusion.co/
- CSS Design Awards records Merouane Bali portfolio as `Website Of The Day 2025 Jan 16`, responsive WebGL one-page experience: https://www.cssdesignawards.com/sites/merouane-bali-portfolio/46855/
- Google Search Central Core Web Vitals recommended good thresholds: LCP <=2.5s, INP <=200ms, CLS <=0.1: https://developers.google.com/search/docs/appearance/core-web-vitals
- GSAP official ScrollTrigger documentation covers animation timelines and responsive matchMedia: https://gsap.com/docs/v3/Plugins/ScrollTrigger/

## Strong and relevant Claude toolchain references

**Verify availability / existing install before using any install command:**
- Anthropic Frontend Design plugin (verified): https://claude.com/plugins/frontend-design
- Anthropic Claude Code Setup plugin (verified, advises tool recommendations): https://claude.com/plugins/claude-code-setup
- Impeccable (creator repo / installation): https://github.com/pbakaus/impeccable ; https://impeccable.style/
- Microsoft Playwright MCP: https://github.com/microsoft/playwright-mcp
- Upstash Context7: https://github.com/upstash/context7
- Official Claude plugin guidance: https://support.claude.com/en/articles/13837440-use-plugins-in-claude

Possible first installs if missing (verify version and trusted publisher):
- In Claude Code: discover **Frontend Design** and **Claude Code Setup** from Anthropic's official plugin directory.
- For Impeccable: `npx impeccable install` in the project or `/plugin marketplace add pbakaus/impeccable` followed by install via `/plugin`.
- For Playwright MCP: `claude mcp add playwright npx @playwright/mcp@latest` if not already connected.
- Context7: follow verified instructions at https://github.com/upstash/context7 and connect only if version-specific docs need it.

Do not assume these tools are installed already, or that a third-party extension is safe merely because it appears in search results. Do not add redundant tools for hype. Each tool should have a real measurable job in this project.

## Five art-direction takeaways for Claude

1. The first 5 seconds must be memorable **and** explain who the developer is.
2. The hero sculpture and the selected-work scene should belong to one art-directed universe.
3. High-end motion is a choreography of information, not endless movement.
4. Real engineering case studies convert better than decorative mockups or invented business numbers.
5. Quality is measured by real interaction/browser proof; impressive WebGL is worthless if it fails on mobile.
