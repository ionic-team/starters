import { expect, test } from '@playwright/test';

test('visits the app root url', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#container')).toContainText('Ready to create an app?');
});
