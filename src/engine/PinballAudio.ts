// Audio sintético de alta fidelidad para Pinball usando Web Audio API sin dependencias externas
export class PinballAudio {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private magnetOscillator: OscillatorNode | null = null;
  private magnetGain: GainNode | null = null;

  constructor() {
    // AudioContext se inicializa en el primer gesto del usuario
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.magnetGain) {
      this.stopMagneticHum();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // Sonido de activación de flipper (golpe electromecánico de solenoide)
  public playFlipperUp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.05);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.07);

    // Segundo click mecánico metálico
    const noiseOsc = this.ctx.createOscillator();
    const noiseGain = this.ctx.createGain();
    noiseOsc.type = 'square';
    noiseOsc.frequency.setValueAtTime(520, t);
    noiseOsc.frequency.exponentialRampToValueAtTime(110, t + 0.03);

    noiseGain.gain.setValueAtTime(0.12, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    noiseOsc.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noiseOsc.start(t);
    noiseOsc.stop(t + 0.04);
  }

  // Sonido de retorno de flipper
  public playFlipperDown() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.04);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  // Sonido de impacto en Bumper (campana sintetizada con armónicos brillantes)
  public playBumperHit(frequency = 580) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(frequency, t);
    osc1.frequency.exponentialRampToValueAtTime(frequency * 1.5, t + 0.02);
    osc1.frequency.exponentialRampToValueAtTime(frequency * 0.9, t + 0.18);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(frequency * 2.76, t);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.22);
    osc2.stop(t + 0.22);
  }

  // Sonido de Slingshot (rebote elástico metálico)
  public playSlingshot() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.08);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  // Sonido de Plunger (disparo del resorte)
  public playPlungerLaunch(powerRatio = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(350 * powerRatio, t + 0.07);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.18);

    gain.gain.setValueAtTime(0.35 * powerRatio, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  // Sonido de caída en Hoyo Estratégico (Scoop / Sink)
  public playHoleCapture(isBossHole = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = isBossHole ? [440, 554, 659, 880] : [330, 392, 523, 659];

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = t + idx * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.2, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.16);
    });
  }

  // Sonido de eyección de bola del hoyo
  public playHoleEject() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(480, t + 0.08);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.11);
  }

  // Sonido de sacudida de mesa (Nudge)
  public playNudge() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(65, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.12);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  // Alarma de TILT
  public playTiltAlarm() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const pulseTime = t + i * 0.12;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, pulseTime);

      gain.gain.setValueAtTime(0.35, pulseTime);
      gain.gain.exponentialRampToValueAtTime(0.001, pulseTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(pulseTime);
      osc.stop(pulseTime + 0.09);
    }
  }

  // Zumbido magnético continuo mientras se manipula la bola
  public startMagneticHum() {
    if (this.isMuted || this.magnetOscillator) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    this.magnetOscillator = this.ctx.createOscillator();
    this.magnetGain = this.ctx.createGain();

    this.magnetOscillator.type = 'sawtooth';
    this.magnetOscillator.frequency.setValueAtTime(110, t);

    // Filtro pasa bajos para sonido de rayo magnético suave
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, t);

    this.magnetGain.gain.setValueAtTime(0.01, t);
    this.magnetGain.gain.linearRampToValueAtTime(0.15, t + 0.1);

    this.magnetOscillator.connect(filter);
    filter.connect(this.magnetGain);
    this.magnetGain.connect(this.ctx.destination);

    this.magnetOscillator.start(t);
  }

  public stopMagneticHum() {
    if (this.magnetOscillator && this.magnetGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.magnetGain.gain.linearRampToValueAtTime(0.001, t + 0.08);
      setTimeout(() => {
        try {
          this.magnetOscillator?.stop();
          this.magnetOscillator?.disconnect();
          this.magnetGain?.disconnect();
        } catch {
          // ignore
        }
        this.magnetOscillator = null;
        this.magnetGain = null;
      }, 90);
    }
  }

  // Sonido de ataque / habilidad de criatura
  public playCreatureAbility(element: string) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (element === 'fire') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + 0.15);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.35);
    } else if (element === 'water') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, t);
      osc.frequency.linearRampToValueAtTime(800, t + 0.1);
      osc.frequency.linearRampToValueAtTime(300, t + 0.3);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(780, t + 0.2);
    }

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.4);
  }

  // Bola perdida (Drain)
  public playBallDrain() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.45);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.48);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.5);
  }

  // Sonido de rebote metálico en clavo de Pachinko (Peg)
  public playPegHit() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 880 + Math.random() * 440;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, t + 0.04);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  // Sonido de captura en una de las 5 ranuras inferiores
  public playSlotHit(multiplier: number) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const isJackpot = multiplier >= 10;
    const notes = isJackpot ? [523, 659, 784, 1046, 1318] : [440, 554, 659];

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = t + idx * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(isJackpot ? 0.35 : 0.22, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.22);
    });
  }

  // Sonido de disparo rápido en ráfaga (Pachinko Rapid Fire)
  public playBurstLaunch() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.06);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.07);
  }
}

export const soundEngine = new PinballAudio();
