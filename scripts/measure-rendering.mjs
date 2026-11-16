import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const phase = process.argv[2];
if (!phase || !/^[a-z0-9-]+$/.test(phase)) throw new Error('Provide a new simple phase name');
const output = `.ai/test-results/render-pruning/${phase}`;
await mkdir(output); // Preserve prior runs.
const browser = await chromium.launch();
const variants = [['before', 3102], ['after', 3103]];
const rows = [];
const visuals = [];
const html = [];

async function timedClick(page, selector, readySelector) {
  await page.evaluate(({ selector, readySelector }) => {
    window.__renderTiming = null;
    document.querySelector(selector).addEventListener('click', () => {
      const start = performance.now();
      const check = () => {
        const ready = document.querySelector(readySelector);
        if (!ready?.getClientRects().length) return requestAnimationFrame(check);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          window.__renderTiming = performance.now() - start;
        }));
      };
      requestAnimationFrame(check);
    }, { once: true, capture: true });
  }, { selector, readySelector });
  await page.locator(selector).first().click();
  await page.waitForFunction(() => window.__renderTiming !== null);
  return page.evaluate(() => window.__renderTiming);
}

try {
  for (const [variant, port] of variants) for (const locale of ['ja', 'en']) {
    const response = await fetch(`http://localhost:${port}/${locale}/dev-experience`);
    if (!response.ok) throw new Error(`Unavailable ${variant}/${locale}`);
    html.push({ variant, locale, uncompressedHtmlBytes: Buffer.byteLength(await response.text()) });
    for (const width of [375, 1440]) for (const colorScheme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme, reducedMotion: 'reduce' });
      const page = await context.newPage();
      await page.goto(`http://localhost:${port}/${locale}/dev-experience`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      for (const state of ['initial', 'projects', 'return']) {
        if (state === 'projects') await page.locator('#projects-tab').click();
        if (state === 'return') await page.locator('#technologies-tab').click();
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        const bytes = await page.screenshot({ path: `${output}/${variant}-${locale}-${colorScheme}-${width}-${state}.png`, fullPage: true });
        visuals.push({ variant, locale, colorScheme, width, state,
          sha256: createHash('sha256').update(bytes).digest('hex'),
          ...await page.evaluate(() => ({
            nodes: document.querySelectorAll('*').length,
            projectCards: document.querySelectorAll('[id^="project-card-"]').length,
            overflow: document.documentElement.scrollWidth > innerWidth,
          })),
        });
      }
      await context.close();
    }
  }
  for (let run = 1; run <= 8; run++) {
    const order = run % 2 ? variants : [...variants].reverse();
    for (const [variant, port] of order) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await page.goto(`http://localhost:${port}/en`, { waitUntil: 'networkidle' });
      await page.locator('[data-update-fit="settled"]').waitFor();
      const navigationMs = await timedClick(page, 'header a[href="/en/dev-experience"]', '#technologies-panel [id^="tech-card-"]');
      const firstProjectsMs = await timedClick(page, '#projects-tab', '#projects-panel [id^="project-card-"]');
      await timedClick(page, '#technologies-tab', '#technologies-panel [id^="tech-card-"]');
      const repeatProjectsMs = await timedClick(page, '#projects-tab', '#projects-panel [id^="project-card-"]');
      rows.push({ run, variant, navigationMs, firstProjectsMs, repeatProjectsMs });
      await context.close();
      await writeFile(`${output}/results.json`, JSON.stringify({ browser: browser.version(), cpuThrottlingRate: 4, html, visuals, rows }, null, 2));
    }
  }
} finally { await browser.close(); }
const median = values => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length / 2;
  return (sorted[mid - 1] + sorted[mid]) / 2;
};
console.table(variants.map(([variant]) => ({ variant, ...Object.fromEntries(
  ['navigationMs', 'firstProjectsMs', 'repeatProjectsMs'].map(key => [key, median(rows.filter(r => r.variant === variant).map(r => r[key]))])
)})));
