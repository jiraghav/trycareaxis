import { test, expect } from '@playwright/test';

const routes = [
  '/',
  '/platform',
  '/verticals',
  '/pi360',
  '/features',
  '/pricing',
  '/demo',
  '/contact',
  '/lawyer-portal',
  '/affiliate-portal',
];

for (const route of routes) {
  test(`visual snapshot ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page).toHaveScreenshot(
      `${route === '/' ? 'home' : route.slice(1)}.png`,
      { fullPage: true, animations: 'disabled' },
    );
  });
}
