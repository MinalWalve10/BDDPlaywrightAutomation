import {test, Page, expect} from '@playwright/test';


test('Frame', async({page}) => {

    await page.goto("https://demoqa.com/frames");

    const frame= page.frameLocator('#frame1');

    const heading = frame.locator('#sampleHeading');

    await expect(heading).toHaveText('This is a sample page');


});
