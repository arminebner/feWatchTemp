import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  projects: [
    {
      name: 'components',
      testDir: './test/component',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000/playwright/gallery/index.html',
        reuseContext: true,
        serviceWorkers: 'block',
      },
    },
    {
      name: 'integration',
      testDir: './test/integration',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
        serviceWorkers: 'block',
      },
    },
  ],
  reporter: 'list',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000/playwright/gallery/index.html',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
