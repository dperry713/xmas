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
import type { PerformanceMetrics } from './piazzaScene3D';

export interface StudioBarOptions {
  container: HTMLElement;
  onStateChanged: () => void;
  getPerformanceMetrics?: () => PerformanceMetrics;
  toggle2DFallback?: () => void;
  is2DMode?: () => boolean;
}

export class StudioBar {
  private container: HTMLElement;
  private onStateChanged: () => void;
  private getPerformanceMetrics?: () => PerformanceMetrics;
  private toggle2DFallback?: () => void;
  private is2DMode?: () => boolean;
  public isExpanded: boolean = false;
  private barEl!: HTMLElement;
  private hudIntervalId: number | null = null;

  constructor(options: StudioBarOptions) {
    this.container = options.container;
    this.onStateChanged = options.onStateChanged;
    this.getPerformanceMetrics = options.getPerformanceMetrics;
    this.toggle2DFallback = options.toggle2DFallback;
    this.is2DMode = options.is2DMode;

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

    const is2DActive = this.is2DMode ? this.is2DMode() : false;
    const metrics = this.getPerformanceMetrics ? this.getPerformanceMetrics() : null;

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

        <!-- Accessible 2D Fallback Toggle -->
        <div class="studio-control-group toggle-group">
          <label class="studio-toggle-label" for="toggle2DFallback">
            <input type="checkbox" id="toggle2DFallback" ${is2DActive ? 'checked' : ''} />
            <span class="toggle-switch"></span>
            <span class="toggle-text">♿ 2D Fallback Mode (WebGL Off)</span>
          </label>
        </div>

        <!-- Live Performance Profiler & Budget HUD -->
        ${metrics ? `
          <div class="studio-control-group perf-hud-group">
            <div class="perf-hud-header">
              <label class="studio-label"><strong>Performance & Frame Budget:</strong></label>
              <span class="perf-badge badge-${metrics.budgetStatus}">${metrics.budgetStatus.toUpperCase()}</span>
            </div>
            <div class="studio-perf-hud" id="studioPerfHud">
              <div class="perf-row">
                <span>FPS:</span>
                <strong id="hudFps">${metrics.fps} FPS</strong>
              </div>
              <div class="perf-row">
                <span>Frame Time:</span>
                <strong id="hudFrame">${metrics.frameTimeMs} ms <small>(budget: ${metrics.targetFrameBudgetMs}ms)</small></strong>
              </div>
              <div class="perf-row">
                <span>Draw Calls:</span>
                <strong id="hudCalls">${metrics.drawCalls}</strong>
              </div>
              <div class="perf-row">
                <span>Triangles:</span>
                <strong id="hudTris">${metrics.triangles.toLocaleString()}</strong>
              </div>
              <div class="perf-row">
                <span>Mode / Tier:</span>
                <strong id="hudTier">${metrics.is2DFallback ? 'Accessible 2D' : metrics.quality.toUpperCase()}</strong>
              </div>
            </div>
          </div>
        ` : ''}

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
      if (this.isExpanded) {
        this.startHudInterval();
      } else {
        this.stopHudInterval();
      }
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

    document.getElementById('toggle2DFallback')?.addEventListener('change', () => {
      soundManager.playClick();
      if (this.toggle2DFallback) {
        this.toggle2DFallback();
        this.renderContent();
      }
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

  private startHudInterval(): void {
    this.stopHudInterval();
    if (!this.getPerformanceMetrics) return;

    this.hudIntervalId = window.setInterval(() => {
      if (!this.isExpanded || !this.getPerformanceMetrics) return;
      const metrics = this.getPerformanceMetrics();
      const elFps = document.getElementById('hudFps');
      const elFrame = document.getElementById('hudFrame');
      const elCalls = document.getElementById('hudCalls');
      const elTris = document.getElementById('hudTris');
      const elTier = document.getElementById('hudTier');

      if (elFps) elFps.textContent = `${metrics.fps} FPS`;
      if (elFrame) elFrame.innerHTML = `${metrics.frameTimeMs} ms <small>(budget: ${metrics.targetFrameBudgetMs}ms)</small>`;
      if (elCalls) elCalls.textContent = `${metrics.drawCalls}`;
      if (elTris) elTris.textContent = metrics.triangles.toLocaleString();
      if (elTier) elTier.textContent = metrics.is2DFallback ? 'Accessible 2D' : metrics.quality.toUpperCase();
    }, 800);
  }

  private stopHudInterval(): void {
    if (this.hudIntervalId !== null) {
      clearInterval(this.hudIntervalId);
      this.hudIntervalId = null;
    }
  }

  public destroy(): void {
    this.stopHudInterval();
  }
}
