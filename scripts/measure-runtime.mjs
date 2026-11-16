import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

// Direct Chromium counters complement (and do not replace) Lighthouse scores.
const output = '.ai/test-results/perf-recheck/runtime-interactive';
await mkdir(output); // Refuse to overwrite prior measurements.
const browser = await chromium.launch();
const rows = [];
try {
  for (let run = 1; run <= 8; run++) {
    for (const route of ['/en', '/en/publications']) {
      const variants = [['current', 3102], ['optimized', 3103]];
      if (run % 2 === 0) variants.reverse();
      for (const [variant, port] of variants) {
        const context = await browser.newContext({
          viewport: { width: 412, height: 823 }, reducedMotion: 'reduce',
        });
        const page = await context.newPage();
        const cdp = await context.newCDPSession(page);
        await cdp.send('Performance.enable');
        await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
        await page.goto(`http://localhost:${port}${route}`, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        // Exercise the same React handler in both builds: networkidle alone
        // does not establish that hydration and its deferred effects finished.
        if (route === '/en') {
          await page.locator('[data-visible-update-item] button').first().click();
          await page.getByRole('dialog').waitFor();
          await page.keyboard.press('Escape');
          await page.getByRole('dialog').waitFor({ state: 'hidden' });
        }
        if (variant === 'optimized' && route === '/en') {
          await page.locator('[data-update-fit="settled"]').waitFor();
        }
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        const { metrics } = await cdp.send('Performance.getMetrics');
        const selected = Object.fromEntries(metrics.filter(({ name }) =>
          ['TaskDuration', 'ScriptDuration', 'LayoutDuration', 'RecalcStyleDuration', 'Nodes'].includes(name)
        ).map(({ name, value }) => [name, value]));
        rows.push({ run, route, variant, ...selected });
        await context.close();
        await writeFile(`${output}/results.json`, JSON.stringify({
          browser: browser.version(), cpuThrottlingRate: 4,
          homeInteraction: 'open first update dialog and close with Escape',
          viewport: { width: 412, height: 823 }, reducedMotion: 'reduce', rows,
        }, null, 2));
      }
    }
  }
} finally {
  await browser.close();
}
const median = values => {
  const sorted = [...values].sort((a, b) => a - b);
  return (sorted[3] + sorted[4]) / 2;
};
console.table(['/en', '/en/publications'].flatMap(route => ['current', 'optimized'].map(variant => {
  const group = rows.filter(row => row.route === route && row.variant === variant);
  return { route, variant, ...Object.fromEntries(['TaskDuration', 'ScriptDuration', 'LayoutDuration', 'RecalcStyleDuration', 'Nodes']
    .map(name => [name, median(group.map(row => row[name]))])) };
})));
