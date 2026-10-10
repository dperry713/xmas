/**
 * Date Gating Service
 * Controls unlocking of days 1-24 based on real December calendar dates
 * or studio simulation overrides.
 */

import { storage } from './storage';
import type { DayStatus } from '../types/advent';

class DateGateService {
  /**
   * Determine the effective active calendar day of Advent (1-24)
   */
  getActiveDay(): number {
    // 1. Studio override: Unlock All
    if (storage.getUnlockAll()) {
      return 24;
    }

    // 2. Studio override: Specific simulated day
    const simDay = storage.getSimulatedDay();
    if (simDay !== null && simDay !== undefined) {
      return Math.min(24, Math.max(1, simDay));
    }

    // 3. Real calendar date
    const now = new Date();
    const month = now.getMonth(); // 11 is December
    const date = now.getDate();

    if (month === 11) {
      // It is December!
      return Math.min(24, Math.max(1, date));
    }

    // If outside December (e.g. testing in other months),
    // default to day 1 unlocked for interactive exploration
    return 1;
  }

  /**
   * Check if a given day (1-24) is unlocked
   */
  isDayUnlocked(day: number): boolean {
    if (storage.getUnlockAll()) return true;
    const activeDay = this.getActiveDay();
    return day <= activeDay;
  }

  /**
   * Check if a given day is the specific "Today" window
   */
  isToday(day: number): boolean {
    return day === this.getActiveDay();
  }

  /**
   * Return status: 'completed' | 'available' | 'locked'
   */
  getDayStatus(day: number): DayStatus {
    if (!this.isDayUnlocked(day)) {
      return 'locked';
    }
    if (storage.isDayCompleted(day)) {
      return 'completed';
    }
    return 'available';
  }
}

export const dateGate = new DateGateService();
