const { test, expect } = require('@playwright/test');

test.describe('Website E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Assuming baseURL is set to 'http://localhost:8080' in playwright.config.js
        await page.goto('/');
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
        const body = page.locator('body');

        // Ensure we start in a known state (assuming default is dark/no class)
        // If the site persists state, you might need to clear localStorage in beforeEach
        await expect(body).not.toHaveClass(/light-theme/);

        // Perform toggle
        await toggle.click();
        await expect(body).toHaveClass(/light-theme/);
        
        // Toggle back
        await toggle.click();
        await expect(body).not.toHaveClass(/light-theme/);
    });
});
