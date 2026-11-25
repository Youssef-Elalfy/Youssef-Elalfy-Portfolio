import { test, expect, type Page } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { en } from '../i18n/dictionaries/en';
import { ar } from '../i18n/dictionaries/ar';

const PRIMARY = ['NOCTURNE', 'PARALL / 01', 'SENSORA', 'EDUVERSE', 'SAYNTRA', 'MASAR AI', 'SADEEMAN AI', 'UniFlow Campus', 'MerchantFlow', 'Bella Tavola', 'Penguin Academy'];
const ALL_SLUGS = ['nocturne', 'parall-01', 'sensora', 'eduverse', 'masar-ai', 'sayntra', 'sadeeman-ai', 'merchantflow', 'uniflow', 'bella-tavola', 'penguin-academy', 'nova-learning', 'ai-labs', 'soleuxe', 'sakeena'];
const WIDTHS: [number, number][] = [[320, 640], [360, 640], [375, 812], [390, 844], [430, 932], [768, 1024], [1024, 768], [1280, 720], [1440, 900], [1920, 1080], [2560, 1440], [3440, 1440], [3840, 2160]];

/** Returning-visitor state: the intro was already seen this session. */
/** Waits until the page has hydrated and the scroll-motion module has bound its triggers. */
async function waitForMotion(page: Page) {
  await page.waitForFunction(() => Boolean(document.querySelector('[data-reveal-bound]')));
}

async function skipIntro(page: Page) {
  await page.addInitScript(() => { try { sessionStorage.setItem('elalfy_intro_seen', '1'); } catch { /* ignore */ } });
}

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  return errors;
}

test.beforeAll(async () => { await mkdir('docs/qa/i18n', { recursive: true }); });

/* ------------------------------------------------------------------ intro */

test('first visit shows the preserved intro; Escape skips it, it stays skipped, and Replay brings it back', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/');
  const intro = page.getByRole('dialog', { name: 'ELALFY' });
  await expect(intro).toBeVisible();
  await expect(intro).toContainText('Design. Develop. Experience.');
  await expect(intro).toContainText('Welcome to my digital universe.');
  await expect(page.getByRole('button', { name: /Enter experience/i })).toBeEnabled({ timeout: 10000 });
  await expect(page.getByRole('button', { name: /Enter experience/i })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(intro).toHaveCount(0, { timeout: 5000 });
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Youssef\s*Elalfy/);
  expect(await page.evaluate(() => document.getElementById('site')?.hasAttribute('inert'))).toBe(false);
  await expect(page.getByRole('button', { name: en.nav.soundOn })).toHaveAttribute('aria-pressed', 'false');

  await page.reload();
  await page.waitForTimeout(800);
  await expect(page.getByRole('dialog', { name: 'ELALFY' })).toHaveCount(0);

  await page.getByRole('button', { name: en.footer.replay }).click();
  await expect(page.getByRole('dialog', { name: 'ELALFY' })).toBeVisible();
  await page.getByRole('button', { name: /Enter without sound/i }).click({ timeout: 10000 });
  await expect(page.getByRole('dialog', { name: 'ELALFY' })).toHaveCount(0, { timeout: 5000 });
  expect(errors).toEqual([]);
});

test('Arabic intro is translated, keeps the wordmark, and starts sound only from the click', async ({ page }) => {
  await page.goto('/ar');
  const intro = page.getByRole('dialog', { name: 'ELALFY' });
  await expect(intro).toContainText('صمِّم.');
  await expect(intro).toContainText(ar.intro.welcome);
  await page.getByRole('button', { name: ar.intro.enter }).click({ timeout: 10000 });
  await expect(intro).toHaveCount(0, { timeout: 5000 });
  const toggle = page.locator('.nav-controls button').first();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
});

/* --------------------------------------------------------- both languages */

for (const [locale, path] of [['en', '/'], ['ar', '/ar']] as const) {
  test(`${locale}: layouts hold at every width without overflow, clipped headings or errors`, async ({ page }) => {
    test.setTimeout(300000);
    const errors = collectErrors(page);
    await skipIntro(page);
    const report: Record<string, unknown>[] = [];
    for (const [width, height] of WIDTHS) {
      await page.setViewportSize({ width, height });
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await page.waitForTimeout(1800);
      const metrics = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        dir: document.documentElement.dir,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        // A heading wider than its box means clipped or overflowing glyphs. The hero name's mask
        // deliberately extends past its box, so it is checked pixel by pixel in its own test.
        clipped: [...document.querySelectorAll('h1:not(.hero-name), h2, h3')].filter(node => node.scrollWidth > node.clientWidth + 2).map(node => node.textContent?.slice(0, 40)),
      }));
      expect(metrics.lang).toBe(locale);
      expect(metrics.dir).toBe(locale === 'ar' ? 'rtl' : 'ltr');
      expect(metrics.overflow, `overflow at ${width}px`).toBeLessThanOrEqual(0);
      expect(metrics.clipped, `clipped headings at ${width}px`).toEqual([]);
      await page.screenshot({ path: `docs/qa/i18n/${locale}-home-${width}.png` });
      report.push({ width, ...metrics });
    }
    await writeFile(`docs/qa/i18n/${locale}-layout.json`, JSON.stringify(report, null, 2));
    expect(errors).toEqual([]);
  });
}

test('Arabic home has no leftover English interface text and uses the Arabic typefaces', async ({ page }) => {
  await skipIntro(page);
  await page.goto('/ar');
  const text = await page.locator('#site').innerText();
  const englishUi = [en.work.title, en.work.caseStudy, en.work.filters.all, en.nav.links.expertise, en.nav.links.contact, en.expertise.where, en.expertise.offerTitle, en.about.processTitle, en.contact.form.send, en.contact.form.details, en.footer.replay, en.hero.explore, en.hero.portraitTag, en.work.moreBuilds, en.work.archive];
  for (const phrase of englishUi) expect(text, phrase).not.toContain(phrase);
  for (const phrase of [ar.work.title, ar.work.caseStudy, ar.expertise.where, ar.contact.form.send, ar.footer.replay]) expect(text).toContain(phrase);
  expect(await page.locator('h1').evaluate(node => getComputedStyle(node).fontFamily)).toContain('Alexandria');
  expect(await page.locator('.hero-lede').evaluate(node => getComputedStyle(node).fontFamily)).toContain('Tajawal');
  expect(await page.locator('h1').evaluate(node => getComputedStyle(node).letterSpacing)).toMatch(/^(normal|0px)$/);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://elalfy-portfolio.vercel.app');
  await expect(page.locator('link[rel="alternate"][hreflang="ar"]')).toHaveAttribute('href', 'https://elalfy-portfolio.vercel.app/ar');
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', 'https://elalfy-portfolio.vercel.app');
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'ar_EG');
});

test('language switch keeps the section and project, remembers the choice, and never replays the intro', async ({ page }) => {
  await skipIntro(page);
  await page.goto('/#work');
  await page.waitForTimeout(800);
  await page.locator('.site-nav .lang-switch a[hreflang="ar"]').click();
  await page.waitForURL(/\/ar#work$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('dialog', { name: 'ELALFY' })).toHaveCount(0);

  // A remembered Arabic choice sends English entry points to the Arabic page.
  await page.goto('/projects/uniflow');
  await page.waitForURL(/\/ar\/projects\/uniflow$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('UniFlow Campus');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /دراسة حالة/);

  // Switching back from a case study stays on the same project.
  await page.locator('.lang-switch a[hreflang="en"]').click();
  await page.waitForURL(/\/projects\/uniflow$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.goto('/');
  await expect(page).toHaveURL(/127\.0\.0\.1:\d+\/$/);
});

test('direct entry to an Arabic URL always opens in Arabic', async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem('elalfy_locale', 'en'); sessionStorage.setItem('elalfy_intro_seen', '1'); });
  await page.goto('/ar/projects/masar-ai');
  await expect(page).toHaveURL(/\/ar\/projects\/masar-ai$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
});

/* ----------------------------------------------------------------- content */

test('work gallery lists the primary projects in order, never the portfolio itself, and filters work', async ({ page }) => {
  await skipIntro(page);
  await page.goto('/#work');
  const work = page.locator('#work');
  for (const title of PRIMARY) await expect(work.getByRole('heading', { name: title, exact: true }).or(work.locator('.row-title', { hasText: title })).first()).toBeVisible();
  await expect(work.locator('.exhibit h3')).toHaveText(['NOCTURNE', 'PARALL / 01', 'SENSORA', 'EDUVERSE', 'SAYNTRA', 'MASAR AI', 'SADEEMAN AI', 'UniFlow Campus', 'MerchantFlow']);
  await expect(work).not.toContainText(/ELALFY Portfolio|Personal Portfolio/i);
  await expect(work).toContainText('Educational project');
  await expect(work).toContainText('Live application');
  await expect(work.locator('.exhibit', { hasText: 'MASAR AI' }).getByRole('link', { name: /View source code/ })).toHaveAttribute('href', /masar-ai-agent/);

  // NOCTURNE: client badge, case study and live website, without the old delivery wording.
  const nocturne = work.locator('.exhibit', { hasText: 'NOCTURNE' });
  await expect(nocturne.locator('.client-badge')).toHaveText('Client work');
  await expect(nocturne.getByRole('link', { name: /Open live website/ })).toHaveAttribute('href', 'https://nocturne.youssef-elalfly.workers.dev/');
  await expect(nocturne).not.toContainText(/paid client build|client edits|deployment package|client handover|self-hosted package/i);
  await expect(nocturne.getByRole('link', { name: 'Read the case study' })).toHaveAttribute('href', '/projects/nocturne');

  await work.getByRole('button', { name: /Client work/ }).click();
  await expect(work.locator('.exhibit h3')).toHaveText(['NOCTURNE']);
  await expect(work.locator('.index-row')).toHaveCount(0);

  await work.getByRole('button', { name: /3D experiences/ }).click();
  await expect(work.locator('.exhibit h3')).toHaveText(['PARALL / 01', 'SENSORA', 'EDUVERSE', 'SAYNTRA']);

  await work.getByRole('button', { name: /Full-stack & AI/ }).click();
  await expect(work.locator('.exhibit h3')).toHaveText(['NOCTURNE', 'SAYNTRA', 'MASAR AI', 'SADEEMAN AI', 'UniFlow Campus', 'MerchantFlow']);
  await expect(work.locator('.row-title')).toHaveCount(1);
  await expect(work.locator('.row-live').first()).toHaveAttribute('target', '_blank');
  await expect(work.locator('.row-live').first()).toHaveAttribute('rel', 'noopener noreferrer');

  await work.getByRole('button', { name: /All projects/ }).click();
  await expect(work.locator('.exhibit')).toHaveCount(9);
  await expect(work.locator('.index-row')).toHaveCount(2);
});

test('verified live demos and public sources link to the right places', async ({ page }) => {
  await skipIntro(page);
  const expectLink = async (name: RegExp, href: string | RegExp) => {
    const link = page.getByRole('link', { name }).first();
    await expect(link).toHaveAttribute('href', href);
    await expect(link).toHaveAttribute('target', '_blank');
  };
  await page.goto('/projects/masar-ai');
  await expectLink(/View source code/, 'https://github.com/Youssef-Elalfy/masar-ai-agent');
  await expectLink(/Open live demo/, 'https://masar-ai-agent-production.up.railway.app/');
  await page.goto('/projects/sadeeman-ai');
  await expectLink(/Open live demo/, 'https://sadeeman-ai-production.up.railway.app/');
  await expectLink(/View source code/, 'https://github.com/Youssef-Elalfy/sadeeman-ai');
  await expect(page.getByText(/still in active development/)).toBeVisible();
  await page.goto('/projects/sayntra');
  await expectLink(/Open live demo/, 'https://sayntra.vercel.app/demo');
  await expect(page.getByText(/not hosted publicly/)).toBeVisible();
  await page.goto('/projects/parall-01');
  await expectLink(/Open live demo/, 'https://parall-01.vercel.app/');
  await page.goto('/projects/sensora');
  await expectLink(/Open live demo/, 'https://sensora-cyan.vercel.app/en');
  await page.goto('/projects/eduverse');
  await expectLink(/Open live demo/, 'https://eduverse-delta-six.vercel.app/');
  await page.goto('/ar/projects/eduverse');
  await expect(page.getByRole('link', { name: /افتح النسخة الحيّة/ }).first()).toHaveAttribute('href', 'https://eduverse-delta-six.vercel.app/');
  await page.goto('/projects/nocturne');
  await expectLink(/Open live website/, 'https://nocturne.youssef-elalfly.workers.dev/');
  await expect(page.locator('main')).not.toContainText(/paid client build|client edits|deployment package|client handover|self-hosted package/i);
  await page.goto('/ar/projects/nocturne');
  await expect(page.getByRole('link', { name: /افتح الموقع الحيّ/ })).toHaveAttribute('href', 'https://nocturne.youssef-elalfly.workers.dev/');
  await page.goto('/projects/nocturne');
  await expect(page.getByText(/the agency’s conceptual sample content, not clients/)).toBeVisible();
  await page.goto('/');
  await expect(page.locator('#work .exhibit', { hasText: 'SAYNTRA' }).getByRole('link', { name: /View website/ })).toHaveAttribute('href', 'https://sayntra.vercel.app/');
  await page.goto('/ar/projects/masar-ai');
  await expect(page.getByRole('link', { name: new RegExp(ar.caseStudy.source) })).toHaveAttribute('href', /masar-ai-agent/);
});

test('scroll reveals are reversible: complete while reading, reverse through the entry region, survive anchors and reloads', async ({ page, browser }) => {
  await skipIntro(page);
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'ready');
  await waitForMotion(page);
  // Puts the heading's top edge at a share of the viewport and returns its first word's opacity.
  const place = async (selector: string, share: number) => {
    await page.evaluate(({ selector, share }) => {
      const el = document.querySelector(selector)!;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - window.innerHeight * share, behavior: 'instant' });
    }, { selector, share });
    await page.waitForTimeout(900);
    return Number(await page.locator(`${selector} .rw-i`).first().evaluate(node => getComputedStyle(node).opacity));
  };
  expect(await place('#about-title', 1.05)).toBeLessThan(0.05);            // before its window: hidden
  const midway = await place('#about-title', 0.84);                        // inside the entry region: part-way
  expect(midway).toBeGreaterThan(0.05); expect(midway).toBeLessThan(0.98);
  expect(await place('#about-title', 0.4)).toBe(1);                         // reading position: complete
  await expect(page.locator('#about-title')).toHaveClass(/is-settled/);
  expect(await place('#about-title', -1)).toBe(1);                          // scrolled past: stays complete
  const back = await place('#about-title', 0.84);                           // back up through the entry: reverses
  expect(back).toBeLessThan(0.98);
  expect(await place('#about-title', 1.05)).toBeLessThan(0.05);
  expect(await place('#about-title', 0.4)).toBe(1);                         // down again: complete again

  // An anchor jump straight to Contact completes the headings it lands on.
  await page.evaluate(() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'instant' }));
  await page.waitForTimeout(1200);
  await expect(page.locator('#contact-title')).toHaveClass(/is-settled/);

  // Reload mid-page: the heading in view is complete.
  await place('#about-title', 0.4);
  await page.reload();
  await waitForMotion(page);
  await expect(page.locator('#about-title')).toHaveClass(/is-settled/, { timeout: 8000 });

  // Words are split on spaces only, so Arabic letters stay joined inside one span.
  await page.goto('/ar');
  const arabicWords = await page.locator('#work-title .rw-i').allTextContents();
  expect(arabicWords.join(' ')).toBe(ar.work.title);
  // Latin titles keep their word order inside the Arabic layout.
  const order = await page.locator('#work .exhibit h3', { hasText: 'MASAR' }).locator('.rw').evaluateAll(nodes => nodes.map(node => [node.textContent, node.getBoundingClientRect().left]));
  expect(order[0][0]).toBe('MASAR');
  expect(Number(order[0][1])).toBeLessThan(Number(order[1][1]));

  const reduced = await browser.newContext({ reducedMotion: 'reduce', baseURL: 'http://127.0.0.1:3300' });
  const calm = await reduced.newPage();
  await calm.addInitScript(() => sessionStorage.setItem('elalfy_intro_seen', '1'));
  await calm.goto('/');
  await expect(calm.locator('html')).not.toHaveAttribute('data-motion', 'ready');
  await expect(calm.locator('#contact-title .rw-i').first()).toHaveCSS('opacity', '1');
  await reduced.close();
});

test('case study films load only near the viewport, autoplay muted inline, pause outside it and resume', async ({ page }) => {
  await skipIntro(page);
  const films: string[] = [];
  page.on('request', request => { if (request.url().endsWith('film.mp4')) films.push(request.url()); });
  await page.goto('/projects/eduverse');
  await waitForMotion(page);
  const video = page.locator('figure video');
  await expect(video).toHaveAttribute('poster', '/projects/eduverse/film-poster.webp');
  expect(await video.evaluate((v: HTMLVideoElement) => [v.muted, v.loop, v.playsInline, v.controls, v.preload])).toEqual([true, true, true, false, 'none']);
  expect(films).toEqual([]);                                               // nothing downloaded at the top of the page
  await video.evaluate(v => v.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0.3), { timeout: 15000 }).toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await video.evaluate(v => v.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
  // Every film file and poster exists and is served with the right type.
  for (const slug of ['nocturne', 'parall-01', 'sensora', 'eduverse', 'sayntra', 'masar-ai', 'sadeeman-ai', 'merchantflow', 'bella-tavola']) {
    const film = await page.request.head(`/projects/${slug}/film.mp4`);
    expect(film.status(), slug).toBe(200);
    expect(film.headers()['content-type'], slug).toContain('video/mp4');
    expect((await page.request.head(`/projects/${slug}/film-poster.webp`)).status(), slug).toBe(200);
  }
});

test('UniFlow appears under its verified full-stack skills, and Vercel is listed as hosting', async ({ page }) => {
  await skipIntro(page);
  await page.goto('/#expertise');
  const panel = page.locator('#skill-evidence');
  for (const skill of ['Next.js', 'React', 'TypeScript', 'API design', 'Authentication', 'OAuth & account security', 'Roles & permissions', 'File uploads & storage', 'LLM integration', 'Vercel hosting']) {
    await page.locator('.chips button', { hasText: skill }).first().click();
    await expect(panel.getByRole('link', { name: /UniFlow Campus/ }), skill).toBeVisible();
  }
  await page.locator('.chips button', { hasText: 'Fastify' }).click();
  await expect(panel.getByRole('link')).toHaveCount(1);
  await expect(panel.getByRole('link')).toContainText('SADEEMAN AI');
  await page.goto('/projects/uniflow');
  await expect(page.getByText('Live application').first()).toBeVisible();
  await expect(page.getByText(/Role-based access: student, instructor and administrator/)).toBeVisible();
  await expect(page.getByText(/Attendance per course/)).toBeVisible();
});

test('contact form validates and reports outcomes in both languages without sending mail', async ({ page }) => {
  await skipIntro(page);
  for (const [path, t] of [['/#contact', en.contact.form], ['/ar#contact', ar.contact.form]] as const) {
    await page.goto(path);
    const form = page.getByRole('form', { name: t.label });
    await form.getByRole('button', { name: t.send }).click();
    expect(await form.locator('input[name="email"]').evaluate((element: HTMLInputElement) => element.validity.valueMissing)).toBe(true);
    for (const response of [{ status: 422, body: { success: false } }, { status: 200, body: { success: true } }]) {
      await page.route('https://api.web3forms.com/submit', route => route.fulfill({ status: response.status, contentType: 'application/json', body: JSON.stringify(response.body) }));
      await form.getByLabel(t.name).fill('Portfolio QA');
      await form.getByLabel(t.email).fill('qa@example.com');
      await form.getByLabel(t.details).fill('Automated local browser verification.');
      await form.getByRole('button', { name: t.send }).click();
      await expect(form.getByRole('status')).toContainText(response.body.success ? t.success : t.error);
      await page.unroute('https://api.web3forms.com/submit');
    }
  }
});

/* ------------------------------------------------------- pointer and motion */

test('lime cursor applies to fine pointers only, text fields keep a text cursor, and the trail remains', async ({ page, browser }) => {
  await skipIntro(page);
  await page.goto('/');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).cursor)).toContain('url(');
  const hoverCursor = await page.locator('.btn-lime').first().evaluate(node => getComputedStyle(node).cursor);
  expect(hoverCursor).toContain('url(');
  // The hover cursor is the same arrow with a brighter glow: no detached circle, same hotspot.
  expect(decodeURIComponent(hoverCursor)).not.toContain('<circle');
  expect(hoverCursor).toMatch(/\)\s+5\s+4,/);
  await page.goto('/#contact');
  expect(await page.locator('textarea').evaluate(node => getComputedStyle(node).cursor)).toBe('text');
  await expect(page.locator('canvas.signal-trail')).toHaveCount(1);

  const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const phone = await touch.newPage();
  await phone.goto('/');
  expect(await phone.evaluate(() => getComputedStyle(document.documentElement).cursor)).toBe('auto');
  await touch.close();
});

test('glass navigation marks the current section and the mobile dock reaches every section', async ({ page }) => {
  await skipIntro(page);
  await page.goto('/');
  await waitForMotion(page);
  const main = page.getByRole('navigation', { name: en.nav.main, exact: true });
  await main.getByRole('link', { name: 'Expertise' }).click();
  await expect(main.getByRole('link', { name: 'Expertise' })).toHaveAttribute('aria-current', 'location');
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [path, nav] of [['/', en.nav], ['/ar', ar.nav]] as const) {
    await page.goto(path);
    await waitForMotion(page);
    const dock = page.getByRole('navigation', { name: nav.compact });
    await expect(dock).toBeVisible();
    for (const id of ['work', 'about', 'contact'] as const) {
      await dock.getByRole('link', { name: nav.links[id] }).click();
      await expect(dock.getByRole('link', { name: nav.links[id] })).toHaveAttribute('aria-current', 'location');
    }
    await expect(page.locator('.site-nav .lang-switch')).toBeVisible();
  }
});

test('without WebGL the site stays complete and shows the static sculpture', async ({ page }) => {
  const errors = collectErrors(page);
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type.includes('webgl')) return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await skipIntro(page);
  await page.goto('/ar');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.fallback-core')).toBeVisible();
  await expect(page.locator('.scene-layer canvas')).toHaveCount(0);
  await expect(page.getByRole('link', { name: ar.hero.explore })).toBeVisible();
  expect(errors).toEqual([]);
});

test('hero name is never clipped: the full Arabic and English glyphs render inside the reveal mask', async ({ page }) => {
  test.setTimeout(120000);
  await page.addInitScript(() => {
    sessionStorage.setItem('elalfy_intro_seen', '1');
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type.includes('webgl')) return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const path of ['/ar', '/']) {
    for (const [width, height] of [[1920, 1080], [1440, 900], [1366, 768], [390, 844], [320, 640]] as const) {
      await page.setViewportSize({ width, height });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      await page.addStyleTag({ content: '.fallback-core,.portrait,.signal-trail,.site-nav,.hero-roles,.hero-copy,body::after{visibility:hidden!important}' });
      await page.waitForTimeout(400);
      const box = await page.locator('h1').boundingBox();
      if (!box) throw new Error('hero heading has no box');
      const clip = { x: 0, y: Math.max(0, box.y - 60), width, height: Math.min(box.height + 160, height - Math.max(0, box.y - 60)) };
      const masked = await page.screenshot({ clip });
      await page.addStyleTag({ content: '.hero-name,.hero-name *{overflow:visible!important}' });
      await page.waitForTimeout(200);
      const unmasked = await page.screenshot({ clip });
      // Removing the mask must not reveal any extra ink.
      expect(await differingPixels(masked, unmasked), `${path} at ${width}px`).toBe(0);
    }
  }
});

async function differingPixels(a: Buffer, b: Buffer) {
  const sharp = (await import('sharp')).default;
  const first = await sharp(a).raw().toBuffer({ resolveWithObject: true });
  const second = await sharp(b).raw().toBuffer();
  let count = 0;
  for (let index = 0; index < first.data.length; index += first.info.channels) {
    let delta = 0;
    for (let channel = 0; channel < 3; channel += 1) delta = Math.max(delta, Math.abs(first.data[index + channel] - second[index + channel]));
    if (delta > 8) count += 1;
  }
  return count;
}

test('reduced motion keeps the intro usable and renders the scene without a running loop', async ({ page }) => {
  const errors = collectErrors(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/ar');
  await page.getByRole('button', { name: ar.intro.quiet }).click({ timeout: 10000 });
  await expect(page.getByRole('dialog', { name: 'ELALFY' })).toHaveCount(0, { timeout: 3000 });
  const canvas = page.locator('.scene-layer canvas');
  await canvas.waitFor({ timeout: 15000 });
  await page.waitForTimeout(1500);
  const first = await canvas.screenshot();
  await page.waitForTimeout(1500);
  expect(first.equals(await canvas.screenshot())).toBe(true);
  expect(errors, 'no hydration or runtime errors with reduced motion').toEqual([]);
});

test('pause control stops background motion', async ({ page }) => {
  await skipIntro(page);
  await page.goto('/');
  const canvas = page.locator('.scene-layer canvas');
  await canvas.waitFor({ timeout: 15000 });
  await page.waitForTimeout(2500);
  const moving = await canvas.screenshot();
  await page.waitForTimeout(1200);
  expect(moving.equals(await canvas.screenshot())).toBe(false);
  await page.getByRole('button', { name: en.nav.motionPause }).click();
  await page.waitForTimeout(800);
  const paused = await canvas.screenshot();
  await page.waitForTimeout(1200);
  expect(paused.equals(await canvas.screenshot())).toBe(true);
});

test('keyboard users reach the skip link first, then the navigation, in both languages', async ({ page }) => {
  await skipIntro(page);
  for (const [path, t] of [['/', en], ['/ar', ar]] as const) {
    await page.goto(path);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: t.skipToContent })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: t.nav.brand })).toBeFocused();
  }
});

test('every case study loads in both languages, with a keyboard-operable gallery', async ({ page }) => {
  test.setTimeout(180000);
  const errors = collectErrors(page);
  await skipIntro(page);
  for (const slug of ALL_SLUGS) {
    for (const prefix of ['', '/ar']) {
      const response = await page.goto(`${prefix}/projects/${slug}`);
      expect(response?.status(), `${prefix}/${slug}`).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(await page.locator('meta[property="og:title"]').getAttribute('content')).toMatch(prefix ? /دراسة حالة/ : /case study/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    }
  }
  await page.goto('/ar/projects/uniflow');
  await page.screenshot({ path: 'docs/qa/i18n/ar-case-uniflow.png' });
  await page.goto('/projects/uniflow');
  await page.screenshot({ path: 'docs/qa/i18n/en-case-uniflow.png' });
  const open = page.getByRole('button', { name: /^Enlarge/ }).first();
  await open.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('dialog')).toContainText('2 of');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(open).toBeFocused();
  await page.goto('/projects/penguin-academy');
  await expect(page.getByText('No screenshot is shown for this project.')).toBeVisible();
  await expect(page.getByRole('link', { name: /View source code/ })).toHaveAttribute('href', /penguin-academy-lms/);
  const missing = await page.goto('/projects/does-not-exist');
  expect(missing?.status()).toBe(404);
  expect(errors.filter(message => !message.includes('404'))).toEqual([]);
});

test('unknown URLs return a branded bilingual 404, and security headers are sent', async ({ page }) => {
  for (const path of ['/does-not-exist', '/ar/does-not-exist', '/projects/does-not-exist', '/ar/projects/does-not-exist']) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page doesn’t exist.');
    await expect(page.getByText('هذه الصفحة غير موجودة.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to the homepage' })).toHaveAttribute('href', '/');
    await expect(page.getByRole('link', { name: 'العودة إلى الرئيسية' })).toHaveAttribute('href', '/ar');
  }
  const home = await page.goto('/');
  const headers = home?.headers() ?? {};
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(headers['x-powered-by']).toBeUndefined();
});

test('sound turned on in this session comes back on the first click after a language switch', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Enter experience/i }).click({ timeout: 10000 });
  const toggle = page.locator('.nav-controls button').first();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.site-nav .lang-switch a[hreflang="ar"]').click();
  await page.waitForURL(/\/ar/);
  await expect(page.locator('.nav-controls button').first()).toHaveAttribute('aria-pressed', 'false');
  await page.locator('.hero-lede').click();
  await expect(page.locator('.nav-controls button').first()).toHaveAttribute('aria-pressed', 'true');
});
