/**
 * Storage Service
 * Handles saving and retrieving completed days, preferences, language, and quality settings.
 * Includes schema validation, schema version migrations, and clean first-visit defaults.
 */

import type { StorageState, QualityLevel } from '../types/advent';

export const CURRENT_SCHEMA_VERSION = 2;
export const STORAGE_KEY_V2 = 'advent_piazza_v2';
export const STORAGE_KEY_V1 = 'advent_piazza_v1';

export const DEFAULT_STORAGE_STATE: StorageState = {
  version: CURRENT_SCHEMA_VERSION,
  completedDays: [],
  visitedDays: [],
  soundEnabled: true,
  lang: 'en',
  simulatedDay: null,
  unlockAll: false,
  qualityLevel: 'auto'
};

const VALID_QUALITY_LEVELS: ReadonlySet<QualityLevel> = new Set(['auto', 'high', 'medium', 'low']);

/**
 * Validates and sanitizes raw storage data against the schema.
 * Replaces corrupted or missing values with safe defaults.
 */
export function validateStorageState(raw: unknown): StorageState {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ...DEFAULT_STORAGE_STATE };
  }

  const obj = raw as Record<string, unknown>;

  // 1. Completed Days validation: integer array between 1 and 24, unique & sorted
  let completedDays: number[] = [];
  if (Array.isArray(obj.completedDays)) {
    const validSet = new Set<number>();
    for (const item of obj.completedDays) {
      const n = typeof item === 'number' ? Math.floor(item) : parseInt(String(item), 10);
      if (Number.isFinite(n) && n >= 1 && n <= 24) {
        validSet.add(n);
      }
    }
    completedDays = Array.from(validSet).sort((a, b) => a - b);
  }

  // 2. Visited Days validation: integer array between 1 and 24, unique
  let visitedDays: number[] = [];
  if (Array.isArray(obj.visitedDays)) {
    const validSet = new Set<number>();
    for (const item of obj.visitedDays) {
      const n = typeof item === 'number' ? Math.floor(item) : parseInt(String(item), 10);
      if (Number.isFinite(n) && n >= 1 && n <= 24) {
        validSet.add(n);
      }
    }
    visitedDays = Array.from(validSet).sort((a, b) => a - b);
  }

  // 3. Sound Enabled validation: boolean
  const soundEnabled = typeof obj.soundEnabled === 'boolean' ? obj.soundEnabled : true;

  // 4. Language validation: 2-5 character language code
  let lang = 'en';
  if (typeof obj.lang === 'string' && /^[a-z]{2}(-[A-Z]{2})?$/i.test(obj.lang.trim())) {
    lang = obj.lang.trim().toLowerCase();
  }

  // 5. Simulated Day validation: null or 1..24
  let simulatedDay: number | null = null;
  if (obj.simulatedDay !== null && obj.simulatedDay !== undefined) {
    const sim = typeof obj.simulatedDay === 'number' ? Math.floor(obj.simulatedDay) : parseInt(String(obj.simulatedDay), 10);
    if (Number.isFinite(sim) && sim >= 1 && sim <= 24) {
      simulatedDay = sim;
    }
  }

  // 6. Unlock All validation: boolean
  const unlockAll = typeof obj.unlockAll === 'boolean' ? obj.unlockAll : false;

  // 7. Graphic Quality Level validation
  let qualityLevel: QualityLevel = 'auto';
  if (typeof obj.qualityLevel === 'string' && VALID_QUALITY_LEVELS.has(obj.qualityLevel as QualityLevel)) {
    qualityLevel = obj.qualityLevel as QualityLevel;
  }

  return {
    version: CURRENT_SCHEMA_VERSION,
    completedDays,
    visitedDays,
    soundEnabled,
    lang,
    simulatedDay,
    unlockAll,
    qualityLevel
  };
}

export class StorageService {
  private memoryStore: StorageState;
  private listeners = new Set<(state: StorageState) => void>();

  constructor() {
    this.memoryStore = { ...DEFAULT_STORAGE_STATE };
    this.loadAndMigrate();
  }

  private getStorage(): Storage | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage;
      }
      if (typeof globalThis !== 'undefined' && (globalThis as unknown as { localStorage: Storage }).localStorage) {
        return (globalThis as unknown as { localStorage: Storage }).localStorage;
      }
    } catch {
      return null;
    }
    return null;
  }

  public isStorageAvailable(): boolean {
    return this.checkAvailability();
  }

  private checkAvailability(): boolean {
    try {
      const ls = this.getStorage();
      if (!ls) return false;
      const testKey = '__advent_storage_test__';
      ls.setItem(testKey, '1');
      ls.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Loads state from localStorage with migration from v1 to v2.
   */
  private loadAndMigrate(): void {
    const ls = this.getStorage();
    if (!ls) return;

    try {
      // 1. Attempt reading v2 schema
      const v2Data = ls.getItem(STORAGE_KEY_V2);
      if (v2Data) {
        const parsed = JSON.parse(v2Data);
        this.memoryStore = validateStorageState(parsed);
        return;
      }

      // 2. Migration: Check for legacy v1 schema
      const v1Data = ls.getItem(STORAGE_KEY_V1);
      if (v1Data) {
        const parsedV1 = JSON.parse(v1Data);
        const migrated = validateStorageState(parsedV1);
        migrated.version = CURRENT_SCHEMA_VERSION;
        this.memoryStore = migrated;

        // Persist migrated v2 data and clean up legacy v1 key
        this.save();
        ls.removeItem(STORAGE_KEY_V1);
        return;
      }

      // 3. Clean first-visit initialization
      this.memoryStore = { ...DEFAULT_STORAGE_STATE };
      this.save();
    } catch (e) {
      console.warn('Storage migration/loading error, recovering with clean state:', e);
      this.memoryStore = { ...DEFAULT_STORAGE_STATE };
    }
  }

  private save(): void {
    const ls = this.getStorage();
    if (!ls) return;
    try {
      ls.setItem(STORAGE_KEY_V2, JSON.stringify(this.memoryStore));
    } catch (e) {
      console.warn('Could not write to localStorage:', e);
    }
  }

  getCompletedDays(): number[] {
    return [...(this.memoryStore.completedDays || [])];
  }

  isDayCompleted(day: number): boolean {
    return (this.memoryStore.completedDays || []).includes(day);
  }

  markDayCompleted(day: number): void {
    if (day < 1 || day > 24) return;
    const set = new Set(this.memoryStore.completedDays || []);
    set.add(day);
    this.memoryStore.completedDays = Array.from(set).sort((a, b) => a - b);
    this.markDayVisited(day);
    this.save();
    this.notify();
  }

  unmarkDayCompleted(day: number): void {
    this.memoryStore.completedDays = (this.memoryStore.completedDays || []).filter(d => d !== day);
    this.save();
    this.notify();
  }

  markDayVisited(day: number): void {
    if (day < 1 || day > 24) return;
    const set = new Set(this.memoryStore.visitedDays || []);
    set.add(day);
    this.memoryStore.visitedDays = Array.from(set).sort((a, b) => a - b);
    this.save();
  }

  isDayVisited(day: number): boolean {
    return (this.memoryStore.visitedDays || []).includes(day);
  }

  getSoundEnabled(): boolean {
    return this.memoryStore.soundEnabled !== false;
  }

  setSoundEnabled(enabled: boolean): void {
    this.memoryStore.soundEnabled = !!enabled;
    this.save();
    this.notify();
  }

  getLanguage(): string {
    return this.memoryStore.lang || 'en';
  }

  setLanguage(lang: string): void {
    if (!lang || typeof lang !== 'string') return;
    this.memoryStore.lang = lang.trim().toLowerCase();
    this.save();
    this.notify();
  }

  getSimulatedDay(): number | null {
    return this.memoryStore.simulatedDay;
  }

  setSimulatedDay(day: number | null): void {
    if (day !== null && (day < 1 || day > 24)) return;
    this.memoryStore.simulatedDay = day;
    this.save();
    this.notify();
  }

  getUnlockAll(): boolean {
    return !!this.memoryStore.unlockAll;
  }

  setUnlockAll(unlock: boolean): void {
    this.memoryStore.unlockAll = !!unlock;
    this.save();
    this.notify();
  }

  getQualityLevel(): QualityLevel {
    return this.memoryStore.qualityLevel || 'auto';
  }

  setQualityLevel(level: QualityLevel): void {
    if (!VALID_QUALITY_LEVELS.has(level)) return;
    this.memoryStore.qualityLevel = level;
    this.save();
    this.notify();
  }

  resetAll(): void {
    this.memoryStore = {
      ...DEFAULT_STORAGE_STATE,
      lang: this.getLanguage()
    };
    this.save();
    this.notify();
  }

  subscribe(listener: (state: StorageState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    for (const listener of this.listeners) {
      try {
        listener({ ...this.memoryStore });
      } catch (err) {
        console.error('Storage listener error:', err);
      }
    }
  }
}

export const storage = new StorageService();
