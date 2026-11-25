// Lab measurements for the redesign: LCP, CLS, long tasks and an axe-core scan.
// Usage: node docs/qa/measure-redesign.cjs http://127.0.0.1:3300
const { chromium } = require('playwright');
const { readFileSync, writeFileSync } = require('node:fs');
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const base = process.argv[2] || 'http://127.0.0.1:3300';

async function vitals(browser, { width, height, cpu, label, path = '/' }) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.addInitScript(() => {
    sessionStorage.setItem('elalfy_intro_seen', '1');
    window.__lab = { lcp: 0, cls: 0, longTasks: 0, longTaskMs: 0 };
    new PerformanceObserver(list => { for (const entry of list.getEntries()) window.__lab.lcp = entry.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__lab.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver(list => { for (const entry of list.getEntries()) { window.__lab.longTasks += 1; window.__lab.longTaskMs += entry.duration - 50; } }).observe({ type: 'longtask', buffered: true });
  });
  const cdp = await page.context().newCDPSession(page);
  if (cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
  await page.goto(base + path, { waitUntil: 'load' });
  await page.waitForTimeout(5000);
  const lab = await page.evaluate(() => window.__lab);
  const lcpElement = await page.evaluate(() => new Promise(resolve => new PerformanceObserver(list => { const entries = list.getEntries(); const last = entries[entries.length - 1]; resolve(last?.element ? `${last.element.tagName.toLowerCase()}.${last.element.className}`.slice(0, 80) : 'n/a'); }).observe({ type: 'largest-contentful-paint', buffered: true })));
  await page.close();
  return { label, path, width, height, cpuThrottle: cpu, lcpMs: Math.round(lab.lcp), lcpElement, cls: Number(lab.cls.toFixed(4)), longTasks: lab.longTasks, blockingMsOver50: Math.round(lab.longTaskMs) };
}

async function axe(browser, path, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.addInitScript(() => sessionStorage.setItem('elalfy_intro_seen', '1'));
  await page.goto(base + path, { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  await page.addScriptTag({ content: axeSource });
  const result = await page.evaluate(async () => {
    const run = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } });
    return run.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, sample: v.nodes[0]?.target?.join(' ') }));
  });
  await page.close();
  return { path, width, violations: result };
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', args: ['--enable-unsafe-swiftshader'] });
  const report = {
    note: 'Lab data from headless Chrome on one Windows machine (SwiftShader WebGL). Not field data and not a Lighthouse score.',
    vitals: [
      await vitals(browser, { width: 1440, height: 900, cpu: 1, label: 'desktop' }),
      await vitals(browser, { width: 390, height: 844, cpu: 4, label: 'mobile, 4x CPU throttle' }),
      await vitals(browser, { width: 1440, height: 900, cpu: 1, label: 'desktop, Arabic', path: '/ar' }),
      await vitals(browser, { width: 390, height: 844, cpu: 4, label: 'mobile Arabic, 4x CPU throttle', path: '/ar' }),
    ],
    axe: [await axe(browser, '/', 1440), await axe(browser, '/', 390), await axe(browser, '/ar', 1440), await axe(browser, '/ar', 390), await axe(browser, '/projects/uniflow', 1440), await axe(browser, '/ar/projects/uniflow', 1440), await axe(browser, '/ar/projects/masar-ai', 390)],
  };
  writeFileSync('docs/qa/i18n/lab-measurements.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
