/**
 * Accessible Calendar Drawer Component
 * Allows users to view all 24 days in an accessible, structured grid
 * with statuses, keyboard navigation, and quick access.
 */

import { ADVENT_DAYS } from '../data/adventDays';
import { dateGate } from '../services/dateGate';
import { storage } from '../services/storage';
import { t } from '../data/translations';
import { soundManager } from '../audio/soundManager';

export class CalendarDrawer {
  private container: HTMLElement;
  private onSelectDay: (day: number) => void;
  private onResetProgress?: () => void;
  public isOpen: boolean = false;
  private drawerEl!: HTMLDivElement;

  constructor({
    container,
    onSelectDay,
    onResetProgress
  }: {
    container: HTMLElement;
    onSelectDay: (day: number) => void;
    onResetProgress?: () => void;
  }) {
    this.container = container;
    this.onSelectDay = onSelectDay;
    this.onResetProgress = onResetProgress;

    this.render();
  }

  private render(): void {
    this.drawerEl = document.createElement('div');
    this.drawerEl.className = 'calendar-drawer-overlay';
    this.drawerEl.id = 'calendarDrawerOverlay';
    this.drawerEl.setAttribute('role', 'dialog');
    this.drawerEl.setAttribute('aria-modal', 'true');
    this.drawerEl.setAttribute('aria-hidden', 'true');

    this.container.appendChild(this.drawerEl);

    this.drawerEl.addEventListener('click', (e) => {
      if (e.target === this.drawerEl) {
        this.close();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;

      if (e.key === 'Escape') {
        this.close();
      } else if (e.key === 'Tab') {
        const focusables = this.drawerEl.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !this.drawerEl.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !this.drawerEl.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });
  }

  private previouslyFocusedEl: HTMLElement | null = null;

  open(): void {
    this.previouslyFocusedEl = document.activeElement as HTMLElement | null;
    this.renderContent();
    this.drawerEl.classList.add('is-open');
    this.drawerEl.setAttribute('aria-hidden', 'false');
    this.isOpen = true;
    document.body.classList.add('drawer-open');
    soundManager.playClick();

    setTimeout(() => {
      (this.drawerEl.querySelector('.drawer-close-btn') as HTMLElement | null)?.focus();
    }, 50);
  }

  close(): void {
    if (!this.isOpen) return;
    this.drawerEl.classList.remove('is-open');
    this.drawerEl.setAttribute('aria-hidden', 'true');
    this.isOpen = false;
    document.body.classList.remove('drawer-open');
    soundManager.playClick();

    if (this.previouslyFocusedEl) {
      this.previouslyFocusedEl.focus();
      this.previouslyFocusedEl = null;
    }
  }

  toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  renderContent(): void {
    const lang = storage.getLanguage();
    const completedDays = storage.getCompletedDays();

    this.drawerEl.innerHTML = `
      <div class="calendar-drawer-panel" role="document">
        <header class="drawer-header">
          <div class="drawer-title-group">
            <h2 class="drawer-title">${t('drawerTitle', lang)}</h2>
            <div class="drawer-progress-actions">
              <p class="drawer-subtitle">${completedDays.length} ${t('of24', lang)}</p>
              ${completedDays.length > 0 ? `
                <button 
                  type="button" 
                  class="drawer-reset-btn" 
                  id="btnDrawerReset" 
                  aria-label="${t('resetStorage', lang)}"
                  title="${t('resetStorage', lang)}"
                >
                  <span class="drawer-reset-icon" aria-hidden="true">🔄</span>
                  <span>${t('resetStorage', lang)}</span>
                </button>
              ` : ''}
            </div>
          </div>
          <button type="button" class="drawer-close-btn" id="btnDrawerClose" aria-label="${t('closeCalendar', lang)}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </header>

        <div class="drawer-grid" role="list">
          ${ADVENT_DAYS.map((item) => {
            const status = dateGate.getDayStatus(item.day);
            const isToday = dateGate.isToday(item.day);
            const isUnlocked = status !== 'locked';

            let badgeText = t('statusLocked', lang);
            if (status === 'available') badgeText = isToday ? t('todayBadge', lang) : t('statusAvailable', lang);
            if (status === 'completed') badgeText = t('statusCompleted', lang);

            return `
              <div 
                class="drawer-card card--${status} ${isToday ? 'card--today' : ''}" 
                role="listitem"
                data-day="${item.day}"
              >
                <div class="card-num-box">
                  <span class="card-num">${item.day}</span>
                  ${status === 'locked' ? '<span class="card-icon">🔒</span>' : ''}
                  ${status === 'completed' ? '<span class="card-icon">⭐</span>' : ''}
                </div>
                <div class="card-info">
                  <h3 class="card-theme">${item.theme}</h3>
                  <p class="card-loc">${item.location}</p>
                  <span class="card-status-badge badge-${status}">
                    ${status === 'locked' ? `${t('unlocksOn', lang)} ${item.dateLabel}` : badgeText}
                  </span>
                </div>
                <button 
                  type="button" 
                  class="card-open-btn ${!isUnlocked ? 'is-disabled' : ''}" 
                  ${!isUnlocked ? 'disabled' : ''}
                  data-day="${item.day}"
                  aria-label="${isUnlocked ? (status === 'completed' ? t('revisit', lang) : t('open', lang)) : t('statusLocked', lang)} ${t('day', lang)} ${item.day}: ${item.theme}"
                >
                  ${isUnlocked ? (status === 'completed' ? t('revisit', lang) : t('open', lang)) : t('statusLocked', lang)}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    document.getElementById('btnDrawerClose')?.addEventListener('click', () => {
      this.close();
    });

    document.getElementById('btnDrawerReset')?.addEventListener('click', () => {
      soundManager.playClick();
      if (this.onResetProgress) {
        this.onResetProgress();
      } else {
        storage.resetAll();
      }
      this.renderContent();
    });

    this.drawerEl.querySelectorAll('.card-open-btn:not([disabled])').forEach((btnEl) => {
      const btn = btnEl as HTMLElement;
      btn.addEventListener('click', () => {
        const day = parseInt(btn.dataset.day || '1', 10);
        this.close();
        this.onSelectDay(day);
      });
    });
  }
}
