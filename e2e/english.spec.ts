import { test, expect, type Page } from '@playwright/test';

const japanesePattern = /[ぁ-んァ-ヶ一-龠々ー]/;

async function expectVisibleCopyToBeEnglish(page: Page) {
  const text = await page.locator('body').innerText();
  const accessibleCopy = await page.locator('[aria-label], [title], img[alt]').evaluateAll(elements => (
    elements.flatMap(element => [
      element.getAttribute('aria-label'),
      element.getAttribute('title'),
      element.getAttribute('alt'),
    ]).filter((value): value is string => Boolean(value)).join('\n')
  ));
  expect(text).not.toMatch(japanesePattern);
  expect(accessibleCopy).not.toMatch(japanesePattern);
}

test.describe('English portfolio', () => {
  test('renders the English homepage and English primary navigation', async ({ page }) => {
    await page.goto('/en');

    await expect(page).toHaveTitle(/Koshi Motegi/);
    await expect(page.locator('[lang="en"]')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Koshi Motegi' })).toBeVisible();
    await expect(page.locator('main').getByText(/Matsubara Laboratory/).first()).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go to career page' })).toHaveAttribute('href', '/en/career');
    await expect(page.getByRole('link', { name: 'Go to publications page' })).toHaveAttribute('href', '/en/publications');
    await expect(page.getByRole('link', { name: 'Go to development experience page' })).toHaveAttribute('href', '/en/dev-experience');
    await expectVisibleCopyToBeEnglish(page);
  });

  test('navigates through English career, publication, and development pages', async ({ page }) => {
    await page.goto('/en');

    await page.getByRole('link', { name: 'Go to career page' }).click();
    await expect(page).toHaveURL('/en/career');
    await expect(page.getByRole('heading', { name: 'Career', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reverse career order' })).toBeVisible();
    await expectVisibleCopyToBeEnglish(page);

    await page.getByRole('tab', { name: 'List view' }).click();
    await expect(page.getByRole('heading', { name: 'Event list' })).toBeAttached();
    await expect(page.getByRole('button', { name: 'Affiliation' })).toBeVisible();
    await page.getByRole('button', { name: /View details for/ }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expectVisibleCopyToBeEnglish(page);
    await page.getByRole('button', { name: 'Close dialog' }).click();
    await expectVisibleCopyToBeEnglish(page);

    await page.getByRole('link', { name: 'Go to publications page' }).click();
    await expect(page).toHaveURL('/en/publications');
    await expect(page.getByRole('heading', { name: 'Publications', exact: true })).toBeVisible();
    await expect(page.getByText('Identifying Implicit Research Data References in Paper Citations')).toBeVisible();
    await expectVisibleCopyToBeEnglish(page);

    await page.getByRole('link', { name: 'Go to development experience page' }).click();
    await expect(page).toHaveURL('/en/dev-experience');
    await expect(page.getByRole('heading', { name: 'Development Experience' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Programming Languages' })).toBeVisible();
    await expectVisibleCopyToBeEnglish(page);
  });

  test('wraps English event filters within a narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en/career?view=list');

    const filters = page.getByRole('region', { name: 'Event filters' });
    await expect(filters).toBeVisible();
    await expect.poll(() => filters.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  });

  test('keeps English controls and dialogs usable', async ({ page }) => {
    await page.goto('/en/publications');
    await page.getByRole('button', { name: /Show details for/ }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Publication details')).toBeVisible();
    await expectVisibleCopyToBeEnglish(page);
    await page.getByRole('button', { name: 'Close dialog' }).click();

    await page.goto('/en/dev-experience');
    await page.getByRole('tab', { name: 'Projects' }).click();
    await page.getByRole('button', { name: /Show details for/ }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expectVisibleCopyToBeEnglish(page);
  });
});
