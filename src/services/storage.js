/**
 * Storage Service
 * Handles saving and retrieving completed days, sound preferences, and language
 * with in-memory fallback for sandboxed iframes or private browsing.
 */

const STORAGE_KEY = 'advent_piazza_v1';

class StorageService {
  constructor() {
    this.memoryStore = {
      completedDays: [1], // Day 1 completed by default for welcoming experience
      visitedDays: [1],
      soundEnabled: true,
      lang: 'en',
      simulatedDay: null,
      unlockAll: false
    };
    this.isLocalStorageAvailable = this.checkAvailability();
    this.load();
  }

  checkAvailability() {
    try {
      const testKey = '__advent_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  load() {
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

  save() {
    if (!this.isLocalStorageAvailable) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.memoryStore));
    } catch (e) {
      console.warn('Could not write to localStorage:', e);
    }
  }

  getCompletedDays() {
    return [...(this.memoryStore.completedDays || [])];
  }

  isDayCompleted(day) {
    return (this.memoryStore.completedDays || []).includes(day);
  }

  markDayCompleted(day) {
    const set = new Set(this.memoryStore.completedDays || []);
    set.add(day);
    this.memoryStore.completedDays = Array.from(set).sort((a, b) => a - b);
    this.markDayVisited(day);
    this.save();
    this.notify();
  }

  unmarkDayCompleted(day) {
    this.memoryStore.completedDays = (this.memoryStore.completedDays || []).filter(d => d !== day);
    this.save();
    this.notify();
  }

  markDayVisited(day) {
    const set = new Set(this.memoryStore.visitedDays || []);
    set.add(day);
    this.memoryStore.visitedDays = Array.from(set);
    this.save();
  }

  isDayVisited(day) {
    return (this.memoryStore.visitedDays || []).includes(day);
  }

  getSoundEnabled() {
    return this.memoryStore.soundEnabled !== false;
  }

  setSoundEnabled(enabled) {
    this.memoryStore.soundEnabled = !!enabled;
    this.save();
    this.notify();
  }

  getLanguage() {
    return this.memoryStore.lang || 'en';
  }

  setLanguage(lang) {
    this.memoryStore.lang = lang;
    this.save();
    this.notify();
  }

  getSimulatedDay() {
    return this.memoryStore.simulatedDay;
  }

  setSimulatedDay(day) {
    this.memoryStore.simulatedDay = day;
    this.save();
    this.notify();
  }

  getUnlockAll() {
    return !!this.memoryStore.unlockAll;
  }

  setUnlockAll(unlock) {
    this.memoryStore.unlockAll = !!unlock;
    this.save();
    this.notify();
  }

  resetAll() {
    this.memoryStore = {
      completedDays: [],
      visitedDays: [],
      soundEnabled: true,
      lang: this.getLanguage(),
      simulatedDay: null,
      unlockAll: false
    };
    this.save();
    this.notify();
  }

  listeners = new Set();

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
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
