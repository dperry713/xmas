/**
 * Creative Studio & Client Review Bar
 * Tool for the studio team, art directors, and Church publishing team
 * to simulate dates, unlock all days, switch languages, adjust graphic quality, toggle sound, and test embed modes.
 */

import { SUPPORTED_LANGUAGES, t } from '../data/translations';
import { storage } from '../services/storage';
import { dateGate } from '../services/dateGate';
import { soundManager } from '../audio/soundManager';
import type { QualityLevel } from '../types/advent';

export class StudioBar {
  private container: HTMLElement;
  private onStateChanged: () => void;
  public isExpanded: boolean = false;
  private barEl!: HTMLElement;

  constructor({ container, onStateChanged }: { container: HTMLElement; onStateChanged: () => void }) {
    this.container = container;
    this.onStateChanged = onStateChanged;

    this.render();
  }

  private render(): void {
    this.barEl = document.createElement('aside');
    this.barEl.className = 'studio-toolbar';
    this.barEl.id = 'studioToolbar';
    this.barEl.setAttribute('aria-label', 'Creative Studio Review Tools');

    this.container.appendChild(this.barEl);
    this.renderContent();
  }

  renderContent(): void {
    const lang = storage.getLanguage();
    const unlockAll = storage.getUnlockAll();
    const simDay = storage.getSimulatedDay() || dateGate.getActiveDay();
    const soundOn = storage.getSoundEnabled();
    const currentQuality = storage.getQualityLevel();

    this.barEl.innerHTML = `
      <div class="studio-header">
        <button type="button" class="studio-toggle-btn" id="btnToggleStudio" aria-expanded="${this.isExpanded}">
          <span class="studio-icon">🛠️</span>
          <span class="studio-title-text">${t('studioControls', lang)}</span>
          <span class="studio-badge-date">Sim: Dec ${simDay}</span>
          <svg class="studio-chevron ${this.isExpanded ? 'is-up' : ''}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </div>

      <div class="studio-panel ${this.isExpanded ? 'is-open' : ''}" id="studioPanel">
        <!-- Date Simulation Slider -->
        <div class="studio-control-group">
          <label class="studio-label" for="simDateSlider">
            <strong>${t('simulateDate', lang)}:</strong>
            <span class="sim-val" id="simValLabel">Dec ${simDay}</span>
          </label>
          <input 
            type="range" 
            id="simDateSlider" 
            min="1" 
            max="24" 
            value="${simDay}" 
            class="studio-range" 
            aria-label="Simulate Advent Date"
          />
        </div>

        <!-- Studio Unlock All Toggle -->
        <div class="studio-control-group toggle-group">
          <label class="studio-toggle-label" for="toggleUnlockAll">
            <input type="checkbox" id="toggleUnlockAll" ${unlockAll ? 'checked' : ''} />
            <span class="toggle-switch"></span>
            <span class="toggle-text">${t('unlockAll', lang)}</span>
          </label>
        </div>

        <!-- Language Selector -->
        <div class="studio-control-group">
          <label class="studio-label" for="selectLanguage">Language (i18n):</label>
          <select id="selectLanguage" class="studio-select" aria-label="Select Language">
            ${SUPPORTED_LANGUAGES.map(l => `
              <option value="${l.code}" ${l.code === lang ? 'selected' : ''}>
                ${l.flag} ${l.name}
              </option>
            `).join('')}
          </select>
        </div>

        <!-- Graphic Quality Selector -->
        <div class="studio-control-group">
          <label class="studio-label" for="selectQuality">${t('qualitySettings', lang)}:</label>
          <select id="selectQuality" class="studio-select" aria-label="Select Graphic Quality">
            <option value="auto" ${currentQuality === 'auto' ? 'selected' : ''}>⚡ Auto (Adaptive)</option>
            <option value="high" ${currentQuality === 'high' ? 'selected' : ''}>🌟 High (Max 3D)</option>
            <option value="medium" ${currentQuality === 'medium' ? 'selected' : ''}>⚖️ Medium</option>
            <option value="low" ${currentQuality === 'low' ? 'selected' : ''}>🔋 Low (Eco / Mobile)</option>
          </select>
        </div>

        <!-- Sound Toggle -->
        <div class="studio-control-group toggle-group">
          <label class="studio-toggle-label" for="toggleSound">
            <input type="checkbox" id="toggleSound" ${soundOn ? 'checked' : ''} />
            <span class="toggle-switch"></span>
            <span class="toggle-text">${t('soundToggle', lang)}</span>
          </label>
        </div>

        <!-- Action Buttons -->
        <div class="studio-action-row">
          <button type="button" class="studio-btn btn-reset" id="btnResetStorage">
            🔄 ${t('resetStorage', lang)}
          </button>
          <button type="button" class="studio-btn btn-embed" id="btnToggleEmbed">
            📱 ${t('embedMode', lang)}
          </button>
        </div>
      </div>
    `;

    document.getElementById('btnToggleStudio')?.addEventListener('click', () => {
      this.isExpanded = !this.isExpanded;
      this.renderContent();
    });

    const simSlider = document.getElementById('simDateSlider') as HTMLInputElement | null;
    simSlider?.addEventListener('input', (e) => {
      const input = e.target as HTMLInputElement;
      const val = parseInt(input.value, 10);
      const label = document.getElementById('simValLabel');
      if (label) label.textContent = `Dec ${val}`;
      storage.setSimulatedDay(val);
      this.onStateChanged();
    });

    document.getElementById('toggleUnlockAll')?.addEventListener('change', (e) => {
      const input = e.target as HTMLInputElement;
      storage.setUnlockAll(input.checked);
      soundManager.playClick();
      this.onStateChanged();
    });

    document.getElementById('selectLanguage')?.addEventListener('change', (e) => {
      const select = e.target as HTMLSelectElement;
      storage.setLanguage(select.value);
      this.onStateChanged();
    });

    document.getElementById('selectQuality')?.addEventListener('change', (e) => {
      const select = e.target as HTMLSelectElement;
      storage.setQualityLevel(select.value as QualityLevel);
      soundManager.playClick();
      this.onStateChanged();
    });

    document.getElementById('toggleSound')?.addEventListener('change', (e) => {
      const input = e.target as HTMLInputElement;
      storage.setSoundEnabled(input.checked);
      if (input.checked) soundManager.playBell(520);
    });

    document.getElementById('btnResetStorage')?.addEventListener('click', () => {
      if (confirm('Reset Advent Calendar progress and simulation?')) {
        storage.resetAll();
        soundManager.playClick();
        this.onStateChanged();
      }
    });

    document.getElementById('btnToggleEmbed')?.addEventListener('click', () => {
      document.body.classList.toggle('embed-mode-active');
      soundManager.playClick();
    });
  }
}
