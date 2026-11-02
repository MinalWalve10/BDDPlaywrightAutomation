import { test, expect } from '@playwright/test';

test.describe('Customer account login', () => {
  test('Prevent login when the password is missing', async ({ page }) => {
    const emailInput = page.locator('#exampleInputEmail1');
    const passwordInput = page.locator('#exampleInputPassword1');
    const loginSubmit = page.locator('input[type="submit"][name="Login"]');

    // 1. Enter a reserved QA email address and leave the password blank.
    await page.goto('https://www.kapruka.com/shops/customerAccounts/accountLogin.jsp');
    await emailInput.fill('qa@example.invalid');
    await expect(emailInput).toHaveValue('qa@example.invalid');
    await expect(passwordInput).toBeEmpty();

    // 2. Submit the form and verify the required password prevents login.
    await expect(passwordInput).toHaveAttribute('required', '');
    await loginSubmit.click();
    await expect(page).toHaveURL('https://www.kapruka.com/shops/customerAccounts/accountLogin.jsp');
    await expect(passwordInput).toBeEmpty();
    await expect(emailInput).toHaveValue('qa@example.invalid');
  });
});
