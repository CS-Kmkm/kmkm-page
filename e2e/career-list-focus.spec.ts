import { expect, test } from '@playwright/test';

for (const locale of ['ja', 'en']) {
  test(`career headings distinguish pointer and keyboard focus (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/career`);
    await page.getByRole('tab', { name: locale === 'ja' ? 'リスト表示' : 'List view', exact: true }).click();
    const heading = page.locator('section[aria-labelledby="list-heading"] h3').first();
    const button = heading.locator('..');
    await heading.click();
    await page.locator('dialog[open] button').first().click();
    await expect(button).toBeFocused();
    expect(await button.evaluate(element => element.matches(':focus-visible'))).toBe(false);
    await expect(button).toHaveCSS('box-shadow', 'none');
    expect(await page.evaluate(() => window.getSelection()?.toString())).toBe('');
    // Keyboard dismissal restores a visible indicator for continuing navigation.
    await heading.click();
    await page.keyboard.press('Escape');
    await expect(button).toBeFocused();
    expect(await button.evaluate(element => element.matches(':focus-visible'))).toBe(true);
    await expect(button).not.toHaveCSS('box-shadow', 'none');
    // Descriptive content remains selectable; only the focus trigger changed.
    const description = page.locator('section[aria-labelledby="list-heading"] p').first();
    await description.evaluate(element => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    });
    expect(await page.evaluate(() => window.getSelection()?.toString())).not.toBe('');
  });
}
