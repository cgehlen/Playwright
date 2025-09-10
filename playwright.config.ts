import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // dentro dessa pasta você pode ter `frontend` e `api`
  timeout: 30000,
  retries: 0,
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'frontend',
      testDir: './tests/serverest',
      use: {
        baseURL: 'https://front.serverest.dev',
      },
    },
    {
      name: 'api',
      testDir: './tests/serverest_api',
      use: {
        baseURL: 'https://serverest.dev', // endpoint da API
      },
    },
  ],
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
});
