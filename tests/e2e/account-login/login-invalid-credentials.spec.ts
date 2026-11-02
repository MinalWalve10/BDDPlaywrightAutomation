import { test, expect } from '@playwright/test';

test.describe('Customer account login', () => {
  test('Reject an unregistered email without creating a session', async ({ page }) => {
    const emailInput = page.locator('#exampleInputEmail1');
    const passwordInput = page.locator('#exampleInputPassword1');
    const loginSubmit = page.locator('input[type="submit"][name="Login"]');

    // 1. Enter a reserved invalid-domain email and a deliberately incorrect QA-only password.
    await page.goto('https://www.kapruka.com/shops/customerAccounts/accountLogin.jsp');
    await emailInput.fill('qa@example.invalid');
    await passwordInput.fill('DefinitelyWrong-QA-Only-123');
    await expect(emailInput).toHaveValue('qa@example.invalid');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // 2. Submit the unregistered address and verify the site rejects the login.
    await loginSubmit.click();
    await expect(page).toHaveURL(/accountLogin\.jsp\?error=/);
    await expect(page.getByRole('heading', { name: 'Your Shopping Account' })).toBeVisible();
    await expect(page.getByText('Sorry, we did not find an account for that e-mail address.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login to Your Account' })).toBeVisible();
  });
});
