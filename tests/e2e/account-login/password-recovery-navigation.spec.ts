import { test, expect } from '@playwright/test';

test.describe('Customer account login', () => {
  test('Open password recovery from the login page', async ({ page }) => {
    const recoveryEmailInput = page.locator('input[name="email"]');
    const submitLink = page.getByRole('link', { name: 'Submit' });

    // 1. Open password recovery from the login page and verify its request form.
    await page.goto('https://www.kapruka.com/shops/customerAccounts/accountLogin.jsp');
    await page.locator('a[href*="forgot_password.jsp"]').click();
    await expect(page).toHaveTitle('Reset Account Password Request');
    await expect(page.getByRole('heading', { name: 'Password Reset Request' })).toBeVisible();
    await expect(page.getByText('Please enter the email address you used to create your account')).toBeVisible();
    await expect(recoveryEmailInput).toBeVisible();
    await expect(recoveryEmailInput).toBeEmpty();
    await expect(submitLink).toBeVisible();
  });
});
