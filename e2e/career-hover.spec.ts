import { expect, test } from '@playwright/test';

for (const locale of ['ja', 'en']) {
  for (const mobile of [false, true]) {
    test(`timeline hover follows the pointer over shifted labels (${locale}, ${mobile ? 'mobile' : 'desktop'})`, async ({ page }) => {
      await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 });
      await page.goto(`/${locale}/career`);
      const control = page.locator('section[aria-labelledby="timeline-heading"] .timeline-control').first();
      await expect(control).toBeVisible();
      await control.scrollIntoViewIfNeeded();
      // Horizontal scrolling emits its scroll event on the next rendering turn.
      // Let that event and responsive ResizeObserver updates finish before the
      // one pointer move below; those updates intentionally clear old hover.
      await page.evaluate(() => new Promise<void>(resolve => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }));
      const timeline = control.locator('xpath=../../..');
      const originalRow = control.locator('xpath=../..');
      const point = await control.boundingBox();
      if (!point) throw new Error('Career control has no bounds');
      const x = point.x + 10;
      const y = point.y + point.height / 2;
      await page.mouse.move(x, y);
      await expect.poll(() => timeline.evaluate((element, pointerY) => {
        const highlighted = Array.from(element.children).filter(row => getComputedStyle(row).backgroundColor !== 'rgba(0, 0, 0, 0)');
        return highlighted.length === 1 && highlighted.every(row => {
          const bounds = row.getBoundingClientRect();
          return bounds.top <= pointerY && pointerY < bounds.bottom;
        });
      }, y)).toBe(true);
      const originalBounds = await originalRow.boundingBox();
      if (originalBounds && (y < originalBounds.y || y >= originalBounds.y + originalBounds.height)) {
        await expect(originalRow).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
      }
      // Scrolling and resizing under a stationary pointer must not retain a stale row.
      await page.evaluate(() => window.dispatchEvent(new Event('scroll')));
      await expect.poll(() => timeline.evaluate(element => Array.from(element.children).every(row => getComputedStyle(row).backgroundColor === 'rgba(0, 0, 0, 0)'))).toBe(true);
      await page.mouse.move(x + 1, y);
      await page.setViewportSize(mobile ? { width: 400, height: 850 } : { width: 1430, height: 990 });
      await page.mouse.move(0, 0);
      await expect.poll(() => timeline.evaluate(element => Array.from(element.children).every(row => getComputedStyle(row).backgroundColor === 'rgba(0, 0, 0, 0)'))).toBe(true);
      await page.keyboard.press('Tab');
      await control.focus();
      await expect(control).toBeFocused();
      expect(await control.evaluate(element => element.matches(':focus-visible'))).toBe(true);
    });
  }
}
