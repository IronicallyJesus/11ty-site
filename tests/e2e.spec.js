const { test, expect } = require('@playwright/test');

test.describe('11ty-site — v3 redesign e2e', () => {

  // ── Helpers ──────────────────────────────────────────────────────────────

  const desktop = { width: 1280, height: 720 };
  const mobile  = { width: 375, height: 812 };

  // Desktop nav selectors — Resume is standalone (not inside .nav-links)
  const navLink = (href) => `.nav-links a.nav-link[href="${href}"]`;
  const resumeBtn = 'header a.btn[href="/resume"]';

  // ── Homepage ─────────────────────────────────────────────────────────────

  test.describe('Homepage', () => {

    test('has correct title and hero section', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveTitle(/Network Engineer/);
      await expect(page.locator('h1')).toContainText("Networks don't care");
    });

    test('shows skills & certs section', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#skills h2.section-heading')).toContainText('Skills & Certs');
    });

    test('shows latest blog posts section', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#blog h2.section-heading')).toContainText('Latest Posts');
    });

    test('shows featured projects section', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#projects h2.section-heading')).toContainText('Featured Projects');
    });

    test('shows contact section', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#contact h2.section-heading')).toContainText('Contact');
      // Resume button exists in header
      await expect(page.locator(resumeBtn)).toBeVisible();
    });
  });

  // ── Navigation ───────────────────────────────────────────────────────────

  test.describe('Navigation', () => {

    test('Blog link navigates to /blog with correct heading', async ({ page }) => {
      await page.setViewportSize(desktop);
      await page.goto('/');
      await page.locator(navLink('/blog')).click();
      await expect(page).toHaveURL(/\/blog/);
      await expect(page.locator('h1')).toContainText('Insights & Articles');
    });

    test('About link navigates to /about', async ({ page }) => {
      await page.setViewportSize(desktop);
      await page.goto('/');
      await page.locator(navLink('/about')).click();
      await expect(page).toHaveURL(/\/about/);
      await expect(page.locator('h1')).toContainText('About');
      await expect(page.locator('h2.section-heading')).toContainText('Career Timeline');
    });

    test('Projects link navigates to /projects', async ({ page }) => {
      await page.setViewportSize(desktop);
      await page.goto('/');
      await page.locator(navLink('/projects')).click();
      await expect(page).toHaveURL(/\/projects/);
      await expect(page.locator('h1')).toContainText('Projects');
    });

    test('Resume button navigates to /resume', async ({ page }) => {
      await page.goto('/');
      await page.locator(resumeBtn).click();
      await expect(page).toHaveURL(/\/resume/);
      await expect(page.locator('h1')).toContainText('Resume');
      // PDF download link exists
      await expect(page.locator('a[download][href*="jesus.pdf"]')).toBeAttached();
    });
  });

  // ── Redirects ────────────────────────────────────────────────────────────

  test.describe('Redirects', () => {

    test('/experience redirects 301 to /about', async ({ page }) => {
      // Use request context to avoid auto-following redirects
      const response = await page.request.get('/experience', { maxRedirects: 0 });
      expect(response.status()).toBe(301);
      expect(response.headers()['location']).toContain('/about');
    });
  });

  // ── Dark mode toggle ─────────────────────────────────────────────────────

  test.describe('Dark mode toggle', () => {

    test.beforeEach(async ({ page }) => {
      // Force dark default so we control the initial state
      // (headless Chromium reports prefers-color-scheme:light)
      await page.goto('/');
      await page.evaluate(() => localStorage.setItem('theme', 'dark'));
      await page.reload();
    });

    test('toggles light-theme class on body', async ({ page }) => {
      const body = page.locator('body');
      const toggle = page.locator('#theme-toggle');

      // Should start without light-theme (dark is default)
      await expect(body).not.toHaveClass(/light-theme/);

      // Toggle on
      await toggle.click();
      await expect(body).toHaveClass(/light-theme/);

      // Toggle off
      await toggle.click();
      await expect(body).not.toHaveClass(/light-theme/);
    });

    test('persists theme preference across page reloads', async ({ page }) => {
      const body = page.locator('body');
      const toggle = page.locator('#theme-toggle');

      // Toggle to light mode
      await toggle.click();
      await expect(body).toHaveClass(/light-theme/);

      // Reload — preference persists via localStorage
      await page.reload();
      await expect(body).toHaveClass(/light-theme/);

      // Toggle back to dark
      await toggle.click();
      await expect(body).not.toHaveClass(/light-theme/);
    });
  });

  // ── Mobile responsive ────────────────────────────────────────────────────

  test.describe('Mobile responsive', () => {

    test('mobile menu toggles via hamburger button', async ({ page }) => {
      await page.setViewportSize(mobile);
      await page.goto('/');

      const menuBtn = page.locator('#mobile-menu-btn');
      const mobileMenu = page.locator('#mobile-menu');

      // Menu starts hidden
      await expect(mobileMenu).toBeHidden({ timeout: 3000 });

      // Open menu
      await menuBtn.click();
      await expect(mobileMenu).toBeVisible({ timeout: 3000 });

      // Blog link in mobile menu navigates
      await page.locator('#mobile-menu a[href="/blog"]').click();
      await expect(page).toHaveURL(/\/blog/);
    });
  });

  // ── SEO & metadata ───────────────────────────────────────────────────────

  test.describe('SEO & metadata', () => {

    test('homepage has proper meta tags', async ({ page }) => {
      await page.goto('/');

      // Canonical
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute('href', /jesus\.twk95\.com/);

      // OG tags
      const ogTitle = page.locator('meta[property="og:title"]');
      await expect(ogTitle).toHaveAttribute('content', /Network Engineer/);

      const ogDesc = page.locator('meta[property="og:description"]');
      await expect(ogDesc).toHaveAttribute('content', /Infrastructure/);

      // Twitter card — uses `property` not `name`
      const twitterCard = page.locator('meta[property="twitter:card"]');
      await expect(twitterCard).toHaveAttribute('content', 'summary_large_image');
    });
  });

  // ── API endpoints ────────────────────────────────────────────────────────

  test.describe('API endpoints', () => {

    test('GET /api/views returns JSON with all counts', async ({ page }) => {
      const response = await page.goto('/api/views');
      expect(response?.status()).toBe(200);
      const body = await response?.json();
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty('home');
    });

    test('POST /api/views/:slug increments count', async ({ page }) => {
      const slug = `inc-test-${Date.now()}`;

      const getRes = await page.request.get(`/api/views/${slug}`);
      expect(getRes.status()).toBe(200);
      const before = await getRes.json();

      const postRes = await page.request.post(`/api/views/${slug}`);
      expect(postRes.status()).toBe(200);
      const after = await postRes.json();

      expect(after.count).toBe((before.count || 0) + 1);
    });

    test('POST /api/likes/:slug and DELETE /api/likes/:slug work', async ({ page }) => {
      const slug = `like-test-${Date.now()}`;

      const getRes = await page.request.get(`/api/likes/${slug}`);
      const initial = await getRes.json();

      // Like
      const likeRes = await page.request.post(`/api/likes/${slug}`);
      expect(likeRes.status()).toBe(200);
      const liked = await likeRes.json();
      expect(liked.count).toBe((initial.count || 0) + 1);

      // Unlike
      const unlikeRes = await page.request.delete(`/api/likes/${slug}`);
      expect(unlikeRes.status()).toBe(200);
      const unliked = await unlikeRes.json();
      expect(unliked.count).toBe(Math.max((initial.count || 0), 0));
    });

    test('GET /api/views/:slug returns count per slug', async ({ page }) => {
      const slug = `count-test-${Date.now()}`;
      const response = await page.request.get(`/api/views/${slug}`);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('count');
    });

    test('API rejects invalid slugs with 400', async ({ page }) => {
      const response = await page.request.get('/api/views/INVALID');
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body).toHaveProperty('error');
    });
  });

  // ── 404 page ─────────────────────────────────────────────────────────────

  test.describe('404 page', () => {

    test('nonexistent routes redirect to /404.html', async ({ page }) => {
      // Use request context to capture the redirect (not auto-follow)
      const response = await page.request.get('/nonexistent-page-xyz', { maxRedirects: 0 });
      expect(response.status()).toBe(302);
      expect(response.headers()['location']).toContain('/404.html');
    });
  });
});
