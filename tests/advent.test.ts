import { describe, it, expect, beforeEach } from 'vitest';
import { ADVENT_DAYS, getLocalizedAdventDay, getLocalizedAdventDays } from '../src/data/adventDays';
import { SUPPORTED_LANGUAGES, t } from '../src/data/translations';
import { dateGate } from '../src/services/dateGate';
import { storage, validateStorageState } from '../src/services/storage';
import type { QualityLevel } from '../src/types/advent';

describe('Advent Calendar Dataset', () => {
  it('should contain exactly 24 days', () => {
    expect(ADVENT_DAYS).toHaveLength(24);
  });

  it('should have sequential days 1 through 24', () => {
    ADVENT_DAYS.forEach((item, index) => {
      expect(item.day).toBe(index + 1);
      expect(item.dateLabel).toBe(`December ${index + 1}`);
      expect(item.theme).toBeTruthy();
      expect(item.reflection).toBeTruthy();
      expect(item.activity).toBeTruthy();
      expect(item.scripture).toBeTruthy();
      expect(item.goDeeperUrl).toMatch(/^https?:\/\//);
    });
  });

  it('should have valid 3D spatial coordinates and camera targets for all 24 days', () => {
    ADVENT_DAYS.forEach((item) => {
      expect(item.pos3d).toBeDefined();
      expect(typeof item.pos3d.x).toBe('number');
      expect(typeof item.pos3d.y).toBe('number');
      expect(typeof item.pos3d.z).toBe('number');

      expect(item.camTarget3d).toBeDefined();
      expect(typeof item.camTarget3d.x).toBe('number');
      expect(typeof item.camTarget3d.y).toBe('number');
      expect(typeof item.camTarget3d.z).toBe('number');
      expect(item.camTarget3d.lookAt).toBeDefined();
    });
  });
});

describe('Date Gating Engine', () => {
  beforeEach(() => {
    storage.resetAll();
  });

  it('should unlock day 1 by default when outside December', () => {
    storage.setUnlockAll(false);
    storage.setSimulatedDay(null);
    expect(dateGate.isDayUnlocked(1)).toBe(true);
  });

  it('should lock future days beyond active day', () => {
    storage.setSimulatedDay(5);
    expect(dateGate.isDayUnlocked(1)).toBe(true);
    expect(dateGate.isDayUnlocked(5)).toBe(true);
    expect(dateGate.isDayUnlocked(6)).toBe(false);
    expect(dateGate.isDayUnlocked(24)).toBe(false);
  });

  it('should unlock all 24 days when unlockAll is enabled', () => {
    storage.setUnlockAll(true);
    for (let day = 1; day <= 24; day++) {
      expect(dateGate.isDayUnlocked(day)).toBe(true);
    }
  });

  it('should return correct statuses: locked, available, completed', () => {
    storage.setSimulatedDay(3);
    storage.unmarkDayCompleted(1);
    storage.unmarkDayCompleted(2);
    storage.unmarkDayCompleted(3);

    expect(dateGate.getDayStatus(1)).toBe('available');
    expect(dateGate.getDayStatus(4)).toBe('locked');

    storage.markDayCompleted(1);
    expect(dateGate.getDayStatus(1)).toBe('completed');
  });

  it('should advance day-by-day progression sequentially as days are completed', () => {
    storage.resetAll();
    // Initially outside December: Day 1 is available, Day 2 is locked
    expect(dateGate.isDayUnlocked(1)).toBe(true);
    expect(dateGate.isDayUnlocked(2)).toBe(false);

    // Complete Day 1 -> Day 2 advances and unlocks!
    storage.markDayCompleted(1);
    expect(dateGate.isDayUnlocked(2)).toBe(true);
    expect(dateGate.isDayUnlocked(3)).toBe(false);
    expect(dateGate.getDayStatus(1)).toBe('completed');
    expect(dateGate.getDayStatus(2)).toBe('available');

    // Complete Day 2 -> Day 3 advances and unlocks!
    storage.markDayCompleted(2);
    expect(dateGate.isDayUnlocked(3)).toBe(true);
    expect(dateGate.isDayUnlocked(4)).toBe(false);
    expect(dateGate.getDayStatus(2)).toBe('completed');
    expect(dateGate.getDayStatus(3)).toBe('available');
  });

  it('should reset progress cleanly back to Day 1 when restart is triggered', () => {
    storage.markDayCompleted(1);
    storage.markDayCompleted(2);
    storage.markDayCompleted(3);
    expect(storage.getCompletedDays()).toEqual([1, 2, 3]);
    expect(dateGate.isDayUnlocked(4)).toBe(true);

    // Trigger restart
    storage.resetAll();
    expect(storage.getCompletedDays()).toEqual([]);
    expect(storage.getVisitedDays()).toEqual([]);
    expect(dateGate.isDayUnlocked(1)).toBe(true);
    expect(dateGate.isDayUnlocked(2)).toBe(false);
    expect(dateGate.isDayUnlocked(3)).toBe(false);
    expect(dateGate.isDayUnlocked(4)).toBe(false);
    expect(dateGate.getDayStatus(1)).toBe('available');
  });
});

describe('Storage Service & Adaptive Quality Preferences', () => {
  beforeEach(() => {
    storage.resetAll();
  });

  it('should track completed days correctly', () => {
    storage.markDayCompleted(5);
    expect(storage.isDayCompleted(5)).toBe(true);
    expect(storage.getCompletedDays()).toContain(5);

    storage.unmarkDayCompleted(5);
    expect(storage.isDayCompleted(5)).toBe(false);
  });

  it('should toggle sound preferences', () => {
    storage.setSoundEnabled(false);
    expect(storage.getSoundEnabled()).toBe(false);

    storage.setSoundEnabled(true);
    expect(storage.getSoundEnabled()).toBe(true);
  });

  it('should remember language settings', () => {
    storage.setLanguage('es');
    expect(storage.getLanguage()).toBe('es');
  });

  it('should persist and retrieve graphics quality level', () => {
    const levels: QualityLevel[] = ['auto', 'high', 'medium', 'low'];
    levels.forEach((lvl) => {
      storage.setQualityLevel(lvl);
      expect(storage.getQualityLevel()).toBe(lvl);
    });
  });

  it('should reject invalid or out-of-bounds days', () => {
    storage.markDayCompleted(0);
    storage.markDayCompleted(25);
    storage.markDayCompleted(-5);
    expect(storage.getCompletedDays()).not.toContain(0);
    expect(storage.getCompletedDays()).not.toContain(25);
    expect(storage.getCompletedDays()).not.toContain(-5);
  });

  it('should validate and sanitize corrupted storage data safely', () => {
    const corruptedInput = {
      completedDays: [-1, 0, 1, 2, 99, 'foo', null],
      visitedDays: [25, 24, 1],
      soundEnabled: 'not-a-bool',
      lang: 'INVALID_LANGUAGE_123',
      simulatedDay: 999,
      unlockAll: 'yes',
      qualityLevel: 'ultra-hd'
    };
    const sanitized = validateStorageState(corruptedInput);
    expect(sanitized.version).toBe(2);
    expect(sanitized.completedDays).toEqual([1, 2]);
    expect(sanitized.visitedDays).toEqual([1, 24]);
    expect(sanitized.soundEnabled).toBe(true);
    expect(sanitized.lang).toBe('en');
    expect(sanitized.simulatedDay).toBeNull();
    expect(sanitized.unlockAll).toBe(false);
    expect(sanitized.qualityLevel).toBe('auto');
  });

  it('should handle completely invalid non-object raw data', () => {
    expect(validateStorageState(null)).toBeDefined();
    expect(validateStorageState(undefined)).toBeDefined();
    expect(validateStorageState('corrupted string')).toBeDefined();
    expect(validateStorageState(42)).toBeDefined();
    expect(validateStorageState([])).toBeDefined();
  });
});

describe('i18n Translation Dictionary & 24 Days Localization', () => {
  it('should support 6 fully localized European languages', () => {
    expect(SUPPORTED_LANGUAGES).toHaveLength(6);
    const codes = SUPPORTED_LANGUAGES.map(l => l.code);
    expect(codes).toEqual(['en', 'es', 'fr', 'de', 'it', 'pt']);
  });

  it('should return translated UI keys with fallback to English', () => {
    expect(t('day', 'en')).toBe('Day');
    expect(t('day', 'es')).toBe('Día');
    expect(t('day', 'fr')).toBe('Jour');
    expect(t('day', 'de')).toBe('Tag');
    expect(t('day', 'it')).toBe('Giorno');
    expect(t('day', 'pt')).toBe('Dia');
    // Fallback for unknown key/language
    expect(t('nonexistent_key_xyz', 'es')).toBe('nonexistent_key_xyz');
  });

  it('should return authentic localized visitor content for all 24 days across supported languages', () => {
    // Check Day 1 theme localization
    expect(getLocalizedAdventDay(1, 'en').theme).toBe('The Light in the Courtyard');
    expect(getLocalizedAdventDay(1, 'es').theme).toBe('La Luz en el Patio');
    expect(getLocalizedAdventDay(1, 'fr').theme).toBe('La Lumière dans la Cour');
    expect(getLocalizedAdventDay(1, 'de').theme).toBe('Das Licht im Hof');
    expect(getLocalizedAdventDay(1, 'it').theme).toBe('La Luce nel Cortile');
    expect(getLocalizedAdventDay(1, 'pt').theme).toBe('A Luz no Pátio');

    // Check all 24 days in Spanish
    const esDays = getLocalizedAdventDays('es');
    expect(esDays).toHaveLength(24);
    esDays.forEach((day, idx) => {
      expect(day.day).toBe(idx + 1);
      expect(day.theme).toBeTruthy();
      expect(day.scripture).toBeTruthy();
      expect(day.reflection).toBeTruthy();
      expect(day.activity).toBeTruthy();
      expect(day.location).toBeTruthy();
    });

    // Check all 24 days in French, German, Italian, Portuguese
    ['fr', 'de', 'it', 'pt'].forEach((lang) => {
      const days = getLocalizedAdventDays(lang);
      expect(days).toHaveLength(24);
      days.forEach((day) => {
        expect(day.theme).toBeTruthy();
        expect(day.scripture).toBeTruthy();
        expect(day.reflection).toBeTruthy();
      });
    });
  });

  it('should fallback to English for unsupported language codes', () => {
    const fallbackDay = getLocalizedAdventDay(1, 'xx-UNKNOWN');
    expect(fallbackDay.theme).toBe('The Light in the Courtyard');
  });
});
