import { test, expect } from '@playwright/test';
import { config } from 'dotenv';
import { existsSync } from 'node:fs';
import path from 'node:path';

const qaEnvPath = [
  path.resolve(process.cwd(), 'config/.env.qa'),
  path.resolve(process.cwd(), '../../config/.env.qa'),
].find(existsSync);

if (qaEnvPath) {
  config({ path: qaEnvPath });
}

test.describe('Customer account login', () => {
  test('Log in successfully with an authorized QA account', async ({ page }) => {
    const qaEmail = process.env.KAPRUKA_QA_EMAIL;
    const qaPassword = process.env.KAPRUKA_QA_PASSWORD;

    test.skip(!qaEmail || !qaPassword, 'Set KAPRUKA_QA_EMAIL and KAPRUKA_QA_PASSWORD to run this test.');
    if (!qaEmail || !qaPassword) return;

    const emailInput = page.getByRole('textbox', { name: 'Email address' });
    const passwordInput = page.locator('#exampleInputPassword1');
    const loginButton = page.getByRole('button', { name: 'Login' });

    // 1. Enter authorized QA credentials without hard-coding or printing secrets.
    await page.goto('https://www.kapruka.com/shops/customerAccounts/accountLogin.jsp');
    await emailInput.fill(qaEmail);
    await passwordInput.fill(qaPassword);
    await expect(emailInput).toHaveValue(qaEmail);
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // 2. Sign in and verify the authenticated destination and session survive a subsequent request.
    await loginButton.click();
    await expect(page).not.toHaveURL(/accountLogin\.jsp/);
    expect(page.url()).not.toContain(qaPassword);
    await page.reload();
    await expect(page).not.toHaveURL(/accountLogin\.jsp/);
    expect(page.url()).not.toContain(qaPassword);
  });
});
