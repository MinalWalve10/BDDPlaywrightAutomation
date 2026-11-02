import { test as setup } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

const authFile = 'tests/e2e/auth.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.isLoaded();
  await loginPage.login(
    process.env.TEST_EMAIL || 'user2402@gmail.com',
    process.env.TEST_PASSWORD || 'Admin@123',
  );
  await loginPage.verifyLoginSuccess();
  await page.context().storageState({ path: authFile });
});