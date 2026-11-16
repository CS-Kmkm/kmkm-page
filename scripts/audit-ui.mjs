// Reproducible local lab audit; does not claim field Core Web Vitals or real-device coverage.
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const phase = process.argv[2] || 'after';
if (!/^[a-z0-9-]+$/i.test(phase)) throw new Error('Use a simple phase name');
const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
const output = path.resolve('.ai/test-results/ui-quality', phase);
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  for (const locale of ['ja', 'en']) {
    for (const route of ['', '/career', '/publications', '/dev-experience']) {
      for (const theme of ['light', 'dark']) {
        for (const width of [375, 1440]) {
          const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: theme, reducedMotion: 'reduce' });
          const page = await context.newPage();
          await page.addInitScript(() => {
            window.__lab = { lcp: 0, cls: 0, longTasks: 0 };
            new PerformanceObserver(list => { for (const e of list.getEntries()) window.__lab.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
            new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__lab.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
            new PerformanceObserver(list => { for (const e of list.getEntries()) window.__lab.longTasks += e.duration; }).observe({ type: 'longtask', buffered: true });
          });
          const url = `${baseURL}/${locale}${route}`;
          const response = await page.goto(url, { waitUntil: 'networkidle' });
          await page.waitForFunction(dark => document.documentElement.classList.contains('dark') === dark, theme === 'dark');
          await page.evaluate(() => document.fonts.ready);
          await page.evaluate(async () => Promise.allSettled(document.getAnimations().filter(a => a.effect?.getTiming().iterations !== Infinity).map(a => a.finished)));
          const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
          const geometry = await page.evaluate(() => ({
            viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth,
            dark: document.documentElement.classList.contains('dark'),
            lab: window.__lab,
            clippedSvgText: [...document.querySelectorAll('main svg text')].filter(el => {
              const text = el.getBoundingClientRect(); const svg = el.ownerSVGElement.getBoundingClientRect();
              return text.right > svg.right + 1 || text.left < svg.left - 1;
            }).map(el => el.textContent),
          }));
          const name = `${locale}-${route.slice(1) || 'home'}-${theme}-${width}`;
          await page.screenshot({ path: path.join(output, `${name}.png`), fullPage: true });
          results.push({ name, url, status: response.status(), ...geometry, violations: scan.violations });
          console.log(`${name}: axe=${scan.violations.length} overflow=${geometry.scrollWidth - width} clipped=${geometry.clippedSvgText.length}`);
          await context.close();
        }
      }
    }
  }
} finally { await browser.close(); }
await writeFile(path.join(output, 'results.json'), JSON.stringify({ phase, baseURL, browser: browser.version(), results }, null, 2));
if (phase !== 'before' && results.some(r => r.status !== 200 || r.violations.length || r.scrollWidth > r.viewport + 1 || r.clippedSvgText.length)) process.exitCode = 1;
