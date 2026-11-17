import { expect, test } from '@playwright/test';

type BadgeSample = { time: number; opacity: number[] };
type SamplingWindow = Window & typeof globalThis & { badgeSamples?: BadgeSample[]; badgeSamplingDone?: boolean; badgeSamplingFrame?: number };

for (const locale of ['ja', 'en']) {
  for (const mobile of [false, true]) {
    test(`technology cards stay visible after client navigation (${locale}, ${mobile ? 'mobile' : 'desktop'})`, async ({ page }) => {
      await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 });
      await page.goto(`/${locale}`);
      for (let cycle = 0; cycle < 2; cycle++) {
        if (mobile) await page.locator('button[aria-controls="mobile-menu"]').click();

        await page.evaluate(() => {
          const state = window as SamplingWindow;
          if (state.badgeSamplingFrame !== undefined) cancelAnimationFrame(state.badgeSamplingFrame);
          state.badgeSamples = [];
          state.badgeSamplingDone = false;
          let start: number | undefined;
          const sample = (time: number) => {
            const items = document.querySelectorAll('#technologies-panel [role="list"]:first-child > [role="listitem"]');
            if (items.length) {
              start ??= time;
              state.badgeSamples?.push({ time: time - start, opacity: Array.from(items, item => Number(getComputedStyle(item).opacity)) });
              if (time - start >= 1_000) { state.badgeSamplingDone = true; state.badgeSamplingFrame = undefined; return; }
            }
            state.badgeSamplingFrame = requestAnimationFrame(sample);
          };
          state.badgeSamplingFrame = requestAnimationFrame(sample);
        });
        await page.locator(`a[href="/${locale}/dev-experience"]:visible`).first().click();
        await expect.poll(() => page.evaluate(() => (window as SamplingWindow).badgeSamplingDone)).toBe(true);
        const samples = await page.evaluate(() => (window as SamplingWindow).badgeSamples ?? []);
        expect(samples.length).toBeGreaterThan(2);
        expect(samples[0].opacity.length).toBeGreaterThan(6);
        // A card may fade in with its grid, but must never disappear again after being painted.
        for (let item = 0; item < samples[0].opacity.length; item++) {
          let highestOpacity = 0;
          for (const sample of samples) {
            expect(sample.opacity[item], `card ${item}, ${sample.time}ms`).toBeGreaterThanOrEqual(highestOpacity - 0.05);
            highestOpacity = Math.max(highestOpacity, sample.opacity[item]);
          }
        }
        if (cycle === 0) {
          await page.locator(`header a[href="/${locale}"]`).first().click();
          await expect(page).toHaveURL(new RegExp(`/${locale}$`));
          await expect(page.locator('#technologies-panel')).toHaveCount(0);
        }
      }
      const python = page.getByRole('button', { name: locale === 'ja' ? 'Pythonの詳細を表示' : 'Show Python details', exact: true });
      await python.focus();
      await page.keyboard.press('Enter');
      const back = page.locator('#tech-detail-back-button');
      await expect(back).toBeVisible();
      await back.click();
      await expect(python).toBeFocused();
    });
  }
}
