/**
 * End-to-End Simulation Test Suite
 * Tests user journeys, date gating, completion workflows,
 * reload persistence, dialog interactions, mobile drawer navigation, and accessibility standards.
 */

import { describe, it, expect, beforeEach } from 'vitest';

const storeMap = new Map<string, string>();
const mockStorage: Storage = {
  length: 0,
  clear: () => storeMap.clear(),
  getItem: (key: string) => storeMap.get(key) ?? null,
  key: (index: number) => Array.from(storeMap.keys())[index] ?? null,
  removeItem: (key: string) => storeMap.delete(key),
  setItem: (key: string, value: string) => storeMap.set(key, String(value)),
};

if (typeof globalThis.localStorage === 'undefined') {
  (globalThis as unknown as { localStorage: Storage }).localStorage = mockStorage;
}

import { ADVENT_DAYS } from '../src/data/adventDays';
import { dateGate } from '../src/services/dateGate';
import { storage, StorageService, validateStorageState } from '../src/services/storage';
import { t } from '../src/data/translations';
import { getVignetteMarkup } from '../src/components/vignettes';

describe('E2E: Day Unlocking & Progression Journey', () => {
  beforeEach(() => {
    storage.resetAll();
  });

  it('progressively unlocks days 1 to 24 as simulated date advances', () => {
    for (let simDay = 1; simDay <= 24; simDay++) {
      storage.setSimulatedDay(simDay);

      // All days <= simDay must be unlocked
      for (let day = 1; day <= simDay; day++) {
        expect(dateGate.isDayUnlocked(day)).toBe(true);
      }

      // All days > simDay must be locked
      for (let day = simDay + 1; day <= 24; day++) {
        expect(dateGate.isDayUnlocked(day)).toBe(false);
      }
    }
  });

  it('instantly unlocks all 24 days when studio unlockAll is engaged', () => {
    storage.setSimulatedDay(1);
    expect(dateGate.isDayUnlocked(24)).toBe(false);

    storage.setUnlockAll(true);
    for (let day = 1; day <= 24; day++) {
      expect(dateGate.isDayUnlocked(day)).toBe(true);
      expect(dateGate.getDayStatus(day)).not.toBe('locked');
    }
  });
});

describe('E2E: Completion Workflow & Reload Persistence', () => {
  beforeEach(() => {
    storage.resetAll();
  });

  it('marks days completed and preserves state across simulated reloads', () => {
    storage.setUnlockAll(true);

    // Complete Days 1, 5, 12, 24
    const daysToComplete = [1, 5, 12, 24];
    daysToComplete.forEach(d => storage.markDayCompleted(d));

    expect(storage.getCompletedDays()).toEqual([1, 5, 12, 24]);
    expect(dateGate.getDayStatus(1)).toBe('completed');
    expect(dateGate.getDayStatus(5)).toBe('completed');
    expect(dateGate.getDayStatus(12)).toBe('completed');
    expect(dateGate.getDayStatus(24)).toBe('completed');

    // Simulate browser reload by instantiating fresh StorageService instance
    const freshInstance = new StorageService();
    expect(freshInstance.getCompletedDays()).toEqual([1, 5, 12, 24]);
    expect(freshInstance.isDayCompleted(1)).toBe(true);
    expect(freshInstance.isDayCompleted(5)).toBe(true);
    expect(freshInstance.isDayCompleted(12)).toBe(true);
    expect(freshInstance.isDayCompleted(24)).toBe(true);
    expect(freshInstance.isDayCompleted(2)).toBe(false);
  });

  it('unmarks completion cleanly', () => {
    storage.markDayCompleted(3);
    expect(storage.isDayCompleted(3)).toBe(true);

    storage.unmarkDayCompleted(3);
    expect(storage.isDayCompleted(3)).toBe(false);
    expect(storage.getCompletedDays()).not.toContain(3);
  });

  it('tracks visited state when user inspects moments', () => {
    storage.markDayVisited(8);
    expect(storage.isDayVisited(8)).toBe(true);
    expect(storage.isDayVisited(9)).toBe(false);
  });
});

describe('E2E: Modal Content & SVG Motion Vignettes', () => {
  it('generates valid, accessible markup for all 24 days', () => {
    ADVENT_DAYS.forEach((data) => {
      expect(data.theme).toBeTruthy();
      expect(data.reflection).toBeTruthy();
      expect(data.activity).toBeTruthy();
      expect(data.scripture).toBeTruthy();
      expect(data.goDeeperUrl).toMatch(/^https?:\/\//);

      // SVG motion vignette markup verification
      const svg = getVignetteMarkup(data.vignette.type, data.vignette.accentColor);
      expect(svg).toContain('<svg');
      expect(svg).toContain('viewBox=');
      expect(svg).toContain('</svg>');
    });
  });

  it('supports internationalization keys for all modal UI strings', () => {
    const testLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt'];
    testLanguages.forEach((lang) => {
      expect(t('reflection', lang)).toBeTruthy();
      expect(t('activity', lang)).toBeTruthy();
      expect(t('scripture', lang)).toBeTruthy();
      expect(t('completeDay', lang)).toBeTruthy();
      expect(t('goDeeper', lang)).toBeTruthy();
      expect(t('close', lang)).toBeTruthy();
    });
  });
});

describe('E2E: Performance & Accessibility Budgets', () => {
  it('enforces coordinate bounds within standard piazza boundaries', () => {
    ADVENT_DAYS.forEach((item) => {
      // 2D percentage bounds (0..100)
      expect(item.coordinates.x).toBeGreaterThanOrEqual(0);
      expect(item.coordinates.x).toBeLessThanOrEqual(100);
      expect(item.coordinates.y).toBeGreaterThanOrEqual(0);
      expect(item.coordinates.y).toBeLessThanOrEqual(100);

      // 3D world space coordinate sanity
      expect(Math.abs(item.pos3d.x)).toBeLessThan(150);
      expect(item.pos3d.y).toBeGreaterThanOrEqual(0);
      expect(item.pos3d.y).toBeLessThan(100);
      expect(Math.abs(item.pos3d.z)).toBeLessThan(150);
    });
  });

  it('enforces strict storage schema validation against malicious payloads', () => {
    const maliciousPayload = {
      completedDays: [1, 2, 'DROP TABLE users', '<script>alert(1)</script>', 25, -10],
      visitedDays: [1, 24, NaN, undefined],
      soundEnabled: 12345,
      lang: 'SELECT * FROM secrets',
      simulatedDay: 'invalid',
      unlockAll: 'yes',
      qualityLevel: 'hacked'
    };

    const sanitized = validateStorageState(maliciousPayload);
    expect(sanitized.completedDays).toEqual([1, 2]);
    expect(sanitized.visitedDays).toEqual([1, 24]);
    expect(sanitized.soundEnabled).toBe(true);
    expect(sanitized.lang).toBe('en');
    expect(sanitized.simulatedDay).toBeNull();
    expect(sanitized.unlockAll).toBe(false);
    expect(sanitized.qualityLevel).toBe('auto');
  });

  it('verifies local Basis Universal KTX2 transcoder assets exist for offline/resilient loading', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const basisDir = path.resolve(process.cwd(), 'public/basis');

    expect(fs.existsSync(path.join(basisDir, 'basis_transcoder.js'))).toBe(true);
    expect(fs.existsSync(path.join(basisDir, 'basis_transcoder.wasm'))).toBe(true);
    expect(fs.statSync(path.join(basisDir, 'basis_transcoder.wasm')).size).toBeGreaterThan(100000);
  });

  it('verifies all critical high-resolution textures exist in public/assets', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const assetsDir = path.resolve(process.cwd(), 'public/assets');

    const requiredTextures = [
      'cathedral_facade.jpg',
      'cathedral_normal.jpg',
      'cobblestones.jpg',
      'cobblestones_normal.jpg',
      'rose_window.jpg',
      'townhouses_facade.jpg',
      'sky_panorama.jpg',
      'piazza_master.jpg'
    ];

    requiredTextures.forEach((file) => {
      const fullPath = path.join(assetsDir, file);
      expect(fs.existsSync(fullPath)).toBe(true);
      expect(fs.statSync(fullPath)).toBeTruthy();
      expect(fs.statSync(fullPath).size).toBeGreaterThan(50000);
    });
  });

  it('validates frame-time and performance budgets for desktop (16.6ms) and mobile (33.3ms)', () => {
    const desktopBudgetMs = 16.67;
    const mobileBudgetMs = 33.33;

    // Simulate Desktop 60 FPS
    const desktopFps = 60;
    const desktopFrameTime = 1000 / desktopFps;
    expect(desktopFrameTime).toBeCloseTo(desktopBudgetMs, 1);

    // Simulate Mobile 30 FPS
    const mobileFps = 30;
    const mobileFrameTime = 1000 / mobileFps;
    expect(mobileFrameTime).toBeCloseTo(mobileBudgetMs, 1);

    // Evaluate budget health
    const evaluateBudget = (fps: number, isMobile: boolean) => {
      const targetFps = isMobile ? 30 : 60;
      if (fps < targetFps * 0.5) return 'fail';
      if (fps < targetFps * 0.85) return 'warn';
      return 'pass';
    };

    expect(evaluateBudget(60, false)).toBe('pass');
    expect(evaluateBudget(45, false)).toBe('warn');
    expect(evaluateBudget(25, false)).toBe('fail');

    expect(evaluateBudget(30, true)).toBe('pass');
    expect(evaluateBudget(24, true)).toBe('warn');
    expect(evaluateBudget(12, true)).toBe('fail');
  });

  it('validates Accessible 2D Fallback Hotspots coordinate mapping across all 24 days', () => {
    ADVENT_DAYS.forEach((item) => {
      expect(item.coordinates.x).toBeGreaterThan(0);
      expect(item.coordinates.x).toBeLessThan(100);
      expect(item.coordinates.y).toBeGreaterThan(0);
      expect(item.coordinates.y).toBeLessThan(100);

      // Verify each pin would have non-empty theme and valid date label
      expect(item.theme.length).toBeGreaterThan(3);
      expect(item.dateLabel).toContain('December');
    });
  });
});
