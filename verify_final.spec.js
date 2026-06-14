const { test, expect } = require('@playwright/test');
const path = require('path');

test('Verify CV content and translations', async ({ page }) => {
  const filePath = 'file://' + path.resolve('docs/v2/index.html');
  await page.goto(filePath);

  // Check initial state (French)
  await expect(page.locator('h1')).toHaveText('Pierre Laclaverie');
  await expect(page.locator('[data-i18n="residencyStatus"]')).toHaveText('Résident Permanent');

  // Switch to English
  await page.click('#lang-toggle');
  await expect(page.locator('[data-i18n="residencyStatus"]')).toHaveText('Permanent Resident');

  // Verify links
  const linkedin = page.locator('a:has-text("LinkedIn")');
  await expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/pierre-laclaverie/');

  const github = page.locator('a:has-text("GitHub")');
  await expect(github).toHaveAttribute('href', 'https://github.com/Laclaverie');

  // Screenshot for manual verification
  await page.screenshot({ path: 'final_cv_en.png' });

  // Toggle back to French
  await page.click('#lang-toggle');
  await page.screenshot({ path: 'final_cv_fr.png' });
});
