/**
 * Interactive European Piazza Scene Component
 * Handles pan/zoom gestures, 24 activation hotspots, progressive atmospheric lighting,
 * and falling snow particle simulation.
 */

import { ADVENT_DAYS } from '../data/adventDays.js';
import { dateGate } from '../services/dateGate.js';
import { storage } from '../services/storage.js';
import { t } from '../data/translations.js';
import { soundManager } from '../audio/soundManager.js';

export class PiazzaScene {
  constructor({ container, onSelectDay }) {
    this.container = container;
    this.onSelectDay = onSelectDay;

    // Viewport transform state
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.lastPanX = 0;
    this.lastPanY = 0;

    // Snow particle system
    this.snowParticles = [];
    this.snowAnimId = null;

    this.render();
    this.initPanZoom();
    this.initSnowCanvas();
    this.updateAtmosphere();
  }

  render() {
    this.container.innerHTML = `
      <div class="piazza-viewport" id="piazzaViewport" role="region" aria-label="Interactive European Piazza">
        <div class="piazza-world" id="piazzaWorld">
          <!-- Master Illustrated Backdrop -->
          <img 
            src="/assets/piazza_master.jpg" 
            alt="European Piazza in Winter Twilight" 
            class="piazza-bg" 
            id="piazzaBg"
            draggable="false"
          />

          <!-- Progressive Illumination Overlays -->
          <div class="piazza-overlay-night" id="piazzaNightOverlay" aria-hidden="true"></div>
          <div class="piazza-overlay-glows" id="piazzaGlowsOverlay" aria-hidden="true">
            <!-- Dynamic light layers activated by completed days -->
            <div class="glow-layer glow-lantern-left" id="glowLanternLeft"></div>
            <div class="glow-layer glow-lantern-right" id="glowLanternRight"></div>
            <div class="glow-layer glow-cathedral-rose" id="glowCathedralRose"></div>
            <div class="glow-layer glow-clocktower" id="glowClockTower"></div>
            <div class="glow-layer glow-tree-lights" id="glowTreeLights"></div>
            <div class="glow-layer glow-tree-star" id="glowTreeStar"></div>
            <div class="glow-layer glow-bakery-hearth" id="glowBakeryHearth"></div>
            <div class="glow-layer glow-market-festoon" id="glowMarketFestoon"></div>
            <div class="glow-layer glow-fountain" id="glowFountain"></div>
            <div class="glow-layer glow-canopy-overhead" id="glowCanopyOverhead"></div>
          </div>

          <!-- Falling Snow Particle Canvas -->
          <canvas class="piazza-snow-canvas" id="piazzaSnowCanvas" aria-hidden="true"></canvas>

          <!-- 24 Interactive Hotspots Container -->
          <div class="piazza-hotspots-layer" id="piazzaHotspotsLayer" role="list">
            <!-- Dynamically populated -->
          </div>
        </div>

        <!-- On-screen Navigation Controls (Accessible Zoom & Reset) -->
        <nav class="piazza-view-controls" aria-label="Piazza Zoom & View Controls">
          <button class="view-ctrl-btn" id="btnZoomIn" title="Zoom In" aria-label="Zoom in on piazza">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>
          <button class="view-ctrl-btn" id="btnZoomOut" title="Zoom Out" aria-label="Zoom out of piazza">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>
          <button class="view-ctrl-btn" id="btnResetView" title="Reset Piazza View" aria-label="Reset piazza view to full overview">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
        </nav>

        <!-- Drag Hint overlay for new visitors -->
        <div class="piazza-pan-hint" id="piazzaPanHint" aria-hidden="true">
          <span>Explore the Piazza · Drag or scroll to discover all 24 moments</span>
        </div>
      </div>
    `;

    this.viewportEl = document.getElementById('piazzaViewport');
    this.worldEl = document.getElementById('piazzaWorld');
    this.hotspotsLayer = document.getElementById('piazzaHotspotsLayer');
    this.snowCanvas = document.getElementById('piazzaSnowCanvas');

    this.renderHotspots();
    this.bindControlEvents();
  }

  renderHotspots() {
    const lang = storage.getLanguage();
    const completedDays = storage.getCompletedDays();
    const activeDay = dateGate.getActiveDay();

    this.hotspotsLayer.innerHTML = '';

    ADVENT_DAYS.forEach((data) => {
      const status = dateGate.getDayStatus(data.day);
      const isToday = dateGate.isToday(data.day);

      const hotspot = document.createElement('button');
      hotspot.type = 'button';
      hotspot.className = `piazza-hotspot hotspot--${status} ${isToday ? 'hotspot--today' : ''}`;
      hotspot.style.left = `${data.coordinates.x}%`;
      hotspot.style.top = `${data.coordinates.y}%`;
      hotspot.dataset.day = data.day;
      hotspot.setAttribute('role', 'listitem');
      
      let statusText = t('statusLocked', lang);
      if (status === 'available') statusText = isToday ? t('todayBadge', lang) : t('statusAvailable', lang);
      if (status === 'completed') statusText = t('statusCompleted', lang);

      hotspot.setAttribute('aria-label', `Day ${data.day}: ${data.theme}. Status: ${statusText}. Location: ${data.location}`);

      // Inner badge markup
      hotspot.innerHTML = `
        <div class="hotspot-pulse" aria-hidden="true"></div>
        <div class="hotspot-core">
          <span class="hotspot-number">${data.day}</span>
          ${status === 'locked' ? `
            <span class="hotspot-icon-lock" aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
            </span>
          ` : ''}
          ${status === 'completed' ? `
            <span class="hotspot-icon-star" aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/></svg>
            </span>
          ` : ''}
        </div>
        <div class="hotspot-tooltip" aria-hidden="true">
          <span class="tooltip-day">Day ${data.day} · ${data.dateLabel}</span>
          <span class="tooltip-title">${data.theme}</span>
          <span class="tooltip-loc">${data.location}</span>
          <span class="tooltip-status status-${status}">${statusText}</span>
        </div>
      `;

      hotspot.addEventListener('click', (e) => {
        e.stopPropagation();
        soundManager.playClick();
        this.onSelectDay(data.day);
      });

      this.hotspotsLayer.appendChild(hotspot);
    });
  }

  updateAtmosphere() {
    const completedDays = storage.getCompletedDays();
    const count = completedDays.length;
    const ratio = Math.min(1, count / 24);

    // 1. Cool twilight overlay fades as more days are completed
    const nightOverlay = document.getElementById('piazzaNightOverlay');
    if (nightOverlay) {
      // 0 completed -> 0.45 dark tint. 24 completed -> 0.05 tint (warm vibrant glow)
      const opacity = 0.45 - (ratio * 0.40);
      nightOverlay.style.opacity = opacity.toFixed(2);
    }

    // 2. Progressive Awakening Layers activation
    const layers = [
      { id: 'glowLanternLeft', thresholdDay: 1 },
      { id: 'glowBakeryHearth', thresholdDay: 2 },
      { id: 'glowFountain', thresholdDay: 4 },
      { id: 'glowCathedralRose', thresholdDay: 8 },
      { id: 'glowClockTower', thresholdDay: 10 },
      { id: 'glowLanternRight', thresholdDay: 17 },
      { id: 'glowTreeLights', thresholdDay: 19 },
      { id: 'glowCanopyOverhead', thresholdDay: 23 },
      { id: 'glowTreeStar', thresholdDay: 24 }
    ];

    layers.forEach(({ id, thresholdDay }) => {
      const el = document.getElementById(id);
      if (el) {
        const isAwakened = completedDays.includes(thresholdDay) || storage.getUnlockAll();
        el.classList.toggle('is-awakened', isAwakened);
      }
    });

    // 3. Update Snow intensity
    this.snowMaxCount = Math.floor(45 + ratio * 85);
  }

  initPanZoom() {
    let startX = 0;
    let startY = 0;

    const onMouseDown = (e) => {
      if (e.target.closest('.piazza-hotspot') || e.target.closest('.view-ctrl-btn')) return;
      this.isDragging = true;
      startX = e.clientX - this.panX;
      startY = e.clientY - this.panY;
      this.viewportEl.classList.add('is-panning');
      const hint = document.getElementById('piazzaPanHint');
      if (hint) hint.classList.add('is-dismissed');
    };

    const onMouseMove = (e) => {
      if (!this.isDragging) return;
      e.preventDefault();
      this.panX = e.clientX - startX;
      this.panY = e.clientY - startY;
      this.constrainPan();
      this.applyTransform();
    };

    const onMouseUp = () => {
      this.isDragging = false;
      this.viewportEl.classList.remove('is-panning');
    };

    // Touch support for mobile and tablets
    let touchStartDist = 0;

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        startX = e.touches[0].clientX - this.panX;
        startY = e.touches[0].clientY - this.panY;
      } else if (e.touches.length === 2) {
        this.isDragging = false;
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
      const hint = document.getElementById('piazzaPanHint');
      if (hint) hint.classList.add('is-dismissed');
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 1 && this.isDragging) {
        this.panX = e.touches[0].clientX - startX;
        this.panY = e.touches[0].clientY - startY;
        this.constrainPan();
        this.applyTransform();
      } else if (e.touches.length === 2) {
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = currentDist / (touchStartDist || currentDist);
        this.zoom = Math.min(2.2, Math.max(0.9, this.zoom * factor));
        touchStartDist = currentDist;
        this.constrainPan();
        this.applyTransform();
      }
    };

    const onTouchEnd = () => {
      this.isDragging = false;
    };

    // Wheel zoom
    const onWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      this.setZoom(this.zoom + delta);
    };

    this.viewportEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    this.viewportEl.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    this.viewportEl.addEventListener('wheel', onWheel, { passive: false });
  }

  constrainPan() {
    const vpW = this.viewportEl.clientWidth;
    const vpH = this.viewportEl.clientHeight;
    const worldW = this.worldEl.clientWidth * this.zoom;
    const worldH = this.worldEl.clientHeight * this.zoom;

    const maxPanX = Math.max(0, (worldW - vpW) / 2 + 100);
    const maxPanY = Math.max(0, (worldH - vpH) / 2 + 100);

    this.panX = Math.max(-maxPanX, Math.min(maxPanX, this.panX));
    this.panY = Math.max(-maxPanY, Math.min(maxPanY, this.panY));
  }

  setZoom(newZoom) {
    this.zoom = Math.min(2.2, Math.max(0.9, newZoom));
    this.constrainPan();
    this.applyTransform();
  }

  applyTransform() {
    if (this.worldEl) {
      this.worldEl.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
    }
  }

  focusOnDay(dayNumber) {
    const dayData = ADVENT_DAYS.find(d => d.day === dayNumber);
    if (!dayData) return;

    const vpW = this.viewportEl.clientWidth;
    const vpH = this.viewportEl.clientHeight;
    const worldW = this.worldEl.clientWidth;
    const worldH = this.worldEl.clientHeight;

    const targetZoom = Math.min(1.8, Math.max(1.3, dayData.cameraFocus?.zoom || 1.4));
    this.zoom = targetZoom;

    // Center viewport on percentage coordinate
    const targetX = (dayData.coordinates.x / 100) * worldW;
    const targetY = (dayData.coordinates.y / 100) * worldH;

    this.panX = (vpW / 2) - (targetX * this.zoom);
    this.panY = (vpH / 2) - (targetY * this.zoom);

    this.constrainPan();
    this.worldEl.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    this.applyTransform();

    setTimeout(() => {
      if (this.worldEl) this.worldEl.style.transition = '';
    }, 850);
  }

  resetView() {
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.worldEl.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    this.applyTransform();
    setTimeout(() => {
      if (this.worldEl) this.worldEl.style.transition = '';
    }, 650);
  }

  bindControlEvents() {
    document.getElementById('btnZoomIn')?.addEventListener('click', () => {
      soundManager.playClick();
      this.setZoom(this.zoom + 0.25);
    });

    document.getElementById('btnZoomOut')?.addEventListener('click', () => {
      soundManager.playClick();
      this.setZoom(this.zoom - 0.25);
    });

    document.getElementById('btnResetView')?.addEventListener('click', () => {
      soundManager.playClick();
      this.resetView();
    });
  }

  initSnowCanvas() {
    const canvas = this.snowCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = this.worldEl.clientWidth || 1920;
      canvas.height = this.worldEl.clientHeight || 1080;
    };
    resize();
    window.addEventListener('resize', resize);

    this.snowMaxCount = 50;
    for (let i = 0; i < 120; i++) {
      this.snowParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.2 + 0.8,
        density: Math.random() * 30,
        speedY: Math.random() * 0.8 + 0.3,
        speedX: Math.random() * 0.6 - 0.3,
        opacity: Math.random() * 0.6 + 0.3
      });
    }

    let angle = 0;
    const animateSnow = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      angle += 0.01;

      const activeCount = Math.min(this.snowParticles.length, this.snowMaxCount);

      for (let i = 0; i < activeCount; i++) {
        const p = this.snowParticles[i];
        p.y += p.speedY;
        p.x += Math.sin(angle + p.density) * 0.4 + p.speedX;

        if (p.y > canvas.height) {
          p.y = -5;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
        ctx.fill();
      }

      this.snowAnimId = requestAnimationFrame(animateSnow);
    };

    animateSnow();
  }

  destroy() {
    if (this.snowAnimId) {
      cancelAnimationFrame(this.snowAnimId);
    }
  }
}
