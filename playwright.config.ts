import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

const env = process.env.TEST_ENV || 'qa';

dotenv.config({
    path: path.resolve(__dirname, `config/.env.${env}`),
});

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 4 : undefined,

  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL,

    // Take screenshot only when test fails
    screenshot: 'only-on-failure', //screenshot automatically on failure

    trace: 'on',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'chromium',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/e2e/auth.json',
      },
    },
  ],
});