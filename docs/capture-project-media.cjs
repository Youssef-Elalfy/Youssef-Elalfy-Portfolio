const { chromium } = require('D:/My Works/Projects_Websites/sayntra/frontend/node_modules/playwright');
const fs = require('node:fs/promises');
const path = require('node:path');

// Uses the already installed local browser. Captures public pages only.
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/youss/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe' });
  const results = [];
  for (const [slug, url] of [
    ['merchantflow', 'https://merchantflow-mu.vercel.app/'],
    ['uniflow', 'https://uniflow-campus.vercel.app/'],
    ['bella-tavola', 'https://italic-resturant.vercel.app/'],
  ]) {
    const dir = path.join(process.cwd(), 'public/projects', slug);
    await fs.mkdir(dir, { recursive: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1200);
      const title = await page.title();
      if (!response?.ok() || /not found|deployment.*found|authentication required/i.test(title)) throw new Error(`Unexpected page: ${response?.status()} ${title}`);
      await page.screenshot({ path: path.join(dir, 'desktop-capture.png') });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(dir, 'mobile-capture.png') });
      results.push({ slug, url, status: response.status(), title, captured: true });
    } catch (error) {
      results.push({ slug, url, captured: false, reason: error.message });
    }
    await page.close();
  }
  await browser.close();
  await fs.writeFile('docs/project-capture-results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
})();
