/**
 * Storage Service
 * Handles saving and retrieving completed days, preferences, language, and quality settings.
 */

import type { StorageState, QualityLevel } from '../types/advent';

const STORAGE_KEY = 'advent_piazza_v1';

class StorageService {
  private memoryStore: StorageState;
  private isLocalStorageAvailable: boolean;
  private listeners = new Set<(state: StorageState) => void>();

  constructor() {
    this.memoryStore = {
      completedDays: [1],
      visitedDays: [1],
      soundEnabled: true,
      lang: 'en',
      simulatedDay: null,
      unlockAll: false,
      qualityLevel: 'auto'
    };
    this.isLocalStorageAvailable = this.checkAvailability();
    this.load();
  }

  private checkAvailability(): boolean {
    try {
      const testKey = '__advent_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  private load(): void {
    if (!this.isLocalStorageAvailable) return;
    try {
      const data = window.localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.memoryStore = { ...this.memoryStore, ...parsed };
      }
    } catch (e) {
      console.warn('Could not load from localStorage, using memory storage:', e);
    }
  }

  private save(): void {
    if (!this.isLocalStorageAvailable) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.memoryStore));
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
    const set = new Set(this.memoryStore.visitedDays || []);
    set.add(day);
    this.memoryStore.visitedDays = Array.from(set);
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
    this.memoryStore.lang = lang;
    this.save();
    this.notify();
  }

  getSimulatedDay(): number | null {
    return this.memoryStore.simulatedDay;
  }

  setSimulatedDay(day: number | null): void {
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
    this.memoryStore.qualityLevel = level;
    this.save();
    this.notify();
  }

  resetAll(): void {
    this.memoryStore = {
      completedDays: [],
      visitedDays: [],
      soundEnabled: true,
      lang: this.getLanguage(),
      simulatedDay: null,
      unlockAll: false,
      qualityLevel: 'auto'
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
        listener(this.memoryStore);
      } catch (err) {
        console.error(err);
      }
    }
  }
}

export const storage = new StorageService();
