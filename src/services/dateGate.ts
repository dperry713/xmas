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

    // 2. Base unlocked day from calendar date or simulation
    let baseDay = 1;
    const simDay = storage.getSimulatedDay();
    if (simDay !== null && simDay !== undefined) {
      baseDay = Math.min(24, Math.max(1, simDay));
    } else {
      const now = new Date();
      const month = now.getMonth(); // 11 is December
      const date = now.getDate();

      if (month === 11) {
        // It is December!
        baseDay = Math.min(24, Math.max(1, date));
      }
    }

    // 3. Day-by-day progressive advancement:
    // Completing days unlocks the next sequential day in the journey
    const completed = storage.getCompletedDays();
    if (completed.length > 0) {
      const maxCompleted = Math.max(...completed);
      const nextProgressiveDay = Math.min(24, maxCompleted + 1);
      return Math.max(baseDay, nextProgressiveDay);
    }

    return baseDay;
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
