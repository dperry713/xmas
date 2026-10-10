/**
 * The Advent Piazza — Main Application Coordinator
 */

import { PiazzaScene3D } from './components/piazzaScene3D.js';
import { DayModal } from './components/dayModal.js';
import { CalendarDrawer } from './components/calendarDrawer.js';
import { StudioBar } from './components/studioBar.js';
import { storage } from './services/storage.js';
import { dateGate } from './services/dateGate.js';
import { t } from './data/translations.js';
import { soundManager } from './audio/soundManager.js';

class AdventApp {
  constructor() {
    this.init();
  }

  init() {
    // Check URL query parameters for embedded mode or direct day linking
    const params = new URLSearchParams(window.location.search);
    if (params.get('embedded') === 'true' || window.self !== window.top) {
      document.body.classList.add('embed-mode-active');
    }

    const appContainer = document.getElementById('app');
    const piazzaContainer = document.getElementById('piazzaContainer');

    // 1. Initialize Day Modal
    this.dayModal = new DayModal({
      container: appContainer,
      onCompletedChanged: (day) => {
        this.piazzaScene.updateAtmosphere();
        this.updateHeader();
      },
      onNavigateDay: (day) => {
        this.piazzaScene.focusOnDay(day);
      }
    });

    // 2. Initialize Calendar Drawer
    this.calendarDrawer = new CalendarDrawer({
      container: appContainer,
      onSelectDay: (day) => {
        this.piazzaScene.focusOnDay(day);
        this.dayModal.open(day);
      }
    });

    // 3. Initialize Interactive High-Fidelity 3D Piazza Scene
    this.piazzaScene = new PiazzaScene3D({
      container: piazzaContainer,
      onSelectDay: (day) => {
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
    });

    // 7. Initial UI sync
    this.updateHeader();

    // Check if URL specified a direct day to open: e.g. ?day=1
    const directDay = parseInt(params.get('day'), 10);
    if (directDay >= 1 && directDay <= 24 && dateGate.isDayUnlocked(directDay)) {
      setTimeout(() => {
        this.piazzaScene.focusOnDay(directDay);
        this.dayModal.open(directDay);
      }, 600);
    }
  }

  bindHeaderControls() {
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

  updateAudioIcons() {
    const isSoundOn = storage.getSoundEnabled();
    const iconOn = document.getElementById('iconAudioOn');
    const iconOff = document.getElementById('iconAudioOff');

    if (iconOn && iconOff) {
      iconOn.style.display = isSoundOn ? 'block' : 'none';
      iconOff.style.display = isSoundOn ? 'none' : 'block';
    }
  }

  updateHeader() {
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

  updateAllComponents() {
    this.updateHeader();
    this.updateAudioIcons();
    this.piazzaScene.updateAtmosphere();
    this.studioBar.renderContent();
  }
}

// Start application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new AdventApp();
});
