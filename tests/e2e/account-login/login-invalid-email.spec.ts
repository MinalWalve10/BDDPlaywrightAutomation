import { test, expect } from '@playwright/test';

test.describe('Customer account login', () => {
  test('Reject a malformed email address', async ({ page }) => {
    const emailInput = page.locator('#exampleInputEmail1');
    const passwordInput = page.locator('#exampleInputPassword1');
    const loginSubmit = page.locator('input[type="submit"][name="Login"]');

    // 1. Enter a malformed email address in the login form.
    await page.goto('https://www.kapruka.com/shops/customerAccounts/accountLogin.jsp');
    await emailInput.fill('qa-invalid-email');
    await expect(emailInput).toHaveValue('qa-invalid-email');

    // 2. Submit the malformed address with a non-empty QA-only password.
    await passwordInput.fill('NotARealPassword-ForValidation');
    await expect(emailInput).toHaveAttribute('type', 'email');
    await loginSubmit.click();
    await expect(page).toHaveURL('https://www.kapruka.com/shops/customerAccounts/accountLogin.jsp');
    await expect(emailInput).toHaveValue('qa-invalid-email');
  });
});
