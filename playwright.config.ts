import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],

  use: {
    // Capture screenshots on failure and on success
    screenshot: 'on',
    // Record video for all tests
    video: 'on',
    // Trace on first retry
    trace: 'on-first-retry',
    // Viewport size
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    {
      name: 'preview',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://a-startup-gpqvcpygs-ai-acrobatics.vercel.app',
      },
    },
    {
      name: 'production',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://astartupbiz.com',
      },
    },
    {
      name: 'mobile-preview',
      use: {
        ...devices['Pixel 5'],
        baseURL: 'https://a-startup-gpqvcpygs-ai-acrobatics.vercel.app',
      },
    },
  ],

  // Output folder for test artifacts
  outputDir: 'test-results/',
});
