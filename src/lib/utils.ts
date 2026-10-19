/**
 * Class name joiner utility
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Generate a random unique ID
 */
export function generateId(prefix: string = 'key'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

/**
 * Sound synthesis engine using HTML5 Web Audio API.
 * Synthesizes clicky mechanical keys, thocky switches, and typewriter bells
 * without requiring any external audio assets!
 */
class SoundEngine {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playKeySound(type: string = 'cherry-blue', volume: number = 0.5) {
    if (volume <= 0) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'cherry-blue': {
        // High click + bottom-out thud
        const osc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.035);

        clickGain.gain.setValueAtTime(0.8, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(clickGain);
        clickGain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.04);
        break;
      }

      case 'cherry-brown':
      case 'topre': {
        // Deeper tactile thock
        const osc = ctx.createOscillator();
        const thockGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.06);

        thockGain.gain.setValueAtTime(0.9, now);
        thockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(thockGain);
        thockGain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.07);
        break;
      }

      case 'cherry-red': {
        // Smooth linear bottom out
        const osc = ctx.createOscillator();
        const linGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.04);

        linGain.gain.setValueAtTime(0.6, now);
        linGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(linGain);
        linGain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }

      case 'typewriter': {
        // Mechanical strike + metallic ring
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const twGain = ctx.createGain();

        osc1.type = 'square';
        osc1.frequency.setValueAtTime(600, now);
        osc1.frequency.exponentialRampToValueAtTime(140, now + 0.05);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(2400, now);
        osc2.frequency.exponentialRampToValueAtTime(800, now + 0.07);

        twGain.gain.setValueAtTime(0.7, now);
        twGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc1.connect(twGain);
        osc2.connect(twGain);
        twGain.connect(masterGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.08);
        osc2.stop(now + 0.08);
        break;
      }

      default: {
        // Generic soft click
        const osc = ctx.createOscillator();
        const genGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.02);
        genGain.gain.setValueAtTime(0.5, now);
        genGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        osc.connect(genGain);
        genGain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.03);
      }
    }
  }

  playErrorSound(volume: number = 0.5) {
    if (volume <= 0) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.35, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.setValueAtTime(120, now + 0.05);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.13);
  }
}

export const soundEngine = new SoundEngine();
