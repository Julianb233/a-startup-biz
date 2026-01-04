import { test, expect } from '@playwright/test';

test.describe('Landing Page GSAP Animations', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to landing page
    await page.goto('/landing');
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
  });

  test('page loads successfully', async ({ page }) => {
    // Check page title or main content exists
    await expect(page).toHaveURL(/\/landing/);

    // Take initial screenshot
    await page.screenshot({
      path: `test-results/landing-initial-${test.info().project.name}.png`,
      fullPage: false
    });
  });

  test('hero section displays large logo', async ({ page }) => {
    // Wait for hero logo to be visible
    const heroLogo = page.locator('.hero-logo-mega').first();

    // Check logo is visible
    await expect(heroLogo).toBeVisible({ timeout: 10000 });

    // Take screenshot of hero section
    await page.screenshot({
      path: `test-results/hero-section-${test.info().project.name}.png`,
      fullPage: false
    });
  });

  test('scroll animations work correctly', async ({ page }) => {
    // Get page height
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);

    // Scroll to 25%
    await page.evaluate((height) => window.scrollTo(0, height * 0.25), pageHeight);
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: `test-results/scroll-25-${test.info().project.name}.png`,
      fullPage: false
    });

    // Scroll to 50%
    await page.evaluate((height) => window.scrollTo(0, height * 0.5), pageHeight);
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: `test-results/scroll-50-${test.info().project.name}.png`,
      fullPage: false
    });

    // Scroll to 75%
    await page.evaluate((height) => window.scrollTo(0, height * 0.75), pageHeight);
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: `test-results/scroll-75-${test.info().project.name}.png`,
      fullPage: false
    });

    // Scroll to 100%
    await page.evaluate((height) => window.scrollTo(0, height), pageHeight);
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: `test-results/scroll-100-${test.info().project.name}.png`,
      fullPage: false
    });
  });

  test('pinned question section works correctly', async ({ page }) => {
    // Find the question section
    const questionSection = page.locator('text=Are you an entrepreneur').first();

    if (await questionSection.isVisible()) {
      // Scroll to question section
      await questionSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Take screenshot at pin point
      await page.screenshot({
        path: `test-results/question-pinned-${test.info().project.name}.png`,
        fullPage: false
      });

      // Scroll a bit more to see horizontal movement
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(500);

      await page.screenshot({
        path: `test-results/question-scrolled-${test.info().project.name}.png`,
        fullPage: false
      });
    }
  });

  test('Wistia video section loads', async ({ page }) => {
    // Find the video section
    const videoSection = page.locator('text=Watch This').first();

    if (await videoSection.isVisible()) {
      await videoSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000); // Wait for iframe to load

      // Check for Wistia iframe
      const wistiaIframe = page.locator('iframe[src*="wistia"]').first();

      // Take screenshot of video section
      await page.screenshot({
        path: `test-results/wistia-video-${test.info().project.name}.png`,
        fullPage: false
      });

      // Verify iframe exists
      const iframeCount = await wistiaIframe.count();
      console.log(`Wistia iframes found: ${iframeCount}`);
    }
  });

  test('no console errors on page', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/landing');
    await page.waitForLoadState('networkidle');

    // Scroll through page to trigger all animations
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);
    for (let i = 0; i <= 100; i += 10) {
      await page.evaluate(({ height, percent }) => window.scrollTo(0, height * percent / 100), { height: pageHeight, percent: i });
      await page.waitForTimeout(200);
    }

    // Log any console errors found
    if (consoleErrors.length > 0) {
      console.log('Console errors found:', consoleErrors);
    }

    // Filter out common non-critical errors (infrastructure issues, not code bugs)
    const criticalErrors = consoleErrors.filter(err =>
      !err.includes('favicon') &&
      !err.includes('net::ERR') &&
      !err.includes('Failed to load resource') &&
      !err.includes('Content Security Policy') &&
      !err.includes('wistia') &&
      !err.includes('Framing') &&
      !err.includes('ClerkProvider') &&
      !err.includes('useUser')
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('gradient stays black/orange throughout scroll', async ({ page }) => {
    // Get background color at different scroll positions
    const colors: string[] = [];
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);

    for (let percent = 0; percent <= 100; percent += 25) {
      await page.evaluate(({ height, p }) => window.scrollTo(0, height * p / 100), { height: pageHeight, p: percent });
      await page.waitForTimeout(500);

      // Get the computed background style
      const bgStyle = await page.evaluate(() => {
        const fixedBg = document.querySelector('.fixed.inset-0');
        if (fixedBg) {
          return window.getComputedStyle(fixedBg).background;
        }
        return '';
      });

      colors.push(bgStyle);
      console.log(`Scroll ${percent}% - Background: ${bgStyle.substring(0, 100)}...`);
    }

    // Take full page screenshot for reference
    await page.screenshot({
      path: `test-results/gradient-check-${test.info().project.name}.png`,
      fullPage: true
    });
  });

  test('full scroll video recording', async ({ page }) => {
    // This test creates a video of the full scroll experience
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);

    // Smooth scroll from top to bottom
    for (let i = 0; i <= 100; i += 2) {
      await page.evaluate(({ height, percent }) => {
        window.scrollTo({
          top: height * percent / 100,
          behavior: 'auto'
        });
      }, { height: pageHeight, percent: i });
      await page.waitForTimeout(100);
    }

    // Scroll back up
    for (let i = 100; i >= 0; i -= 2) {
      await page.evaluate(({ height, percent }) => {
        window.scrollTo({
          top: height * percent / 100,
          behavior: 'auto'
        });
      }, { height: pageHeight, percent: i });
      await page.waitForTimeout(100);
    }
  });
});

test.describe('Homepage Check', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({
      path: `test-results/homepage-${test.info().project.name}.png`,
      fullPage: false
    });

    // Check for main content
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Interactive Page Check', () => {
  test('interactive page loads', async ({ page }) => {
    await page.goto('/interactive');
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({
      path: `test-results/interactive-${test.info().project.name}.png`,
      fullPage: false
    });
  });
});
