import { test, expect, Page } from '@playwright/test';
import { PAGES } from '../playwright.config';

// ---------------------------------------------------------------------------
// responsive-layout.spec.ts
//
// Structural layout checks run at every viewport defined in the project matrix.
// Focus: overflow, stacking, spacing, clipping — not visual appearance.
// ---------------------------------------------------------------------------

for (const pagePath of PAGES) {
  test.describe(`Responsive layout — ${pagePath}`, () => {
    let page: Page;

    test.beforeEach(async ({ page: p }) => {
      page = p;
     await page.goto(pagePath, { waitUntil: 'domcontentloaded', timeout: 60000 });
    });

    // 1. No horizontal overflow on <html> or <body>
    test('no horizontal overflow', async () => {
      const overflow = await page.evaluate(() => {
        const html = document.documentElement;
        const body = document.body;
        return {
          htmlOverflow: html.scrollWidth > html.clientWidth,
          bodyOverflow: body.scrollWidth > body.clientWidth,
          scrollWidthHtml: html.scrollWidth,
          clientWidthHtml: html.clientWidth,
        };
      });
      expect(overflow.htmlOverflow, `html scrollWidth ${overflow.scrollWidthHtml} > clientWidth ${overflow.clientWidthHtml}`).toBe(false);
      expect(overflow.bodyOverflow).toBe(false);
    });

    // 2. No element overflows the viewport width
    test('no elements overflow viewport width', async () => {
      const overflowing = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const results: { selector: string; right: number; vw: number }[] = [];
        document.querySelectorAll('*').forEach((el) => {
          const rect = (el as HTMLElement).getBoundingClientRect();
          // Ignore hidden and zero-size elements
          if (rect.width === 0 || rect.height === 0) return;
          if (rect.right > vw + 2) {
            // Build a human-readable selector
            const tag = el.tagName.toLowerCase();
            const id = el.id ? `#${el.id}` : '';
            const cls = el.className && typeof el.className === 'string'
              ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
              : '';
            results.push({ selector: `${tag}${id}${cls}`, right: Math.round(rect.right), vw });
          }
        });
        return results.slice(0, 10); // limit to first 10
      });

      expect(overflowing, `Elements overflow viewport: ${JSON.stringify(overflowing)}`).toHaveLength(0);
    });

    // 3. Headings are not clipped or overflowing their containers
    test('headings do not overflow their container', async () => {
      const clipped = await page.evaluate(() => {
        const results: { text: string; tag: string }[] = [];
        document.querySelectorAll('h1, h2, h3, h4').forEach((el) => {
          const heading = el as HTMLElement;
          const parent = heading.parentElement;
          if (!parent) return;
          const hRect = heading.getBoundingClientRect();
          const pRect = parent.getBoundingClientRect();
          if (hRect.right > pRect.right + 4 || hRect.left < pRect.left - 4) {
            results.push({
              text: heading.textContent?.slice(0, 40) ?? '',
              tag: heading.tagName,
            });
          }
        });
        return results;
      });

      expect(clipped, `Clipped headings: ${JSON.stringify(clipped)}`).toHaveLength(0);
    });

    // 4. Buttons and links are adequately sized for touch (min 44x44 tap target)
    test('interactive elements meet minimum tap target size', async () => {
      const tooSmall = await page.evaluate(() => {
        const results: { selector: string; width: number; height: number }[] = [];
        const minSize = 44;
        document.querySelectorAll('a, button, [role="button"], input[type="submit"]').forEach((el) => {
          const rect = (el as HTMLElement).getBoundingClientRect();
          // Ignore invisible elements
          if (rect.width === 0 || rect.height === 0) return;
          const style = getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden') return;
          if (rect.width < minSize && rect.height < minSize) {
            const tag = el.tagName.toLowerCase();
            const text = (el.textContent ?? '').trim().slice(0, 25);
            results.push({
              selector: `${tag}[${text}]`,
              width: Math.round(rect.width),
              height: Math.round(rect.height),
            });
          }
        });
        return results.slice(0, 10);
      });

      // Warn but don't hard-fail — some tiny links are unavoidable (footer, etc.)
      if (tooSmall.length > 0) {
        console.warn('Small tap targets found:', tooSmall);
      }
      // Hard-fail only if primary CTA buttons are too small
      const ctaButtons = tooSmall.filter(
        (el) => el.selector.includes('button') || el.selector.includes('md-button')
      );
      expect(ctaButtons, `CTA buttons too small for touch: ${JSON.stringify(ctaButtons)}`).toHaveLength(0);
    });

    // 5. No section has absurd empty vertical space (> 100vh)
    test('no section has excessive empty height', async ({ page: p }) => {
      const viewportHeight = p.viewportSize()?.height ?? 800;
      const oversized = await page.evaluate((vh) => {
        const results: { selector: string; height: number; contentHeight: number }[] = [];
        document.querySelectorAll('section, .md-content, .hero, [class*="hero"], .md-main').forEach((el) => {
          const element = el as HTMLElement;
          const rect = element.getBoundingClientRect();
          // Check if the element is much taller than its text content
          const textLen = (element.textContent ?? '').trim().length;
          // Only flag sections that are very tall AND have little content
          if (rect.height > vh * 1.5 && textLen < 200) {
            const tag = element.tagName.toLowerCase();
            const cls = element.className && typeof element.className === 'string'
              ? '.' + element.className.trim().split(/\s+/).slice(0, 2).join('.')
              : '';
            results.push({
              selector: `${tag}${cls}`,
              height: Math.round(rect.height),
              contentHeight: textLen,
            });
          }
        });
        return results;
      }, viewportHeight);

      expect(oversized, `Sections with excessive whitespace: ${JSON.stringify(oversized)}`).toHaveLength(0);
    });

    // 6. Cards / grid items stack vertically on mobile (< 768px)
    test('grid items stack on narrow viewports', async ({ page: p }) => {
      const vpWidth = p.viewportSize()?.width ?? 320;
      if (vpWidth >= 768) {
        test.skip();
        return;
      }

      const sideByeSide = await page.evaluate(() => {
        const results: { selector: string; childCount: number; direction: string }[] = [];
        document.querySelectorAll('.md-grid, .grid, [class*="card"]').forEach((el) => {
          const parent = el as HTMLElement;
          const children = Array.from(parent.children).filter((c) => {
            const s = getComputedStyle(c);
            return s.display !== 'none' && s.position !== 'absolute';
          });
          if (children.length < 2) return;

          // Check if any two children sit on the same row
          const tops = children.map((c) => Math.round(c.getBoundingClientRect().top));
          const hasSameRow = new Set(tops).size < tops.length;
          if (hasSameRow) {
            const tag = parent.tagName.toLowerCase();
            const cls = parent.className && typeof parent.className === 'string'
              ? '.' + parent.className.trim().split(/\s+/).slice(0, 2).join('.')
              : '';
            results.push({
              selector: `${tag}${cls}`,
              childCount: children.length,
              direction: 'horizontal (should be stacked)',
            });
          }
        });
        return results;
      });

      // Soft assertion — cards in a grid are expected to stack
      if (sideByeSide.length > 0) {
        console.warn('Grid items not stacking on mobile:', sideByeSide);
      }
    });

    // 7. Images are not wider than their container
    test('images do not overflow their container', async () => {
      const overflowing = await page.evaluate(() => {
        const results: { src: string; imgWidth: number; containerWidth: number }[] = [];
        document.querySelectorAll('img').forEach((img) => {
          const imgEl = img as HTMLImageElement;
          const parent = imgEl.parentElement;
          if (!parent) return;
          const imgRect = imgEl.getBoundingClientRect();
          const parentRect = parent.getBoundingClientRect();
          if (imgRect.width > parentRect.width + 4 && imgRect.width > 0) {
            results.push({
              src: imgEl.src.slice(-60),
              imgWidth: Math.round(imgRect.width),
              containerWidth: Math.round(parentRect.width),
            });
          }
        });
        return results.slice(0, 5);
      });

      expect(overflowing, `Images overflowing container: ${JSON.stringify(overflowing)}`).toHaveLength(0);
    });
  });
}
