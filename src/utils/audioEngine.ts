// Lightweight Web Audio API ambient synthesizer for rich soundstage preview
class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  public play(volume = 0.3) {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.stop(); // clear any previous

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.gainNode.gain.exponentialRampToValueAtTime(Math.max(volume, 0.01), this.ctx.currentTime + 1.2);
    this.gainNode.connect(this.ctx.destination);

    // Warm ambient chords (Fmaj9 / C harmonic spectrum)
    const frequencies = [174.61, 220.0, 261.63, 329.63, 392.0, 523.25];

    this.oscillators = frequencies.map((freq, i) => {
      const osc = this.ctx!.createOscillator();
      let panner: StereoPannerNode | null = null;
      try {
        panner = this.ctx!.createStereoPanner();
        panner.pan.setValueAtTime((i - 2.5) / 3, this.ctx!.currentTime);
      } catch (e) {
        panner = null;
      }
      const filter = this.ctx!.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(600 + i * 200, this.ctx!.currentTime);

      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

      if (panner) {
        osc.connect(filter);
        filter.connect(panner);
        panner.connect(this.gainNode!);
      } else {
        osc.connect(filter);
        filter.connect(this.gainNode!);
      }

      osc.start();
      return osc;
    });

    this.isPlaying = true;
  }

  public setVolume(vol: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(vol, 0.0001), this.ctx.currentTime);
    }
  }

  public stop() {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      setTimeout(() => {
        this.oscillators.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch (e) {}
        });
        this.oscillators = [];
      }, 500);
    } else {
      this.oscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      });
      this.oscillators = [];
    }
    this.isPlaying = false;
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}

export const soundEngine = new AmbientSoundEngine();
