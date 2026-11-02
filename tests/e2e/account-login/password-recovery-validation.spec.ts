import { test, expect } from '@playwright/test';

test.describe('Customer account login', () => {
  test('Validate password recovery email input', async ({ page }) => {
    const recoveryUrl = 'https://www.kapruka.com/shops/customerAccounts/forgot_password.jsp';
    const recoveryEmailInput = page.locator('input[name="email"]');
    const submitLink = page.getByRole('link', { name: 'Submit' });

    // 1. Submit the password recovery form with an empty email address.
    await page.goto('https://www.kapruka.com/shops/customerAccounts/accountLogin.jsp');
    await page.locator('a[href*="forgot_password.jsp"]').click();
    await expect(recoveryEmailInput).toBeVisible();
    await recoveryEmailInput.fill('');
    await submitLink.click();
    await expect.soft(page).toHaveURL(recoveryUrl);
    await expect(page.getByText('Sorry, we did not find an account matching to that e-mail address.')).toBeVisible();

    // 2. Submit a malformed address and verify the site rejects the recovery request.
    await page.goto(recoveryUrl);
    await recoveryEmailInput.fill('qa-invalid-email');
    await submitLink.click();
    await expect.soft(page).toHaveURL(recoveryUrl);
    await expect(page.getByText('Sorry, we did not find an account matching to that e-mail address.')).toBeVisible();

    // 3. Exercise a real recovery request only when an approved QA mailbox is configured.
    const qaRecoveryEmail = process.env.KAPRUKA_QA_RECOVERY_EMAIL;
    if (qaRecoveryEmail) {
      await page.goto(recoveryUrl);
      await recoveryEmailInput.fill(qaRecoveryEmail);
      await submitLink.click();
      await expect(page.getByText(/sent|check your email|reset link/i)).toBeVisible();
    }
  });
});
