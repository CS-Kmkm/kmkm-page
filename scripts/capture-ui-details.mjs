import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
const phase = process.argv[2] || 'after';
if (!/^[a-z0-9-]+$/i.test(phase)) throw new Error('Use a simple phase name');
const output = path.resolve('.ai/test-results/ui-quality', phase);
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  for (const locale of ['ja', 'en']) for (const width of [375, 1440]) for (const colorScheme of ['light', 'dark']) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme, reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const route of ['publications', 'dev-experience', 'career?view=list']) {
      await page.goto(`${process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000'}/${locale}/${route}`, { waitUntil: 'networkidle' });
      if (route === 'dev-experience') await page.getByRole('tab').last().click();
      const trigger = route === 'publications'
        ? page.getByRole('button', { name: locale === 'ja' ? /の詳細を表示/ : /Show details for/ }).first()
        : route === 'dev-experience'
          ? page.getByRole('list').filter({ has: page.locator('button') }).last().getByRole('button').first()
          : page.getByRole('button', { name: /View details for/ }).first();
      await trigger.click();
      await page.getByRole('dialog').waitFor();
      // Finish existing entrance animations before comparing static layouts.
      await page.evaluate(async () => Promise.allSettled(document.getAnimations().filter(a => a.effect?.getTiming().iterations !== Infinity).map(a => a.finished)));
      await page.screenshot({ path: path.join(output, `${locale}-${route.split('?')[0]}-modal-${colorScheme}-${width}.png`), fullPage: true });
    }
    await context.close();
  }
} finally { await browser.close(); }
