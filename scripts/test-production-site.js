import { chromium } from '@playwright/test';

async function testProductionSite() {
  const targetUrl = 'https://dperry713.github.io/xmas/';
  console.log(`Starting production site audit for: ${targetUrl}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const failedRequests = [];
  const consoleErrors = [];
  const allRequests = [];

  page.on('response', (response) => {
    allRequests.push({ url: response.url(), status: response.status() });
    if (response.status() >= 400) {
      failedRequests.push({ url: response.url(), status: response.status() });
    }
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  try {
    // 1. Visit root URL and clean fresh storage
    console.log('Navigating to root URL...');
    const mainResponse = await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
    console.log(`Initial response status: ${mainResponse?.status()}`);

    // Wait a brief moment for assets and WebGL initialization
    await page.waitForTimeout(2000);

    // Clear storage for fresh test
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // 2. Validate clean first-visit storage defaults
    console.log('Validating fresh storage & initial defaults...');
    const appTitle = await page.locator('#appTitle').innerText();
    const progressCount = await page.locator('#progressCountText').innerText();
    console.log(`App title: "${appTitle}", Progress: "${progressCount}"`);

    if (progressCount !== '0 of 24') {
      throw new Error(`Expected "0 of 24" initial progress, got "${progressCount}"`);
    }

    // 3. Check for 404s or failed network requests (especially .ktx2 and textures)
    console.log(`Total network requests made: ${allRequests.length}`);
    const ktx2Requests = allRequests.filter(r => r.url.endsWith('.ktx2'));
    console.log(`KTX2 network requests: ${ktx2Requests.length}`);
    if (ktx2Requests.length > 0) {
      console.warn(`Warning: Found speculative KTX2 requests:`, ktx2Requests);
    }

    if (failedRequests.length > 0) {
      console.error('Failed network requests detected:', failedRequests);
      throw new Error(`Encountered ${failedRequests.length} failed HTTP requests: ${JSON.stringify(failedRequests)}`);
    } else {
      console.log('✓ Zero 404 or failed network requests detected!');
    }

    if (consoleErrors.length > 0) {
      console.error('Console errors detected:', consoleErrors);
      throw new Error(`Encountered ${consoleErrors.length} console errors: ${JSON.stringify(consoleErrors)}`);
    } else {
      console.log('✓ Zero console errors detected!');
    }

    // 4. Progression: Open Day 1 and complete it
    console.log('Testing day-by-day progression: opening Day 1...');
    await page.click('#btnOpenCalendar');
    const drawer = page.locator('#calendarDrawerOverlay');
    await drawer.locator('.card-open-btn[data-day="1"]').click();

    const modal = page.locator('#dayModalOverlay');
    const day1Title = await modal.locator('.modal-theme-title').innerText();
    console.log(`Day 1 Modal opened with theme: "${day1Title}"`);

    // Verify Next Day button is initially disabled
    const isNextDisabledBefore = await modal.locator('#btnNextDay').isDisabled();
    console.log(`Is Next button disabled before completion: ${isNextDisabledBefore}`);

    // Complete Day 1
    console.log('Completing Day 1...');
    await modal.locator('#btnToggleComplete').click();
    await page.waitForTimeout(500);

    const isNextEnabledAfter = await modal.locator('#btnNextDay').isEnabled();
    console.log(`Is Next button enabled after completion: ${isNextEnabledAfter}`);
    if (!isNextEnabledAfter) {
      throw new Error('Expected Next Day button to be enabled after completing Day 1');
    }

    // Advance to Day 2 using Next Day button
    console.log('Advancing to Day 2 via Next Day button...');
    await modal.locator('#btnNextDay').click();
    await page.waitForTimeout(500);

    const day2Badge = await modal.locator('.badge-num').innerText();
    const day2Title = await modal.locator('.modal-theme-title').innerText();
    console.log(`Advanced to: "${day2Badge}" - "${day2Title}"`);
    if (!day2Badge.includes('Day 2')) {
      throw new Error(`Expected modal to show Day 2, got "${day2Badge}"`);
    }

    // Close modal
    await modal.locator('#btnModalClose').click();
    await page.waitForTimeout(300);

    const progressAfterDay1 = await page.locator('#progressCountText').innerText();
    console.log(`Progress after Day 1: "${progressAfterDay1}"`);
    if (progressAfterDay1 !== '1 of 24') {
      throw new Error(`Expected "1 of 24", got "${progressAfterDay1}"`);
    }

    // 5. Reload persistence
    console.log('Testing reload persistence: reloading page...');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const progressAfterReload = await page.locator('#progressCountText').innerText();
    console.log(`Progress after reload: "${progressAfterReload}"`);
    if (progressAfterReload !== '1 of 24') {
      throw new Error(`Expected "1 of 24" after reload, got "${progressAfterReload}"`);
    }

    // Verify Day 2 remains unlocked in Calendar Drawer
    await page.click('#btnOpenCalendar');
    const day2Card = drawer.locator('.drawer-card[data-day="2"]');
    const day2IsAvailable = await day2Card.evaluate(el => el.classList.contains('card--available'));
    console.log(`Day 2 card available after reload: ${day2IsAvailable}`);
    if (!day2IsAvailable) {
      throw new Error('Expected Day 2 to remain unlocked after reload');
    }

    // 6. Test Localization on Production
    console.log('Testing localized visitor content...');
    await page.click('#btnDrawerClose');
    await page.click('#btnToggleStudio');
    await page.selectOption('#selectLanguage', 'es');
    await page.waitForTimeout(500);

    const esAppTitle = await page.locator('#appTitle').innerText();
    console.log(`Spanish App Title: "${esAppTitle}"`);

    // Open Day 1 modal in Spanish
    await page.click('#btnOpenCalendar');
    await drawer.locator('.card-open-btn[data-day="1"]').click();
    const esDay1Theme = await modal.locator('.modal-theme-title').innerText();
    console.log(`Spanish Day 1 Theme: "${esDay1Theme}"`);
    if (esDay1Theme !== 'La Luz en el Patio') {
      throw new Error(`Expected Spanish Day 1 theme "La Luz en el Patio", got "${esDay1Theme}"`);
    }

    console.log('\n=========================================');
    console.log('ALL PRODUCTION TESTS PASSED SUCCESSFULLY!');
    console.log('=========================================\n');
  } finally {
    await browser.close();
  }
}

testProductionSite().catch((err) => {
  console.error('\nProduction test failed with error:\n', err);
  process.exit(1);
});
