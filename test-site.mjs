import { chromium } from 'playwright';

const BASE = 'http://localhost:5174';

const routes = [
  { path: '/', name: 'Home', check: ['YOUR IDEA', 'PRINTED'] },
  { path: '/order', name: 'Order', check: ['Submit Print Job'] },
  { path: '/gallery', name: 'Gallery', check: ['Print Gallery'] },
  { path: '/pricing', name: 'Pricing', check: ['Material Pricing'] },
  { path: '/track', name: 'Track', check: ['Track Your Print'] },
  { path: '/about', name: 'About', check: ['Underwater AI'] },
  { path: '/privacy', name: 'Privacy', check: ['Privacy Policy'] },
  { path: '/terms', name: 'Terms', check: ['Terms of Service'] },
];

async function testSite() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  let errors = [];
  let passed = 0;

  // Collect console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  for (const route of routes) {
    consoleErrors.length = 0;

    try {
      const response = await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle', timeout: 15000 });

      if (!response || response.status() >= 400) {
        errors.push(`  FAIL ${route.name}: HTTP ${response?.status() || 'no response'}`);
        continue;
      }

      // Wait for content
      await page.waitForTimeout(1000);

      const bodyText = await page.textContent('body');

      let routeOk = true;
      for (const text of route.check) {
        if (!bodyText.includes(text)) {
          errors.push(`  FAIL ${route.name}: missing "${text}"`);
          routeOk = false;
        }
      }

      // Check for critical console errors (ignore Three.js WebGL warnings)
      const criticalErrors = consoleErrors.filter(e =>
        !e.includes('WebGL') &&
        !e.includes('THREE') &&
        !e.includes('deprecated') &&
        !e.includes('favicon') &&
        !e.includes('404')
      );

      if (criticalErrors.length > 0) {
        errors.push(`  WARN ${route.name}: console errors: ${criticalErrors.slice(0, 2).join('; ')}`);
      }

      if (routeOk) {
        passed++;
        console.log(`  PASS ${route.name} (${route.path})`);
      }
    } catch (err) {
      errors.push(`  FAIL ${route.name}: ${err.message.split('\n')[0]}`);
    }
  }

  // Test navigation links
  try {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    const navLinks = await page.$$eval('.nav-link, .navbar-links a', links => links.map(l => l.textContent));
    console.log(`  PASS Navbar: found ${navLinks.length} nav links`);
    passed++;
  } catch (err) {
    errors.push(`  FAIL Navbar: ${err.message.split('\n')[0]}`);
  }

  // Test mobile responsiveness
  try {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(500);
    const mobileOk = await page.isVisible('.navbar-burger');
    if (mobileOk) {
      console.log('  PASS Mobile responsive (burger menu visible)');
      passed++;
    } else {
      errors.push('  FAIL Mobile: burger menu not visible at 375px');
    }
  } catch (err) {
    errors.push(`  FAIL Mobile: ${err.message.split('\n')[0]}`);
  }

  // Take screenshot
  try {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshot-home.png', fullPage: true });
    console.log('  Screenshot saved: screenshot-home.png');
  } catch (err) {
    console.log(`  Screenshot failed: ${err.message.split('\n')[0]}`);
  }

  await browser.close();

  console.log('\n--- Results ---');
  console.log(`${passed} passed, ${errors.length} issues`);
  if (errors.length > 0) {
    console.log('\nIssues:');
    errors.forEach(e => console.log(e));
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

testSite().catch(err => {
  console.error('Test runner failed:', err);
  process.exit(1);
});
