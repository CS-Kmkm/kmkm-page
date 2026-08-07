import { test, expect, type Locator } from '@playwright/test';

const expectModalWidth = async (dialog: Locator, expectedWidth: number) => {
  await expect(dialog).toBeVisible();
  await expect.poll(async () => {
    const box = await dialog.boundingBox();
    return Math.abs((box?.width ?? 0) - expectedWidth);
  }).toBeLessThanOrEqual(1);
};

test.describe('Modal layout', () => {
  test('uses the publication-modal width across pages on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    const updates = page.getByRole('region', { name: '最新の更新情報' });
    await updates.getByRole('button').first().click();

    await expectModalWidth(page.getByRole('dialog'), 1024);

    await page.goto('/career?view=list');
    await page.getByRole('button', { name: /View details for/ }).first().click();

    await expectModalWidth(page.getByRole('dialog'), 1024);

    await page.goto('/dev-experience');
    const projects = page.getByRole('list', { name: '全プロジェクト一覧' });
    await projects.getByRole('button').first().click();

    await expectModalWidth(page.getByRole('dialog'), 1024);

    await page.goto('/publications');
    await page.getByRole('button', { name: /の詳細を表示/ }).first().click();

    await expectModalWidth(page.getByRole('dialog'), 1024);
  });

  test('uses only the top-right close button', async ({ page }) => {
    await page.goto('/');

    const updates = page.getByRole('region', { name: '最新の更新情報' });
    await updates.getByRole('button').first().click();

    let dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('button', { name: 'Close modal' })).toHaveCount(1);
    await expect(dialog.getByRole('button', { name: '閉じる' })).toHaveCount(0);

    await page.goto('/career?view=list');
    await page.getByRole('button', { name: /View details for/ }).first().click();

    dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('button', { name: 'Close modal' })).toHaveCount(1);
    await expect(dialog.getByRole('button', { name: '閉じる' })).toHaveCount(0);
  });
});
