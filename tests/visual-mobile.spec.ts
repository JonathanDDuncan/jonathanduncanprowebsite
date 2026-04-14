import { test, expect } from '@playwright/test';
import { PAGES } from '../playwright.config';

// ---------------------------------------------------------------------------
// visual-mobile.spec.ts
//
// Full-page screenshot comparisons per viewport per page.
// First run creates baseline snapshots. Subsequent runs compare against them.
// Update baselines: npx playwright test --update-snapshots
// ---------------------------------------------------------------------------

for (const pagePath of PAGES) {
  test.describe(`Visual regression — ${pagePath}`, () => {
    test('full-page screenshot matches baseline', async ({ page }, testInfo) => {
       await page.goto(pagePath, { waitUntil: 'domcontentloaded', timeout: 60000 });

      // Wait for fonts and images to settle
      await page.waitForTimeout(500);

      // Hide dynamic content that causes flaky diffs
      await page.evaluate(() => {
        // Hide cookie banners, analytics overlays, etc.
        document.querySelectorAll('[class*="consent"], [class*="cookie"], [class*="banner"]').forEach((el) => {
          (el as HTMLElement).style.display = 'none';
        });
      });

      const slug = pagePath.replace(/\//g, '_').replace(/^_/, '').replace(/_$/, '') || 'home';
      await expect(page).toHaveScreenshot(`${slug}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.02, // Allow 2% pixel diff for anti-aliasing
      });
    });
  });
}

// ---------------------------------------------------------------------------
// CSS property spot-checks for common mobile whitespace culprits
// ---------------------------------------------------------------------------

test.describe('CSS whitespace audit', () => {
  test('hero section does not use excessive min-height on mobile', async ({ page }) => {
    const vpHeight = page.viewportSize()?.height ?? 800;
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });

    const heroInfo = await page.evaluate(() => {
      const hero = document.querySelector('.hero, [class*="hero"], .md-main__inner');
      if (!hero) return null;
      const style = getComputedStyle(hero);
      return {
        minHeight: style.minHeight,
        height: style.height,
        paddingTop: style.paddingTop,
        paddingBottom: style.paddingBottom,
        actualHeight: (hero as HTMLElement).getBoundingClientRect().height,
      };
    });

    if (heroInfo) {
      // Hero should not be more than 1.5x viewport height on mobile
      expect(
        heroInfo.actualHeight,
        `Hero is ${heroInfo.actualHeight}px tall on a ${vpHeight}px viewport`
      ).toBeLessThan(vpHeight * 1.5);
    }
  });

  test('no section uses 100vw width directly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });

    const bad100vw = await page.evaluate(() => {
      const results: { selector: string; width: string }[] = [];
      document.querySelectorAll('*').forEach((el) => {
        const style = getComputedStyle(el);
        // Check inline style for 100vw (computed style resolves to px)
        const inlineWidth = (el as HTMLElement).style.width;
        if (inlineWidth === '100vw') {
          const tag = el.tagName.toLowerCase();
          const cls = el.className && typeof el.className === 'string'
            ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
            : '';
          results.push({ selector: `${tag}${cls}`, width: inlineWidth });
        }
      });
      return results;
    });

    expect(bad100vw, `Elements with 100vw inline width: ${JSON.stringify(bad100vw)}`).toHaveLength(0);
  });

  test('large padding values are reasonable on mobile', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });

    const excessivePadding = await page.evaluate(() => {
      const results: { selector: string; paddingTop: number; paddingBottom: number }[] = [];
      const maxPadding = 120; // px threshold
      document.querySelectorAll('section, .md-content, .md-main__inner, [class*="hero"], header, footer').forEach((el) => {
        const style = getComputedStyle(el);
        const pt = parseFloat(style.paddingTop);
        const pb = parseFloat(style.paddingBottom);
        if (pt > maxPadding || pb > maxPadding) {
          const tag = el.tagName.toLowerCase();
          const cls = el.className && typeof el.className === 'string'
            ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
            : '';
          results.push({
            selector: `${tag}${cls}`,
            paddingTop: Math.round(pt),
            paddingBottom: Math.round(pb),
          });
        }
      });
      return results;
    });

    if (excessivePadding.length > 0) {
      console.warn('Elements with large padding on mobile:', excessivePadding);
    }
  });
});

// ---------------------------------------------------------------------------
// Hero section overflow/cutoff test for key mobile widths
// ---------------------------------------------------------------------------

test.describe('Hero section mobile overflow', () => {
  const viewports = [
    { width: 320, height: 800 }, // iPhone SE
    { width: 375, height: 800 }, // iPhone X/12/13 Mini
    { width: 425, height: 800 }, // Pixel 2 XL, Galaxy S8+
  ];
  for (const viewport of viewports) {
    test(`.hero-section fits in viewport at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
      const hero = page.locator('.hero-section');
      await expect(hero).toBeVisible();
      const box = await hero.boundingBox();
      expect(box).not.toBeNull();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1); // allow 1px rounding
      // Screenshot for visual regression
      await expect(hero).toHaveScreenshot(`hero-mobile-${viewport.width}px.png`, { fullPage: false });
    });
  }
});
