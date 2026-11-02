import { test, expect } from '@playwright/test';

test.describe('Customer account login', () => {
  test('Open account registration for a new customer', async ({ page }) => {
    // 1. Open registration from the signed-out login page.
    await page.goto('https://www.kapruka.com/shops/customerAccounts/accountLogin.jsp');
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page).toHaveTitle('Kapruka New Account Creation');
    await expect(page.getByRole('heading', { name: 'Create a New Kapruka Account' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login to Your Account' })).toBeVisible();
  });
});
