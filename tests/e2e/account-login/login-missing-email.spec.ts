import { test, expect } from '@playwright/test';

test.describe('Customer account login', () => {
  test('Reject login when the email address is missing', async ({ page }) => {
    const emailInput = page.locator('#exampleInputEmail1');
    const passwordInput = page.locator('#exampleInputPassword1');
    const loginSubmit = page.locator('input[type="submit"][name="Login"]');

    // 1. Clear any prefilled email and enter a non-empty QA-only password.
    await page.goto('https://www.kapruka.com/shops/customerAccounts/accountLogin.jsp');
    await emailInput.fill('');
    await passwordInput.fill('NotARealPassword-ForValidation');
    await expect(emailInput).toBeEmpty();
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // 2. Submit without an email and verify the user receives an error while remaining signed out.
    await loginSubmit.click();
    await expect(page).toHaveURL(/accountLogin\.jsp\?error=/);
    await expect(page.getByText('Your password is wrong. Please try again.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login to Your Account' })).toBeVisible();
  });
});
