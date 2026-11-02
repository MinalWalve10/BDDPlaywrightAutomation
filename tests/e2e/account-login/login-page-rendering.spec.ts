import { test, expect } from '@playwright/test';

test.describe('Customer account login', () => {
  test('Display the login form in a clean signed-out state', async ({ page }) => {
    const emailInput = page.getByRole('textbox', { name: 'Email address' });
    const passwordInput = page.locator('input[type="password"]');
    const createAccountButton = page.getByRole('button', { name: 'Create Account' });
    const loginButton = page.getByRole('button', { name: 'Login' });
    const forgotPasswordLink = page.getByRole('link', { name: 'Forgot your password' });
    const accountBenefitsLink = page.getByRole('link', { name: 'Account benefits' });

    // 1. Open the login page in the isolated Playwright test context and clear any prefilled email.
    await page.goto('https://www.kapruka.com/shops/customerAccounts/accountLogin.jsp');
    await expect(page).toHaveTitle(/Account Login/);
    await expect(page.getByRole('heading', { name: 'Your Shopping Account' })).toBeVisible();
    await expect(emailInput).toBeVisible();
    await emailInput.fill('');
    await expect(emailInput).toBeEmpty();
    await expect(passwordInput).toBeVisible();
    await expect(createAccountButton).toBeVisible();
    await expect(loginButton).toBeVisible();
    await expect(forgotPasswordLink).toBeVisible();
    await expect(accountBenefitsLink).toBeVisible();

    // 2. Tab through the login-related controls and verify keyboard focus reaches each one.
    await emailInput.focus();
    await page.keyboard.press('Shift+Tab');
    await expect(createAccountButton).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(emailInput).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(passwordInput).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(loginButton).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(forgotPasswordLink).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(accountBenefitsLink).toBeFocused();
  });
});
