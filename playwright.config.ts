import { defineConfig, devices } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

export default defineConfig({
  testDir: './tests',
  timeout: 15000,
  workers: 1,
  use: {
    baseURL: BASE_URL,
  },
  projects: [
    { name: 'small-phone-320', use: { viewport: { width: 320, height: 568 }, isMobile: true } },
    { name: 'android-360', use: { viewport: { width: 360, height: 800 }, isMobile: true } },
    { name: 'iphone-375', use: { viewport: { width: 375, height: 667 }, isMobile: true } },
    { name: 'iphone-14-390', use: { viewport: { width: 390, height: 844 }, isMobile: true } },
    { name: 'large-phone-414', use: { viewport: { width: 414, height: 896 }, isMobile: true } },
    { name: 'tablet-768', use: { viewport: { width: 768, height: 1024 } } },
    { name: 'desktop-1280', use: { viewport: { width: 1280, height: 800 } } },
  ],
});
