/**
 * Daily Experience Modal Dialog
 * Displays the animated motion vignette, reflection, activity, scripture,
 * "Go Deeper" church links, and "Complete & Awaken Piazza" button.
 */

import { ADVENT_DAYS } from '../data/adventDays';
import { dateGate } from '../services/dateGate';
import { storage } from '../services/storage';
import { t } from '../data/translations';
import { soundManager } from '../audio/soundManager';
import { getVignetteMarkup } from './vignettes';
import type { AdventDay } from '../types/advent';

export class DayModal {
  private container: HTMLElement;
  private onCompletedChanged: (day: number) => void;
  private onNavigateDay: (day: number) => void;
  private currentDay: number | null = null;
  public isOpen: boolean = false;
  private previouslyFocusedEl: Element | null = null;
  private modalEl!: HTMLDivElement;

  constructor({
    container,
    onCompletedChanged,
    onNavigateDay
  }: {
    container: HTMLElement;
    onCompletedChanged: (day: number) => void;
    onNavigateDay: (day: number) => void;
  }) {
    this.container = container;
    this.onCompletedChanged = onCompletedChanged;
    this.onNavigateDay = onNavigateDay;

    this.renderContainer();
    this.bindGlobalKeys();
  }

  private renderContainer(): void {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'day-modal-overlay';
    this.modalEl.id = 'dayModalOverlay';
    this.modalEl.setAttribute('role', 'dialog');
    this.modalEl.setAttribute('aria-modal', 'true');
    this.modalEl.setAttribute('aria-hidden', 'true');

    this.container.appendChild(this.modalEl);

    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) {
        this.close();
      }
    });
  }

  private bindGlobalKeys(): void {
    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;

      if (e.key === 'Escape') {
        this.close();
      } else if (e.key === 'ArrowLeft') {
        this.navigate(-1);
      } else if (e.key === 'ArrowRight') {
        this.navigate(1);
      } else if (e.key === 'Tab') {
        const focusables = this.modalEl.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !this.modalEl.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !this.modalEl.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });
  }

  open(dayNumber: number): void {
    const data = ADVENT_DAYS.find(d => d.day === dayNumber);
    if (!data) return;

    this.currentDay = dayNumber;
    this.previouslyFocusedEl = document.activeElement;

    // Record visit in storage
    storage.markDayVisited(dayNumber);

    this.renderContent(data);
    this.modalEl.classList.add('is-open');
    this.modalEl.setAttribute('aria-hidden', 'false');
    this.isOpen = true;
    document.body.classList.add('modal-open');

    // Focus close button for accessibility
    setTimeout(() => {
      const closeBtn = this.modalEl.querySelector('.modal-close-btn') as HTMLElement | null;
      if (closeBtn) closeBtn.focus();
    }, 50);

    // Play soft cathedral bell toll
    soundManager.playBell(380 + (dayNumber * 12));
  }

  close(): void {
    if (!this.isOpen) return;
    this.modalEl.classList.remove('is-open');
    this.modalEl.setAttribute('aria-hidden', 'true');
    this.isOpen = false;
    document.body.classList.remove('modal-open');

    if (this.previouslyFocusedEl && 'focus' in this.previouslyFocusedEl) {
      (this.previouslyFocusedEl as HTMLElement).focus();
    }
  }

  navigate(direction: number): void {
    if (!this.currentDay) return;
    const targetDay = this.currentDay + direction;
    if (targetDay < 1 || targetDay > 24) return;

    if (dateGate.isDayUnlocked(targetDay)) {
      soundManager.playClick();
      this.open(targetDay);
      if (this.onNavigateDay) this.onNavigateDay(targetDay);
    }
  }

  private renderContent(data: AdventDay): void {
    const lang = storage.getLanguage();
    const isCompleted = storage.isDayCompleted(data.day);
    const isUnlocked = dateGate.isDayUnlocked(data.day);

    const prevUnlocked = data.day > 1 && dateGate.isDayUnlocked(data.day - 1);
    const nextUnlocked = data.day < 24 && dateGate.isDayUnlocked(data.day + 1);

    const vignetteHtml = getVignetteMarkup(data.vignette?.type || 'radiant-star', data.vignette?.accentColor);

    this.modalEl.innerHTML = `
      <div class="day-modal-dialog" role="document">
        <!-- Modal Header with Navigation & Close -->
        <header class="day-modal-header">
          <div class="modal-day-badge">
            <span class="badge-num">${t('day', lang)} ${data.day}</span>
            <span class="badge-date">${data.dateLabel}</span>
          </div>

          <div class="modal-header-actions">
            <!-- Day Paging Buttons -->
            <button 
              type="button" 
              class="nav-day-btn btn-prev-day ${!prevUnlocked ? 'is-disabled' : ''}" 
              title="${t('previousDay', lang)}" 
              aria-label="${t('previousDay', lang)}"
              ${!prevUnlocked ? 'disabled' : ''}
              id="btnPrevDay"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button 
              type="button" 
              class="nav-day-btn btn-next-day ${!nextUnlocked ? 'is-disabled' : ''}" 
              title="${t('nextDay', lang)}" 
              aria-label="${t('nextDay', lang)}"
              ${!nextUnlocked ? 'disabled' : ''}
              id="btnNextDay"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            <!-- Close Modal -->
            <button 
              type="button" 
              class="modal-close-btn" 
              title="${t('closeModal', lang)}" 
              aria-label="${t('closeModal', lang)}"
              id="btnModalClose"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </header>

        <!-- Motion Artwork Vignette -->
        <div class="modal-vignette-container">
          ${vignetteHtml}
          <div class="vignette-caption">
            <span class="vignette-loc">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              ${data.location}
            </span>
          </div>
        </div>

        <!-- Modal Body Content -->
        <div class="day-modal-body">
          ${!isUnlocked ? `
            <div class="modal-locked-banner">
              <span class="locked-banner-icon">🔒</span>
              <div class="locked-banner-text">
                <strong>${t('statusLocked', lang)}</strong> — ${t('unlocksOn', lang)} ${data.dateLabel}.
              </div>
            </div>
          ` : ''}

          <h2 class="modal-theme-title">${data.theme}</h2>

          <!-- Scripture Quotation -->
          <blockquote class="modal-scripture-card">
            <p>${data.scripture}</p>
          </blockquote>

          <!-- Reflection Card -->
          <div class="modal-content-card">
            <h3 class="card-heading">
              <span class="heading-icon">✨</span>
              ${t('reflectionTitle', lang)}
            </h3>
            <p class="card-body-text">${data.reflection}</p>
          </div>

          <!-- Activity Card -->
          <div class="modal-content-card activity-card">
            <h3 class="card-heading">
              <span class="heading-icon">🕯️</span>
              ${t('activityTitle', lang)}
            </h3>
            <p class="card-body-text">${data.activity}</p>
          </div>

          <!-- Piazza Awakening Impact Note -->
          <div class="modal-awakening-card">
            <span class="awakening-sparkle">🌟</span>
            <span class="awakening-text"><strong>${t('piazzaStatus', lang)}:</strong> ${data.piazzaAwakening}</span>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <footer class="day-modal-footer">
          <!-- Mark Completed / Awaken Piazza -->
          ${isUnlocked ? `
            <button 
              type="button" 
              class="action-btn-complete ${isCompleted ? 'is-completed' : ''}" 
              id="btnToggleComplete"
            >
              <span class="btn-icon">
                ${isCompleted ? `
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ` : `
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                `}
              </span>
              <span class="btn-text">
                ${isCompleted ? t('completedBadge', lang) : t('markCompleted', lang)}
              </span>
            </button>
          ` : `
            <button 
              type="button" 
              class="action-btn-complete is-locked-btn" 
              disabled
              id="btnToggleComplete"
            >
              <span class="btn-icon">🔒</span>
              <span class="btn-text">${t('statusLocked', lang)} · ${t('unlocksOn', lang)} ${data.dateLabel}</span>
            </button>
          `}

          <!-- Go Deeper Link through to Church Content -->
          <a 
            href="${data.goDeeperUrl}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="action-btn-deeper"
            id="btnGoDeeper"
          >
            <span>${data.goDeeperLabel || t('goDeeperBtn', lang)}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </footer>
      </div>
    `;

    document.getElementById('btnModalClose')?.addEventListener('click', () => {
      soundManager.playClick();
      this.close();
    });

    document.getElementById('btnPrevDay')?.addEventListener('click', () => {
      this.navigate(-1);
    });

    document.getElementById('btnNextDay')?.addEventListener('click', () => {
      this.navigate(1);
    });

    const completeBtn = document.getElementById('btnToggleComplete');
    completeBtn?.addEventListener('click', () => {
      const currentCompleted = storage.isDayCompleted(data.day);
      if (currentCompleted) {
        storage.unmarkDayCompleted(data.day);
        soundManager.playClick();
      } else {
        storage.markDayCompleted(data.day);
        soundManager.playCelebrationSparkle();
      }

      this.onCompletedChanged(data.day);
      this.renderContent(data);
    });
  }
}
