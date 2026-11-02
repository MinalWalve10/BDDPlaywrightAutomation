import { test, expect } from '@playwright/test';

test.describe('Customer account login', () => {
  test('Show account benefits information', async ({ page }) => {
    const accountBenefitsLink = page.locator('a[href="javascript:void(0);"]');
    const benefitsTooltip = page.getByRole('tooltip', { name: 'Account benefits' });
    const accountHeading = page.getByRole('heading', { name: 'Your Shopping Account' });
    const emailInput = page.getByRole('textbox', { name: 'Email address' });

    // 1. Open the Account benefits information from the login page.
    await page.goto('https://www.kapruka.com/shops/customerAccounts/accountLogin.jsp');
    await accountBenefitsLink.click();
    await expect(benefitsTooltip).toBeVisible();
    await expect(benefitsTooltip.getByRole('heading', { name: 'Account benefits' })).toBeVisible();
    await expect(page).toHaveURL('https://www.kapruka.com/shops/customerAccounts/accountLogin.jsp');

    // 2. Dismiss the tooltip by moving focus away and verify the login form is still usable.
    await accountHeading.click();
    await expect(benefitsTooltip).toBeHidden();
    await expect(emailInput).toBeVisible();
  });
});
