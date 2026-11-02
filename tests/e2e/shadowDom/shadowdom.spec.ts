import { test, expect } from '@playwright/test';

test('Shadow Dom Practice', async ({ page }) => {
    await page.goto('https://selectorshub.com/xpath-practice-page/');
    await expect(page.getByText('Dummy Form')).toBeVisible();

    const shadowDom = await page.getByText('Shadow DOM', { exact: true });
    await shadowDom.scrollIntoViewIfNeeded();
    await expect(shadowDom).toBeVisible();

    await page.getByRole('textbox', { name: "user name field" }).fill('Minal');
    await page.getByRole('textbox', { name: "Enter pizza name" }).fill("Cheese Pizza");
    await page.getByPlaceholder('Does DevTools ctl+f gives always the right count of xpath match?').fill('Yes');

    await page.locator('#pass').fill('Desire');


});
