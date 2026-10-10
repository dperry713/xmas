/**
 * Sound Manager (Web Audio API Synthesizer)
 * High-performance, zero-asset festive chimes, bell tolls, and ambient winter harmonics.
 */

import { storage } from '../services/storage';

class SoundManager {
  private ctx: AudioContext | null = null;

  constructor() {}

  initContext(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  isEnabled(): boolean {
    return storage.getSoundEnabled();
  }

  /**
   * Cathedral Bell Toll (Harmonic additive synthesis)
   */
  playBell(freq = 440): void {
    if (!this.isEnabled()) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const partials = [
      { ratio: 0.5, amp: 0.35, decay: 3.5 },
      { ratio: 1.0, amp: 0.5, decay: 2.8 },
      { ratio: 1.2, amp: 0.3, decay: 2.0 },
      { ratio: 1.5, amp: 0.25, decay: 1.8 },
      { ratio: 2.0, amp: 0.2, decay: 1.2 },
      { ratio: 2.7, amp: 0.1, decay: 0.8 }
    ];

    partials.forEach(({ ratio, amp, decay }) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * ratio, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(amp * 0.15, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + decay);
    });
  }

  /**
   * Crystalline harp arpeggio for unlocking / completing a day
   */
  playCelebrationSparkle(): void {
    if (!this.isEnabled()) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const noteTime = now + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.12, noteTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 1.25);
    });
  }

  /**
   * Subtle wooden / soft click UI feedback
   */
  playClick(): void {
    if (!this.isEnabled()) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }
}

export const soundManager = new SoundManager();
