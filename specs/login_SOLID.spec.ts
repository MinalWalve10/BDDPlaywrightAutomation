import {test, expect} from '@playwright/test';
import { LoginPage_SOLID } from '../../pages/LoginPage_SOLID';

const TEST_EMAIL = process.env.TEST_EMAIL;
const TEST_PASSWORD = process.env.TEST_PASSWORD;
test.use({storageState: {cookies:[], origins:[]}});
//configuring an empty initial storage -> browser context starts -> Login test executes

if(!TEST_EMAIL || !TEST_PASSWORD)
    {
        throw new Error('Missing env variables');
    }

//function in playwright - grouping of the test cases
test.describe('Kapruka Login Test', () =>
{
    test('Valid user should login successfully', async({page}) =>
    {
        const loginPage = new LoginPage_SOLID(page);
        await loginPage.goto();
        await loginPage.isLoaded();

        await loginPage.login(TEST_EMAIL, TEST_PASSWORD);

    }
    )
})
//SESSION STORAGE
