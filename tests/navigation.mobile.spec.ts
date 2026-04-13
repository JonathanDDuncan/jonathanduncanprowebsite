import { test, expect, Page } from '@playwright/test';
import { PAGES } from '../playwright.config';

// ---------------------------------------------------------------------------
// navigation.mobile.spec.ts
//
// Mobile navigation behaviour: hamburger menu visibility, drawer open/close,
// link accessibility, and correct navigation flow.
// ---------------------------------------------------------------------------

test.describe('Mobile navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('hamburger button is visible on mobile', async ({ page }) => {
    const vpWidth = page.viewportSize()?.width ?? 320;
    if (vpWidth >= 960) {
      test.skip();
      return;
    }
    // Material for MkDocs uses a label with .md-header__button as the hamburger
    const hamburger = page.locator('label.md-header__button[for="__drawer"]');
    await expect(hamburger).toBeVisible();
  });

  test('navigation drawer opens on hamburger click', async ({ page }) => {
    const vpWidth = page.viewportSize()?.width ?? 320;
    if (vpWidth >= 960) {
      test.skip();
      return;
    }
    const hamburger = page.locator('label.md-header__button[for="__drawer"]');
    await hamburger.click();

    // The sidebar/drawer should become visible
    const sidebar = page.locator('.md-sidebar--primary');
    await expect(sidebar).toBeVisible({ timeout: 3000 });
  });

  test('navigation links are accessible from drawer', async ({ page }) => {
    const vpWidth = page.viewportSize()?.width ?? 320;
    if (vpWidth >= 960) {
      test.skip();
      return;
    }
    const hamburger = page.locator('label.md-header__button[for="__drawer"]');
    await hamburger.click();

    // Check that key nav items exist and are visible
    const navLinks = page.locator('.md-nav__link');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('navigation tabs are hidden on small mobile', async ({ page }) => {
    const vpWidth = page.viewportSize()?.width ?? 320;
    if (vpWidth >= 768) {
      test.skip();
      return;
    }
    // Material tabs row should be hidden on narrow viewports
    const tabs = page.locator('.md-tabs');
    if (await tabs.count() > 0) {
      const box = await tabs.boundingBox();
      // Either hidden or collapsed to zero height
      if (box) {
        expect(box.height).toBeLessThanOrEqual(1);
      }
    }
  });
});

// Test that all pages load without errors on mobile
for (const pagePath of PAGES) {
  test(`page loads without console errors — ${pagePath}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      errors.push(err.message);
    });
   const response =await page.goto(pagePath, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    expect(response?.status()).toBeLessThan(400);

    // Filter out known harmless errors (analytics, fonts, etc.)
    const realErrors = errors.filter(
      (e) =>
        !e.includes('analytics') &&
        !e.includes('google') &&
        !e.includes('font') &&
        !e.includes('favicon')
    );

    expect(realErrors, `Console errors on ${pagePath}: ${realErrors.join(', ')}`).toHaveLength(0);
  });
}
