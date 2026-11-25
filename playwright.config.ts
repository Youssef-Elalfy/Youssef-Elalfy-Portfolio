import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', workers: 1, fullyParallel: false, timeout: 60000,
  expect: { timeout: 15000 },
  reporter: [['list'], ['json', { outputFile: 'docs/qa/test-results.json' }]],
  use: { baseURL: 'http://127.0.0.1:3300', browserName: 'chromium', channel: 'chrome', headless: true, launchOptions: { args: ['--enable-unsafe-swiftshader'] }, viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, screenshot: 'only-on-failure' },
});
