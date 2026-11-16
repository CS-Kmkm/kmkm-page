import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function checkModal(page: Page) {
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveJSProperty('open', true);
  await expect.poll(() => dialog.evaluate(el => el.matches(':modal'))).toBe(true);
  await expect(dialog.getByRole('button').first()).toBeFocused();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    // Native dialogs allow reaching browser chrome; body represents that boundary.
    await expect.poll(() => dialog.evaluate(el => el.contains(document.activeElement) || document.activeElement === document.body)).toBe(true);
  }
  await page.keyboard.press('Shift+Tab');
  await expect.poll(() => dialog.evaluate(el => el.contains(document.activeElement) || document.activeElement === document.body)).toBe(true);
  await dialog.getByRole('button').first().focus();
  await page.locator('header a').first().evaluate(el => (el as HTMLElement).focus());
  await expect.poll(() => dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations).toEqual([]);
  const box = await dialog.boundingBox();
  expect(box!.width).toBeLessThanOrEqual((page.viewportSize()?.width ?? 1440) - 30);
  expect(box!.height).toBeLessThanOrEqual((page.viewportSize()?.height ?? 1000) - 30);
}

test('stacked year/event dialogs return focus in order and keep ARIA references unique', async ({ page }) => {
  await page.goto('/ja/career');
  const year = page.getByRole('button', { name: /年のイベント/ }).first();
  await year.click();
  const list = page.locator('dialog[open]').first();
  const event = list.getByRole('button', { name: /View event details/ }).first();
  await event.focus();
  await event.press('ArrowDown');
  await expect(list.getByRole('button', { name: /View event details/ }).nth(1)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('dialog[open]')).toHaveCount(2);
  const ids = await page.locator('dialog[open]').evaluateAll(dialogs => dialogs.map(d => d.getAttribute('aria-labelledby')));
  expect(new Set(ids).size).toBe(2);
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog[open]')).toHaveCount(1);
  await expect(list.getByRole('button', { name: /View event details/ }).nth(1)).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  await expect(year).toBeFocused();
});

test('dragging from inside a dialog to its backdrop does not dismiss it', async ({ page }) => {
  await page.goto('/ja/publications');
  await page.getByRole('button', { name: /の詳細を表示/ }).first().click();
  const dialog = page.getByRole('dialog');
  const box = await dialog.boundingBox();
  await page.mouse.move(box!.x + 20, box!.y + 20);
  await page.mouse.down();
  await page.mouse.move(2, 2);
  await page.mouse.up();
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
});

for (const locale of ['ja', 'en']) {
  for (const width of [375, 1440]) {
    for (const colorScheme of ['light', 'dark'] as const) {
      test.describe(`${locale} ${width} ${colorScheme}`, () => {
        test.use({ viewport: { width, height: 1000 }, colorScheme, contextOptions: { reducedMotion: 'reduce' } });
        test('publication, project and event modals contain and restore keyboard focus', async ({ page }) => {
          for (const route of ['publications', 'dev-experience', 'career?view=list']) {
            await page.goto(`/${locale}/${route}`);
            if (route === 'dev-experience') await page.getByRole('tab').last().click();
            const trigger = route === 'publications'
              ? page.getByRole('button', { name: locale === 'ja' ? /の詳細を表示/ : /Show details for/ }).first()
              : route === 'dev-experience'
                ? page.getByRole('list').filter({ has: page.locator('button') }).last().getByRole('button').first()
                : page.getByRole('button', { name: /View details for/ }).first();
            await trigger.focus();
            await page.keyboard.press('Enter');
            await checkModal(page);
            await page.keyboard.press('Escape');
            await expect(page.getByRole('dialog')).toHaveCount(0);
            await expect(trigger).toBeFocused();
            await trigger.press('Enter');
            await page.getByRole('dialog').getByRole('button').first().click();
            await expect(trigger).toBeFocused();
            await trigger.press('Enter');
            await page.mouse.click(2, 2);
            await expect(page.getByRole('dialog')).toHaveCount(0);
            await expect(trigger).toBeFocused();
          }
        });

        test('career nodes and event points support keyboard interaction', async ({ page }) => {
          await page.goto(`/${locale}/career`);
          const node = page.locator('[aria-haspopup="dialog"]').first();
          await node.focus();
          await expect(node).toHaveCSS('outline-style', 'solid');
          await node.press('Enter');
          await expect(page.getByRole('dialog')).toBeVisible();
          await page.keyboard.press('Escape');
          await expect(node).toBeFocused();
          await page.getByRole('button', { name: locale === 'ja' ? '経歴の表示順を反転' : 'Reverse career order' }).click();
          await expect(page.getByRole('tab').first()).toHaveAttribute('aria-selected', 'true');
          const event = page.getByRole('button', { name: locale === 'ja' ? /年のイベント/ : /events? from/ }).first();
          await event.focus();
          await event.press('Space');
          await expect(page.getByRole('dialog')).toBeVisible();
          await page.keyboard.press('Escape');
          await expect(event).toBeFocused();
          expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        });

        test('project technology navigation returns to its project and preserves its overview', async ({ page }) => {
          await page.goto(`/${locale}/dev-experience`);
          await page.getByRole('tab').last().click();
          const project = page.locator('#project-card-proj-001');
          await project.click();
          const title = await page.getByRole('dialog').getByRole('heading', { level: 2 }).textContent();
          await page.getByRole('dialog').getByRole('button', { name: 'Python', exact: true }).click();
          await expect(page.getByRole('dialog')).toHaveCount(0);
          await expect(page.getByRole('region', { name: /Python/ })).toBeVisible();
          const back = page.locator('#tech-detail-back-button');
          await expect(back).toBeFocused();
          await back.press('Escape');
          await expect(page.getByRole('dialog')).toBeVisible();
          await expect(page.getByRole('dialog').getByRole('heading', { level: 2 })).toHaveText(title!);
          await expect(page.getByRole('dialog').getByRole('button', { name: 'Python', exact: true })).toBeFocused();
          await page.keyboard.press('Escape');
          await expect(page.getByRole('tab').last()).toHaveAttribute('aria-selected', 'true');
          await expect(project).toBeFocused();
        });

        test('Escape closes a related project without leaving technology details', async ({ page }) => {
          await page.goto(`/${locale}/dev-experience`);
          await page.locator('#tech-card-tech-001').click();
          const region = page.getByRole('region', { name: /Python/ });
          const trigger = region.locator('#project-card-proj-001');
          await trigger.click();
          await page.keyboard.press('Escape');
          await expect(page.getByRole('dialog')).toHaveCount(0);
          await expect(region).toBeVisible();
          await expect(trigger).toBeFocused();
        });
      });
    }
  }
}
