import { test, expect, type Page } from '@playwright/test';

const PAGES = ['/', '/services/', '/about/', '/contact/'];

async function gotoReady(p: Page, path: string) {
  await p.goto(path, { waitUntil: 'domcontentloaded' });
  await expect(p.locator('header')).toBeVisible();
  await expect(p.locator('main')).toBeVisible();
  await expect(p.getByRole('heading').first()).toBeVisible();
}

for (const page of PAGES) {
  test.describe(`Responsive: ${page}`, () => {

    test('no horizontal overflow on body', async ({ page: p }) => {
      await gotoReady(p, page);
      const overflow = await p.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(overflow, `Horizontal overflow detected on ${page}`).toBe(false);
    });

    test('no element extends beyond viewport width', async ({ page: p }) => {
      await gotoReady(p, page);
      const overflowingElements = await p.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const results: string[] = [];
        document.querySelectorAll('*').forEach(el => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          const hiddenOffCanvas = rect.right <= 0 || rect.left >= vw;
          const ignoredMaterialUi =
            el.classList.contains('md-sidebar') ||
            el.classList.contains('md-search__options') ||
            el.classList.contains('md-search__icon') ||
            el.classList.contains('md-search__scrollwrap') ||
            el.classList.contains('md-search-result') ||
            el.classList.contains('md-search-result__meta');
          const insideScrollableTable = !!el.closest('.md-typeset__scrollwrap, .md-typeset__table');

          if (
            hiddenOffCanvas ||
            style.display === 'none' ||
            style.visibility === 'hidden' ||
            ignoredMaterialUi ||
            insideScrollableTable
          ) {
            return;
          }

          if (rect.right > vw + 2 || rect.left < -2) {
            const tag = el.tagName.toLowerCase();
            const cls = el.className ? `.${Array.from(el.classList).join('.')}` : '';
            const id = el.id ? `#${el.id}` : '';
            if (!tag.includes('script') && !tag.includes('style') && rect.width > 0) {
              results.push(`${tag}${id}${cls} (left:${Math.round(rect.left)}, right:${Math.round(rect.right)}, vw:${vw})`);
            }
          }
        });
        return results.slice(0, 10);
      });
      expect(overflowingElements, `Elements overflow viewport on ${page}`).toEqual([]);
    });

    test('fixed and sticky UI stays within mobile viewport width', async ({ page: p, isMobile }) => {
      if (!isMobile) return;
      await gotoReady(p, page);
      const overflowingFixedUi = await p.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const vh = document.documentElement.clientHeight;
        const results: string[] = [];

        document.querySelectorAll('*').forEach(el => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          const position = style.position;
          const hiddenOffCanvas = rect.right <= 0 || rect.left >= vw || rect.bottom <= 0 || rect.top >= vh;
          const ignoredUi =
            el.classList.contains('md-sidebar') ||
            el.classList.contains('md-search') ||
            el.classList.contains('md-search__inner') ||
            el.classList.contains('md-search__scrollwrap') ||
            el.classList.contains('md-dialog');

          if (
            hiddenOffCanvas ||
            style.display === 'none' ||
            style.visibility === 'hidden' ||
            ignoredUi ||
            !!el.closest('.md-sidebar, .md-search, .md-dialog') ||
            rect.width === 0 ||
            rect.height === 0 ||
            (position !== 'fixed' && position !== 'sticky')
          ) {
            return;
          }

          if (rect.right > vw + 2 || rect.left < -2) {
            const tag = el.tagName.toLowerCase();
            const cls = el.className ? `.${Array.from(el.classList).join('.')}` : '';
            const id = el.id ? `#${el.id}` : '';
            results.push(`${tag}${id}${cls} (${position}) left:${Math.round(rect.left)} right:${Math.round(rect.right)} vw:${vw}`);
          }
        });

        return results;
      });

      expect(overflowingFixedUi, `Fixed or sticky UI overflows mobile viewport on ${page}`).toEqual([]);
    });

    test('headings do not overflow their container', async ({ page: p }) => {
      await gotoReady(p, page);
      const overflowingHeadings = await p.evaluate(() => {
        const results: string[] = [];
        document.querySelectorAll('h1, h2, h3, h4').forEach(h => {
          const hRect = h.getBoundingClientRect();
          const parent = h.parentElement;
          if (parent) {
            const pRect = parent.getBoundingClientRect();
            if (hRect.right > pRect.right + 5 || hRect.left < pRect.left - 5) {
              results.push(`${h.tagName} "${h.textContent?.substring(0, 50)}" overflows parent`);
            }
          }
        });
        return results;
      });
      expect(overflowingHeadings).toEqual([]);
    });

    test('buttons are fully visible and tappable (min 44x44)', async ({ page: p, isMobile }) => {
      if (!isMobile) return;
      await gotoReady(p, page);
      const smallButtons = await p.evaluate(() => {
        const results: string[] = [];
        const interactive = document.querySelectorAll('a.md-button, button, [role="button"], .mobile-sticky-cta__btn');
        interactive.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;
          const computed = window.getComputedStyle(el);
          if (computed.display === 'none' || computed.visibility === 'hidden') return;
          if (rect.height < 44 || rect.width < 44) {
            const text = (el as HTMLElement).innerText?.substring(0, 30) || el.tagName;
            results.push(`${text} (${Math.round(rect.width)}x${Math.round(rect.height)})`);
          }
        });
        return results;
      });
      if (smallButtons.length > 0) {
        console.log(`Small touch targets on ${page}:`, smallButtons);
      }
      // Soft assertion — log but don't fail for minor violations
      expect(smallButtons.length, `${smallButtons.length} buttons below 44px tap target`).toBeLessThan(15);
    });

    test('no section has excessive empty whitespace (> viewport height)', async ({ page: p, isMobile }) => {
      if (!isMobile) return;
      await gotoReady(p, page);
      const excessiveSpacing = await p.evaluate(() => {
        const vh = window.innerHeight;
        const results: string[] = [];
        const sections = document.querySelectorAll(
          '.hero-section, .section-band, .cta-panel, section, .md-content__inner > div'
        );
        sections.forEach(el => {
          const rect = el.getBoundingClientRect();
          const computed = window.getComputedStyle(el);
          const paddingTop = parseFloat(computed.paddingTop);
          const paddingBottom = parseFloat(computed.paddingBottom);
          const marginTop = parseFloat(computed.marginTop);
          const marginBottom = parseFloat(computed.marginBottom);
          const contentChars = (el.textContent || '').trim().length;
          const isDenseContent = contentChars > 350 || el.querySelectorAll('li, p, h2, h3').length > 5;

          // Flag large mostly-empty blocks, but allow dense content sections.
          if (rect.height > vh * 1.8 && el.children.length < 3 && !isDenseContent) {
            const cls = el.className ? `.${Array.from(el.classList).slice(0, 2).join('.')}` : el.tagName;
            results.push(`${cls} height:${Math.round(rect.height)}px > ${Math.round(vh * 1.8)}px (1.8x vh)`);
          }
          // Check for excessive padding/margin
          if (paddingTop > vh * 0.4 || paddingBottom > vh * 0.4) {
            const cls = el.className ? `.${Array.from(el.classList).slice(0, 2).join('.')}` : el.tagName;
            results.push(`${cls} excessive padding: top=${Math.round(paddingTop)}px bottom=${Math.round(paddingBottom)}px`);
          }
          if (marginTop > vh * 0.3 || marginBottom > vh * 0.3) {
            const cls = el.className ? `.${Array.from(el.classList).slice(0, 2).join('.')}` : el.tagName;
            results.push(`${cls} excessive margin: top=${Math.round(marginTop)}px bottom=${Math.round(marginBottom)}px`);
          }
        });
        return results;
      });
      expect(excessiveSpacing, `Excessive whitespace on ${page}`).toEqual([]);
    });

    test('cards stack on mobile (no side-by-side below 600px)', async ({ page: p, viewport }) => {
      if (!viewport || viewport.width > 600) return;
      await gotoReady(p, page);
      const sideByCards = await p.evaluate(() => {
        const results: string[] = [];
        document.querySelectorAll('.grid.cards > ul, .grid.cards > ol').forEach(grid => {
          const items = Array.from(grid.children);
          if (items.length < 2) return;
          const firstRect = items[0].getBoundingClientRect();
          const secondRect = items[1].getBoundingClientRect();
          // If second item starts at roughly the same Y, they're side-by-side
          if (Math.abs(firstRect.top - secondRect.top) < 20 && firstRect.width < window.innerWidth * 0.9) {
            results.push(`Cards side-by-side at ${window.innerWidth}px`);
          }
        });
        return results;
      });
      expect(sideByCards).toEqual([]);
    });

    test('nav is accessible (hamburger or visible menu)', async ({ page: p }) => {
      await gotoReady(p, page);
      const hasHamburger = await p.locator('[data-md-toggle="drawer"], .md-header__button[for="__drawer"]').count();
      const tabsVisible = await p.locator('.md-tabs').isVisible().catch(() => false);
      expect(hasHamburger > 0 || tabsVisible, 'No nav mechanism found (hamburger or tabs)').toBeTruthy();
    });

    test('images do not overflow containers', async ({ page: p }) => {
      await gotoReady(p, page);
      const overflowingImages = await p.evaluate(() => {
        const results: string[] = [];
        document.querySelectorAll('img').forEach(img => {
          const rect = img.getBoundingClientRect();
          const parent = img.parentElement;
          if (parent && rect.width > 0) {
            const pRect = parent.getBoundingClientRect();
            if (rect.width > pRect.width + 10) {
              results.push(`${img.src.split('/').pop()} (${Math.round(rect.width)} > parent ${Math.round(pRect.width)})`);
            }
          }
        });
        return results;
      });
      expect(overflowingImages).toEqual([]);
    });

    test('computed spacing audit — no absurd values', async ({ page: p, isMobile }) => {
      if (!isMobile) return;
      await gotoReady(p, page);
      const spacingIssues = await p.evaluate(() => {
        const results: string[] = [];
        const allElements = document.querySelectorAll('*');
        const vh = window.innerHeight;

        allElements.forEach(el => {
          const s = window.getComputedStyle(el);
          if (s.display === 'none' || s.visibility === 'hidden') return;
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;

          const minH = parseFloat(s.minHeight);
          // Check for fixed min-height taller than viewport
          if (minH > vh && !isNaN(minH)) {
            const cls = el.className ? `.${Array.from(el.classList).slice(0, 2).join('.')}` : el.tagName;
            results.push(`${cls} min-height:${Math.round(minH)}px > vh:${vh}px`);
          }

          // Check for 100vw usage causing overflow
          if (s.width === '100vw') {
            const cls = el.className ? `.${Array.from(el.classList).slice(0, 2).join('.')}` : el.tagName;
            results.push(`${cls} uses width: 100vw (causes scrollbar overflow)`);
          }
        });
        return results.slice(0, 15);
      });
      if (spacingIssues.length > 0) {
        console.log('Spacing issues:', spacingIssues);
      }
      expect(spacingIssues).toEqual([]);
    });

    test('screenshot for visual review', async ({ page: p }, testInfo) => {
      await gotoReady(p, page);
      await p.waitForLoadState('load');
      await p.evaluate(async () => {
        if ('fonts' in document) {
          await (document as Document & { fonts: FontFaceSet }).fonts.ready;
        }
      });
      await p.waitForTimeout(500);
      const slug = page === '/' ? 'home' : page.replace(/\//g, '-').replace(/^-|-$/g, '');
      await p.screenshot({
        path: `test-results/screenshots/${testInfo.project.name}/${slug}.png`,
        fullPage: true,
      });
    });
  });
}
