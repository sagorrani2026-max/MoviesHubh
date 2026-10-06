/**
 * Zero-Latency Web Audio Synthesizer for Subtle Surround Lo-Fi Touch / Click Feedback
 * Generates a soft, warm, low-fi cinema surround click noise when visitors interact
 * with buttons, movie cards, or download controls. Never blocks the main UI thread.
 */

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioCtx) {
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      sharedAudioCtx = new AudioCtx();
    }
  }
  if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

export function playSurroundTouchSound(variant: 'soft' | 'card' = 'soft'): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Subtle Warm Lo-Fi Sub-Thump Oscillator (Surround Cinema Feel)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    osc.type = 'sine';
    const startFreq = variant === 'card' ? 165 : 210;
    const endFreq = variant === 'card' ? 48 : 62;

    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.048);

    oscGain.gain.setValueAtTime(0.065, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.052);

    // 2. Soft Low-Quality / Lo-Fi Filtered Tactile Noise Burst
    const bufferSize = Math.floor(ctx.sampleRate * 0.025);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(950, now);
    filter.Q.setValueAtTime(1.8, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.035, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.024);

    if (panner) {
      // Slight stereo surround spread
      panner.pan.setValueAtTime((Math.random() - 0.5) * 0.25, now);
      osc.connect(oscGain);
      oscGain.connect(panner);
      panner.connect(ctx.destination);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(panner);
    } else {
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
    }

    osc.start(now);
    osc.stop(now + 0.055);
    whiteNoise.start(now);
    whiteNoise.stop(now + 0.025);
  } catch (_err) {
    // Ignore audio errors if browser autoplay policy blocks before first interaction
  }
}

/**
 * Venom Symbiote Roar + Spider-Man Dual Web-Shoot Twang ("THWIP! THWIP!") Sound Effect
 * Triggered when Admin logs in with correct username & password!
 */
export function playVenomSymbioteWebShootAudio(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. Deep Venom Symbiote Monster Growl / Sub-Bass Roar
    const growlOsc = ctx.createOscillator();
    const growlGain = ctx.createGain();
    growlOsc.type = 'sawtooth';
    growlOsc.frequency.setValueAtTime(95, now);
    growlOsc.frequency.exponentialRampToValueAtTime(36, now + 0.65);
    growlOsc.frequency.exponentialRampToValueAtTime(72, now + 1.25);
    growlGain.gain.setValueAtTime(0.22, now);
    growlGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
    growlOsc.connect(growlGain);
    growlGain.connect(ctx.destination);
    growlOsc.start(now);
    growlOsc.stop(now + 1.4);

    // 2. Web-Shoot ("THWIP!" High-Velocity Whip Snap)
    const triggerWebThwip = (startTime: number) => {
      const thwipOsc = ctx.createOscillator();
      const thwipGain = ctx.createGain();
      thwipOsc.type = 'triangle';
      thwipOsc.frequency.setValueAtTime(320, startTime);
      thwipOsc.frequency.exponentialRampToValueAtTime(2400, startTime + 0.09);
      thwipOsc.frequency.exponentialRampToValueAtTime(680, startTime + 0.22);
      thwipGain.gain.setValueAtTime(0.24, startTime);
      thwipGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.24);
      thwipOsc.connect(thwipGain);
      thwipGain.connect(ctx.destination);
      thwipOsc.start(startTime);
      thwipOsc.stop(startTime + 0.24);

      // Pressurized Air Hiss for Web Shooter
      const bufLen = Math.floor(ctx.sampleRate * 0.16);
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const ch = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) {
        ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(2800, startTime);
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.18, startTime);
      nGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.16);
      noise.connect(bp);
      bp.connect(nGain);
      nGain.connect(ctx.destination);
      noise.start(startTime);
      noise.stop(startTime + 0.16);
    };

    triggerWebThwip(now + 0.18);
    triggerWebThwip(now + 0.44);
    triggerWebThwip(now + 0.72);
  } catch (_err) {
    // Ignore if audio context not unlocked
  }
}

/**
 * "HIT: The Third Case" Brutal Mass Character Intro Audio ("WELCOME BOSS • SAGOR")
 * Combines a deep South-Indian BGM sub-bass drop, metallic axe/blade blood-slash,
 * and a dramatic brass-horn mass hero impact.
 */
export function playHitThirdCaseMassIntroAudio(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. Massive Cinema Sub-Bass Impact Drop ("BOOM!")
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(135, now);
    subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.85);
    subGain.gain.setValueAtTime(0.32, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.15);

    // 2. Brutal Metallic Blade / Blood-Slash ("SHING-SLASH!")
    const triggerBladeSlash = (startTime: number, startFreq: number, endFreq: number) => {
      const bladeOsc = ctx.createOscillator();
      const bladeGain = ctx.createGain();
      bladeOsc.type = 'sawtooth';
      bladeOsc.frequency.setValueAtTime(startFreq, startTime);
      bladeOsc.frequency.exponentialRampToValueAtTime(endFreq, startTime + 0.14);
      bladeGain.gain.setValueAtTime(0.22, startTime);
      bladeGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);
      bladeOsc.connect(bladeGain);
      bladeGain.connect(ctx.destination);
      bladeOsc.start(startTime);
      bladeOsc.stop(startTime + 0.24);

      const bufLen = Math.floor(ctx.sampleRate * 0.18);
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const ch = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) {
        ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.06));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(1800, startTime);
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.2, startTime);
      nGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);
      noise.connect(hp);
      hp.connect(nGain);
      nGain.connect(ctx.destination);
      noise.start(startTime);
      noise.stop(startTime + 0.18);
    };

    triggerBladeSlash(now + 0.12, 420, 3100);
    triggerBladeSlash(now + 0.36, 520, 3600);

    // 3. Mass Hero Brass-Synth BGM Chord ("SAGOR — THE THIRD CASE")
    const brassFreqs = [65.41, 130.81, 196.0];
    brassFreqs.forEach((freq) => {
      const brass = ctx.createOscillator();
      const bGain = ctx.createGain();
      brass.type = 'sawtooth';
      brass.frequency.setValueAtTime(freq, now + 0.42);
      bGain.gain.setValueAtTime(0.09, now + 0.42);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + 1.85);
      brass.connect(bGain);
      bGain.connect(ctx.destination);
      brass.start(now + 0.42);
      brass.stop(now + 1.9);
    });
  } catch (_err) {
    // Ignore if audio context blocked
  }
}


