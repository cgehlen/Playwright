import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 30000,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],

  projects: [
    {
      name: 'frontend',
      testDir: './tests/serverest',
      use: {
        baseURL: 'https://front.serverest.dev',
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
    {
      name: 'api',
      testDir: './tests/serverest_api',
      use: {
        baseURL: 'https://serverest.dev',
        headless: true,
        screenshot: 'off',   // não precisa screenshot em API
        video: 'off',        // idem vídeo
      },
    },
    {
        name: 'reqres',
        testDir: './tests/reqres',
        use: {
          baseURL: 'http://reqres.in/api', 
          headless: true,
          screenshot: 'off',
          video: 'off',
        },
     }
  ],
});
