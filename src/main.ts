/**
 * The Advent Piazza — Main Application Coordinator (TypeScript)
 * Coordinates the 3D scene engine, modal dialogues, drawer navigation,
 * studio controls, audio synthesizer, and localized state persistence.
 */

import { PiazzaScene3D } from './components/piazzaScene3D';
import { DayModal } from './components/dayModal';
import { CalendarDrawer } from './components/calendarDrawer';
import { StudioBar } from './components/studioBar';
import { storage } from './services/storage';
import { dateGate } from './services/dateGate';
import { t } from './data/translations';
import { soundManager } from './audio/soundManager';

export class AdventApp {
  private dayModal!: DayModal;
  private calendarDrawer!: CalendarDrawer;
  private piazzaScene!: PiazzaScene3D;
  private studioBar!: StudioBar;

  constructor() {
    this.init();
  }

  private init(): void {
    // Check URL query parameters for embedded mode or direct day linking
    const params = new URLSearchParams(window.location.search);
    if (params.get('embedded') === 'true' || window.self !== window.top) {
      document.body.classList.add('embed-mode-active');
    }

    const appContainer = document.getElementById('app') as HTMLElement;
    const piazzaContainer = document.getElementById('piazzaContainer') as HTMLElement;

    if (!appContainer || !piazzaContainer) {
      console.error('Core application containers not found in DOM.');
      return;
    }

    // 1. Initialize Day Modal
    this.dayModal = new DayModal({
      container: appContainer,
      onCompletedChanged: (_day: number) => {
        this.piazzaScene.updateAtmosphere();
        this.updateHeader();
      },
      onNavigateDay: (day: number) => {
        this.piazzaScene.focusOnDay(day);
      }
    });

    // 2. Initialize Calendar Drawer
    this.calendarDrawer = new CalendarDrawer({
      container: appContainer,
      onSelectDay: (day: number) => {
        this.piazzaScene.focusOnDay(day);
        this.dayModal.open(day);
      }
    });

    // 3. Initialize Interactive High-Fidelity 3D Piazza Scene
    this.piazzaScene = new PiazzaScene3D({
      container: piazzaContainer,
      onSelectDay: (day: number) => {
        this.piazzaScene.focusOnDay(day);
        this.dayModal.open(day);
      }
    });

    // 4. Initialize Studio Review Toolbar
    this.studioBar = new StudioBar({
      container: appContainer,
      onStateChanged: () => {
        this.updateAllComponents();
      }
    });

    // 5. Bind Header Controls
    this.bindHeaderControls();

    // 6. Subscribe to storage changes
    storage.subscribe(() => {
      this.updateHeader();
      this.piazzaScene.updateAtmosphere();
      this.piazzaScene.applyCurrentQuality();
    });

    // 7. Initial UI sync
    this.updateHeader();

    // Check if URL specified a direct day to open: e.g. ?day=1
    const directDayParam = params.get('day');
    if (directDayParam) {
      const directDay = parseInt(directDayParam, 10);
      if (directDay >= 1 && directDay <= 24 && dateGate.isDayUnlocked(directDay)) {
        setTimeout(() => {
          this.piazzaScene.focusOnDay(directDay);
          this.dayModal.open(directDay);
        }, 600);
      }
    }

    // Expose instance on window for testing, automated verification, or host iframe messaging
    (window as unknown as { __ADVENT_APP__: AdventApp }).__ADVENT_APP__ = this;
  }

  private bindHeaderControls(): void {
    // Calendar Drawer button
    document.getElementById('btnOpenCalendar')?.addEventListener('click', () => {
      this.calendarDrawer.toggle();
    });

    // Audio Mute/Unmute button
    const audioBtn = document.getElementById('btnHeaderAudio');
    audioBtn?.addEventListener('click', () => {
      const current = storage.getSoundEnabled();
      storage.setSoundEnabled(!current);
      if (!current) {
        soundManager.playBell(520);
      }
      this.updateAudioIcons();
    });

    this.updateAudioIcons();
  }

  private updateAudioIcons(): void {
    const isSoundOn = storage.getSoundEnabled();
    const iconOn = document.getElementById('iconAudioOn');
    const iconOff = document.getElementById('iconAudioOff');

    if (iconOn && iconOff) {
      iconOn.style.display = isSoundOn ? 'block' : 'none';
      iconOff.style.display = isSoundOn ? 'none' : 'block';
    }
  }

  public updateHeader(): void {
    const lang = storage.getLanguage();
    const completed = storage.getCompletedDays();

    // Update translated header text
    const titleEl = document.getElementById('appTitle');
    if (titleEl) {
      titleEl.innerHTML = `<span class="title-icon" aria-hidden="true">✦</span> ${t('appTitle', lang)}`;
    }

    const subtitleEl = document.getElementById('appSubtitle');
    if (subtitleEl) {
      subtitleEl.textContent = t('appSubtitle', lang);
    }

    const countTextEl = document.getElementById('progressCountText');
    if (countTextEl) {
      countTextEl.textContent = `${completed.length} ${t('of24', lang)}`;
    }

    const calendarBtnText = document.getElementById('btnCalendarText');
    if (calendarBtnText) {
      calendarBtnText.textContent = t('openCalendar', lang);
    }
  }

  public updateAllComponents(): void {
    this.updateHeader();
    this.updateAudioIcons();
    this.piazzaScene.updateAtmosphere();
    this.piazzaScene.applyCurrentQuality();
    this.studioBar.renderContent();
  }

  /**
   * Graceful tear-down
   */
  public destroy(): void {
    this.piazzaScene.destroy();
  }
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AdventApp();
  });
} else {
  new AdventApp();
}
