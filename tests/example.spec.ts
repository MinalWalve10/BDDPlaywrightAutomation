import { test, Page, expect } from '@playwright/test';


test('Navigate To Kapruka', async ({ page }) => {
  await page.goto("https://www.kapruka.com/shops/customerAccounts/accountLogin.jsp");
  await expect(page.getByText("Your Shopping Account")).toBeVisible();
});

test('Login Functionality', async ({ page }) => {
  await page.goto("https://www.kapruka.com/shops/customerAccounts/accountLogin.jsp");
  await page.getByPlaceholder("Enter email").fill("mysterymind1028@gmail.com")
  await page.getByPlaceholder("Password").fill("Destiny@2027");
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: 'Minal S 👋' })).toBeVisible();

});

