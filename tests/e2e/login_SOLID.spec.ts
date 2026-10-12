
import { test, expect } from '@playwright/test';
import { LoginPage_SOLID } from '../../pages/LoginPage_SOLID';
import dotenv from 'dotenv';
import path from 'path';

const env = process.env.TEST_ENV || 'qa';
if (!process.env.TEST_EMAIL || !process.env.TEST_PASSWORD) {
    dotenv.config({
        path: path.resolve(__dirname, `../../config/.env.${env}`),
    });
}

// CHANGE: Read credentials from environment variables ONLY - no hardcoded
// fallback values.
// BEFORE:
//   await loginPage.login(process.env.TEST_EMAIL || 'user2402@gmail.com',
//                          process.env.TEST_PASSWORD || 'Admin@123');
// WHY THIS WAS CHANGED (security fix, not just style):
// Hardcoding a real-looking email/password directly in source code means
// those credentials get committed to git history permanently - even if
// removed later, they remain recoverable from old commits. If this repo is
// ever made public, forked, or shared, that's a leaked credential incident.
// Test credentials should live ONLY in .env files (which are .gitignored)
// or in your CI/CD pipeline's secret manager - never as a fallback literal
// in code.
//
// Instead, we now FAIL FAST with a clear error if the env vars are missing,
// rather than silently falling back to a hardcoded value. This surfaces
// misconfiguration immediately instead of masking it.

//MASKED *****
const TEST_EMAIL = process.env.TEST_EMAIL;
const TEST_PASSWORD = process.env.TEST_PASSWORD;

test.describe('Kapruka Login Test', () =>
{
    test('Valid user should login successfully', async({page}) =>
        {
            if (!TEST_EMAIL || !TEST_PASSWORD) {
                throw new Error(
                    'Missing TEST_EMAIL or TEST_PASSWORD environment variable. ' +
                    'Set these in your .env file or CI/CD secrets before running tests.'
                );
            }

            const loginPage = new LoginPage_SOLID(page);
            await loginPage.goto();
            await loginPage.isLoaded();
            // CHANGE: Now uses the validated TEST_EMAIL / TEST_PASSWORD
            // constants above instead of inline env reads with hardcoded
            // fallbacks.
            await loginPage.Login(TEST_EMAIL, TEST_PASSWORD);
            await loginPage.verifyLoginSucessful();


        })
});
//Fixed test - 'Hello'
//Variable inside text - `Hello ${name}
//LOCAL MACHINE - .env files
//CI CD - vault - credentials are masked - not displayed in plain english language
