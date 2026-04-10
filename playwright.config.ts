import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:8000';

const PAGES = [
  '/',
  '/services/',
  '/portfolio/',
  '/portfolio/projects/case-study-automotive-platform/',
  '/about/',
  '/contact/',
  '/blog/',
];

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],

  use: {
    baseURL: BASE_URL,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    // --- Very small phone (320px) ---
    {
      name: 'small-phone',
      use: {
        viewport: { width: 320, height: 568 },
        isMobile: true,
        hasTouch: true,
      },
    },
    // --- Common Android (360px) ---
    {
      name: 'android-common',
      use: {
        viewport: { width: 360, height: 800 },
        isMobile: true,
        hasTouch: true,
      },
    },
    // --- Pixel 5 (device preset) ---
    {
      name: 'pixel-5',
      use: { ...devices['Pixel 5'] },
    },
    // --- iPhone 12 (device preset) ---
    {
      name: 'iphone-12',
      use: { ...devices['iPhone 12'] },
    },
    // --- iPhone 14-style (390px) ---
    {
      name: 'iphone-14',
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
    // --- Large phone (414px) ---
    {
      name: 'large-phone',
      use: {
        viewport: { width: 414, height: 896 },
        isMobile: true,
        hasTouch: true,
      },
    },
    // --- Tablet (768px) ---
    {
      name: 'tablet',
      use: {
        viewport: { width: 768, height: 1024 },
        isMobile: false,
        hasTouch: true,
      },
    },
  ],
});

export { PAGES };
