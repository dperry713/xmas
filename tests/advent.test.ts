import { describe, it, expect, beforeEach } from 'vitest';
import { ADVENT_DAYS } from '../src/data/adventDays';
import { SUPPORTED_LANGUAGES, t } from '../src/data/translations';
import { dateGate } from '../src/services/dateGate';
import { storage } from '../src/services/storage';
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
});

describe('i18n Translation Dictionary', () => {
  it('should support multiple official Church languages', () => {
    expect(SUPPORTED_LANGUAGES.length).toBeGreaterThanOrEqual(24);
  });

  it('should return translated keys with fallback to English', () => {
    expect(t('day', 'en')).toBe('Day');
    expect(t('day', 'es')).toBe('Día');
    expect(t('day', 'fr')).toBe('Jour');
    expect(t('day', 'de')).toBe('Tag');
    expect(t('day', 'it')).toBe('Giorno');
  });
});
