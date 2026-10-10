import { test, expect } from '@playwright/test';

test.describe('Advent Piazza Production Regression Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to guarantee a clean initial state
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('1. First-visit state: renders clean defaults and initial progress', async ({ page }) => {
    await expect(page.locator('#appTitle')).toContainText('The Advent Piazza');
    await expect(page.locator('#progressCountText')).toContainText('0 of 24');

    // Confirm 3D viewport canvas or fallback container is active
    await expect(page.locator('#piazzaContainer')).toBeVisible();

    // Verify day modal and drawer are closed on first load
    await expect(page.locator('#dayModalOverlay')).not.toHaveClass(/is-open/);
    await expect(page.locator('#calendarDrawerOverlay')).not.toHaveClass(/is-open/);
  });

  test('2. Calendar interactions: opens drawer, displays cards, and opens Day 1 modal', async ({ page }) => {
    // Open Calendar Drawer
    await page.click('#btnOpenCalendar');
    const drawer = page.locator('#calendarDrawerOverlay');
    await expect(drawer).toHaveClass(/is-open/);

    // Verify 24 days cards exist
    const cards = drawer.locator('.drawer-card');
    await expect(cards).toHaveCount(24);

    // Day 1 should be unlocked/available on first visit
    const day1Btn = drawer.locator('.card-open-btn[data-day="1"]');
    await expect(day1Btn).toBeEnabled();

    // Open Day 1 from drawer
    await day1Btn.click();

    // Drawer closes, Modal opens
    await expect(drawer).not.toHaveClass(/is-open/);
    const modal = page.locator('#dayModalOverlay');
    await expect(modal).toHaveClass(/is-open/);
    await expect(modal.locator('.badge-num')).toContainText('Day 1');
    await expect(modal.locator('.modal-theme-title')).toBeVisible();

    // Close modal via close button
    await modal.locator('#btnModalClose').click();
    await expect(modal).not.toHaveClass(/is-open/);
  });

  test('3. Persistence: marks moment completed and preserves state across browser reload', async ({ page }) => {
    // Open Day 1 directly
    await page.click('#btnOpenCalendar');
    await page.click('.card-open-btn[data-day="1"]');

    const modal = page.locator('#dayModalOverlay');
    await expect(modal).toHaveClass(/is-open/);

    // Click Complete Moment button
    const completeBtn = modal.locator('#btnToggleComplete');
    await expect(completeBtn).toContainText('Complete & Awaken Piazza');
    await completeBtn.click();
    await expect(completeBtn).toContainText('Moment Completed');

    // Close modal
    await modal.locator('#btnModalClose').click();
    await expect(page.locator('#progressCountText')).toContainText('1 of 24');

    // Simulate browser reload
    await page.reload();

    // Verify progress persisted after reload
    await expect(page.locator('#progressCountText')).toContainText('1 of 24');

    // Check calendar drawer shows Day 1 completed
    await page.click('#btnOpenCalendar');
    const day1Card = page.locator('.drawer-card[data-day="1"]');
    await expect(day1Card).toHaveClass(/card--completed/);
  });

  test('4. Routing: opens direct day modal via query parameters', async ({ page }) => {
    // Navigate with ?day=1 query parameter
    await page.goto('/?day=1');
    const modal = page.locator('#dayModalOverlay');
    await expect(modal).toHaveClass(/is-open/, { timeout: 10000 });
    await expect(modal.locator('.badge-num')).toContainText('Day 1');

    // Close with Escape key (accessibility check)
    await page.keyboard.press('Escape');
    await expect(modal).not.toHaveClass(/is-open/);

    // Test embedded mode parameter
    await page.goto('/?embedded=true');
    await expect(page.locator('body')).toHaveClass(/embed-mode-active/);
  });

  test('5. Localization: updates UI strings dynamically across languages', async ({ page }) => {
    // Open Studio Toolbar to change language
    await page.click('#btnToggleStudio');
    const langSelect = page.locator('#selectLanguage');
    await expect(langSelect).toBeVisible();

    // Switch to Spanish
    await langSelect.selectOption('es');
    await expect(page.locator('#appTitle')).toContainText('La Plaza de Adviento');
    await expect(page.locator('#btnCalendarText')).toContainText('Ver calendario');

    // Switch to French
    await langSelect.selectOption('fr');
    await expect(page.locator('#appTitle')).toContainText("La Piazza de l'Avent");
    await expect(page.locator('#btnCalendarText')).toContainText('Voir le calendrier');

    // Switch back to English
    await langSelect.selectOption('en');
    await expect(page.locator('#appTitle')).toContainText('The Advent Piazza');
  });

  test('6. Failure recovery: activates Accessible 2D Fallback mode and functions identically', async ({ page }) => {
    // Open Studio toolbar and enable 2D Fallback mode
    await page.click('#btnToggleStudio');
    const fallbackToggle = page.locator('#toggle2DFallback');
    await fallbackToggle.check();

    // Close studio toolbar so it does not occlude the pins
    await page.click('#btnToggleStudio');

    // 2D Viewport must be rendered
    const fallbackViewport = page.locator('#piazza2dViewport');
    await expect(fallbackViewport).toBeVisible();

    // Banner and image must exist
    await expect(fallbackViewport.locator('.piazza-fallback-banner')).toBeVisible();
    await expect(fallbackViewport.locator('.piazza-2d-master-img')).toBeVisible();

    // All 24 pins must be present on 2D map
    const pins = fallbackViewport.locator('.piazza-2d-pin');
    await expect(pins).toHaveCount(24);

    // Click Day 1 pin in 2D mode
    await fallbackViewport.locator('.piazza-2d-pin[data-day="1"]').click();

    // Modal dialog must open properly
    const modal = page.locator('#dayModalOverlay');
    await expect(modal).toHaveClass(/is-open/);
    await expect(modal.locator('.badge-num')).toContainText('Day 1');

    // Close modal
    await modal.locator('#btnModalClose').click();
    await expect(modal).not.toHaveClass(/is-open/);
  });

  test('7. Day-by-day progression: completing Day 1 unlocks Day 2 and advances sequentially', async ({ page }) => {
    // Open Calendar Drawer and verify Day 2 is initially locked
    await page.click('#btnOpenCalendar');
    const drawer = page.locator('#calendarDrawerOverlay');
    const day2Card = drawer.locator('.drawer-card[data-day="2"]');
    await expect(day2Card).toHaveClass(/card--locked/);
    await expect(day2Card.locator('.card-open-btn')).toBeDisabled();

    // Open Day 1
    await drawer.locator('.card-open-btn[data-day="1"]').click();
    const modal = page.locator('#dayModalOverlay');
    await expect(modal).toHaveClass(/is-open/);

    // Verify Next Day button is initially disabled
    const btnNext = modal.locator('#btnNextDay');
    await expect(btnNext).toBeDisabled();

    // Complete Day 1
    await modal.locator('#btnToggleComplete').click();
    await expect(modal.locator('#btnToggleComplete')).toContainText('Moment Completed');

    // Next Day button must now be enabled!
    await expect(btnNext).toBeEnabled();

    // Click Next Day button to advance to Day 2!
    await btnNext.click();
    await expect(modal.locator('.badge-num')).toContainText('Day 2');
    await expect(modal.locator('.modal-theme-title')).toContainText('Warmth from the Hearth');

    // Complete Day 2
    await modal.locator('#btnToggleComplete').click();
    await expect(modal.locator('#btnToggleComplete')).toContainText('Moment Completed');

    // Close modal
    await modal.locator('#btnModalClose').click();

    // Header must show 2 of 24
    await expect(page.locator('#progressCountText')).toContainText('2 of 24');

    // Open Calendar Drawer and verify Day 3 is now unlocked!
    await page.click('#btnOpenCalendar');
    const day3Card = drawer.locator('.drawer-card[data-day="3"]');
    await expect(day3Card).toHaveClass(/card--available/);
    await expect(day3Card.locator('.card-open-btn')).toBeEnabled();
  });

  test('8. Restart progress: resets progress cleanly from header and calendar drawer', async ({ page }) => {
    // Complete Day 1
    await page.click('#btnOpenCalendar');
    await page.click('.card-open-btn[data-day="1"]');
    const modal = page.locator('#dayModalOverlay');
    await modal.locator('#btnToggleComplete').click();
    await modal.locator('#btnModalClose').click();

    // Header shows 1 of 24, and Restart button is visible
    await expect(page.locator('#progressCountText')).toContainText('1 of 24');
    const headerResetBtn = page.locator('#btnHeaderReset');
    await expect(headerResetBtn).toBeVisible();

    // Click Restart in header
    await headerResetBtn.click();

    // Header resets back to 0 of 24, and Restart button hides
    await expect(page.locator('#progressCountText')).toContainText('0 of 24');
    await expect(headerResetBtn).not.toBeVisible();

    // Check calendar drawer: Day 1 available, Day 2 locked
    await page.click('#btnOpenCalendar');
    const drawer = page.locator('#calendarDrawerOverlay');
    const day1Card = drawer.locator('.drawer-card[data-day="1"]');
    const day2Card = drawer.locator('.drawer-card[data-day="2"]');
    await expect(day1Card).toHaveClass(/card--available/);
    await expect(day2Card).toHaveClass(/card--locked/);

    // Open Day 1 and complete it again
    await day1Card.locator('.card-open-btn').click();
    await modal.locator('#btnToggleComplete').click();
    await modal.locator('#btnModalClose').click();

    // Open Calendar Drawer and click Restart button in drawer
    await page.click('#btnOpenCalendar');
    const drawerResetBtn = drawer.locator('#btnDrawerReset');
    await expect(drawerResetBtn).toBeVisible();
    await drawerResetBtn.click();

    // Progress resets back to 0 of 24
    await expect(drawer.locator('.drawer-subtitle')).toContainText('0 of 24');
    await expect(drawer.locator('.drawer-card[data-day="2"]')).toHaveClass(/card--locked/);
  });
});
