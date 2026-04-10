import { test, expect, type Page } from '@playwright/test';

const SMOKE_PAGES = ['/', '/services/'];

async function gotoReady(p: Page, path: string) {
  await p.goto(path, { waitUntil: 'domcontentloaded' });
  await expect(p.locator('header')).toBeVisible();
  await expect(p.locator('main')).toBeVisible();
  await expect(p.getByRole('heading').first()).toBeVisible();
}

for (const path of SMOKE_PAGES) {
  test.describe(`Responsive Smoke: ${path}`, () => {
    test('page shell renders and nav is reachable', async ({ page, isMobile }) => {
      await gotoReady(page, path);

      if (isMobile) {
        const hasHamburger = await page
          .locator('[data-md-toggle="drawer"], .md-header__button[for="__drawer"]')
          .count();
        const hasTabs = await page.locator('.md-tabs').isVisible().catch(() => false);
        expect(hasHamburger > 0 || hasTabs, 'No nav mechanism on mobile').toBeTruthy();
      } else {
        await expect(page.locator('.md-tabs')).toBeVisible();
      }
    });

    test('body has no horizontal overflow', async ({ page }) => {
      await gotoReady(page, path);
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(overflow, `Horizontal overflow detected on ${path}`).toBe(false);
    });

    test('hero or first content block is visible', async ({ page }) => {
      await gotoReady(page, path);
      const hasHero = await page
        .locator('.hero-section, .hero-content, .md-content__inner h1')
        .first()
        .isVisible()
        .catch(() => false);
      expect(hasHero, `No visible primary content section on ${path}`).toBeTruthy();
    });

    test('smoke screenshot', async ({ page }, testInfo) => {
      await gotoReady(page, path);
      await page.waitForLoadState('load');
      await page.evaluate(async () => {
        if ('fonts' in document) {
          await (document as Document & { fonts: FontFaceSet }).fonts.ready;
        }
      });
      await page.waitForTimeout(300);
      const slug = path === '/' ? 'home' : path.replace(/\//g, '-').replace(/^-|-$/g, '');
      await page.screenshot({
        path: `test-results/screenshots-smoke/${testInfo.project.name}/${slug}.png`,
        fullPage: true,
      });
    });
  });
}
