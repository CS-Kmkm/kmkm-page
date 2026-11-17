import { test, expect } from '@playwright/test';

for (const locale of ['ja', 'en']) {
  test(`modal transitions preserve native containment and focus (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/publications`);
    const trigger = page.getByRole('button', { name: locale === 'ja' ? /の詳細を表示/ : /Show details for/ }).first();
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveCSS('animation-name', 'modal-enter');
    await expect(dialog.getByRole('button').first()).toBeFocused();
    // A repeated dismissal must not fire another close or release containment early.
    await page.evaluate(() => {
      const modal = document.querySelector('dialog[open]')!;
      modal.dispatchEvent(new Event('cancel', { cancelable: true }));
      modal.dispatchEvent(new Event('cancel', { cancelable: true }));
    });
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await trigger.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });
}

test('reduced motion closes without an exit animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/ja/publications');
  const trigger = page.getByRole('button', { name: /の詳細を表示/ }).first();
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const result = await dialog.evaluate(el => {
    el.dispatchEvent(new Event('cancel', { cancelable: true }));
    return (el as HTMLDialogElement).open;
  });
  expect(result).toBe(false);
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('retained career dialog is visible again after animated dismissal', async ({ page }) => {
  await page.goto('/ja/career');
  const trigger = page.locator('button:visible[aria-haspopup="dialog"]').first();
  for (let attempt = 0; attempt < 2; attempt++) {
    await trigger.click();
    const dialog = page.locator('dialog[open]').first();
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveCSS('opacity', '1');
    await page.keyboard.press('Escape');
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    await expect(trigger).toBeFocused();
  }
});
