const { test, expect } = require('@playwright/test');

test.describe('Website E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8080');
    });

    test('Homepage has correct title and hero section', async ({ page }) => {
        await expect(page).toHaveTitle(/Network Engineer/);
        await expect(page.locator('h1')).toContainText('Resilient Networks');
    });

    test('Navigation to Blog works', async ({ page }) => {
        // Click 'Blog' in desktop nav (hidden on mobile, so we might need to handle viewport)
        // For simplicity, we'll force desktop size or use the URL
        await page.setViewportSize({ width: 1280, height: 720 });
        await page.click('nav a[href="/blog"]');
        await expect(page).toHaveURL(/\/blog/);
        await expect(page.locator('h1.page-title')).toContainText('Insights & Articles');
    });

    test('Navigation to Experience works', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 720 });
        await page.click('nav a[href="/experience"]');
        await expect(page).toHaveURL(/\/experience/);
        await expect(page.locator('h1.page-title')).toContainText('Professional Journey');
    });

    test('Dark mode toggle works', async ({ page }) => {
        // Click theme toggle
        const toggle = page.locator('#theme-toggle');

        // Check initial state (should be dark by default or based on system, but we force checking the class)
        // The script sets 'light-theme' class on body if light.

        const body = page.locator('body');
        const isLightInitially = await body.getAttribute('class').then(c => c.includes('light-theme'));

        await toggle.click();

        // Expect change
        if (isLightInitially) {
            await expect(body).not.toHaveClass(/light-theme/);
        } else {
            await expect(body).toHaveClass(/light-theme/);
        }
    });
});
