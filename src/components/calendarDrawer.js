/**
 * Accessible Calendar Drawer Component
 * Allows users to view all 24 days in an accessible, structured grid
 * with statuses, keyboard navigation, and quick access.
 */

import { ADVENT_DAYS } from '../data/adventDays.js';
import { dateGate } from '../services/dateGate.js';
import { storage } from '../services/storage.js';
import { t } from '../data/translations.js';
import { soundManager } from '../audio/soundManager.js';

export class CalendarDrawer {
  constructor({ container, onSelectDay }) {
    this.container = container;
    this.onSelectDay = onSelectDay;
    this.isOpen = false;

    this.render();
  }

  render() {
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
  }

  open() {
    this.renderContent();
    this.drawerEl.classList.add('is-open');
    this.drawerEl.setAttribute('aria-hidden', 'false');
    this.isOpen = true;
    document.body.classList.add('drawer-open');
    soundManager.playClick();

    setTimeout(() => {
      this.drawerEl.querySelector('.drawer-close-btn')?.focus();
    }, 50);
  }

  close() {
    if (!this.isOpen) return;
    this.drawerEl.classList.remove('is-open');
    this.drawerEl.setAttribute('aria-hidden', 'true');
    this.isOpen = false;
    document.body.classList.remove('drawer-open');
    soundManager.playClick();
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  renderContent() {
    const lang = storage.getLanguage();
    const completedDays = storage.getCompletedDays();
    const activeDay = dateGate.getActiveDay();

    this.drawerEl.innerHTML = `
      <div class="calendar-drawer-panel" role="document">
        <header class="drawer-header">
          <div class="drawer-title-group">
            <h2 class="drawer-title">${t('drawerTitle', lang)}</h2>
            <p class="drawer-subtitle">${completedDays.length} ${t('of24', lang)}</p>
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
                  aria-label="Open Day ${item.day}: ${item.theme}"
                >
                  ${isUnlocked ? (status === 'completed' ? 'Revisit' : 'Open') : 'Locked'}
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

    this.drawerEl.querySelectorAll('.card-open-btn:not([disabled])').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const day = parseInt(btn.dataset.day, 10);
        this.close();
        this.onSelectDay(day);
      });
    });
  }
}
