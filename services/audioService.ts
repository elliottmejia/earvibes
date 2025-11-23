import * as Tone from 'tone';
import type { SynthPreset } from '../types';

class AudioService {
  private vangelisSynth: Tone.PolySynth | null = null;
  private jumpSynth: Tone.PolySynth | null = null;
  private pianoSynth: Tone.PolySynth | null = null;

  private reverb: Tone.Reverb | null = null; // Hall for Vangelis/Jump
  private roomReverb: Tone.Reverb | null = null; // Room for Piano
  private delay: Tone.FeedbackDelay | null = null;

  private currentPreset: SynthPreset = 'PIANO';
  private isInitialized: boolean = false;

  public async init(): Promise<void> {
    if (this.isInitialized) return;

    await Tone.start();

    // 1. Create Effects Chains

    // Chain A: Lush Hall Reverb + Delay (For Vangelis, Jump)
    this.reverb = new Tone.Reverb({
      decay: 4.5,
      preDelay: 0.1,
      wet: 0.4,
    }).toDestination();
    await this.reverb.generate();

    this.delay = new Tone.FeedbackDelay({
      delayTime: '8n.', // Dotted 8th note
      feedback: 0.25,
      wet: 0.15,
    });
    this.delay.connect(this.reverb);

    // Chain B: Room Reverb (For Piano)
    this.roomReverb = new Tone.Reverb({
      decay: 1.5, // Shorter decay for "Room" feel
      preDelay: 0.01,
      wet: 0.2,
    }).toDestination();
    await this.roomReverb.generate();

    // 2. VANGELIS Synth (CS-80 Style)
    this.vangelisSynth = new Tone.PolySynth(Tone.MonoSynth, {
      volume: -8,
      oscillator: {
        type: 'fatsawtooth',
        count: 3,
        spread: 25,
      },
      envelope: {
        attack: 0.3,
        decay: 0.3,
        sustain: 0.7,
        release: 1.5, // Reduced from 2.0 for better voice management
      },
      filter: {
        Q: 1,
        type: 'lowpass',
        rolloff: -12,
      },
      filterEnvelope: {
        attack: 0.4,
        decay: 0.5,
        sustain: 0.5,
        release: 2.0,
        baseFrequency: 150,
        octaves: 3.5,
        exponent: 2,
      },
    });
    this.vangelisSynth.maxPolyphony = 12; // Optimized for 4-note chords (allows 3 simultaneous chords)
    this.vangelisSynth.connect(this.delay);

    // 3. JUMP Synth (Oberheim OB-X Style)
    this.jumpSynth = new Tone.PolySynth(Tone.MonoSynth, {
      volume: -8,
      oscillator: {
        type: 'sawtooth',
      },
      envelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0.8,
        release: 0.8,
      },
      filter: {
        Q: 3,
        type: 'lowpass',
        rolloff: -24,
      },
      filterEnvelope: {
        attack: 0.02,
        decay: 0.2,
        sustain: 0.4,
        release: 1.0,
        baseFrequency: 250,
        octaves: 4.5,
        exponent: 2,
      },
    });
    this.jumpSynth.maxPolyphony = 12; // Optimized
    this.jumpSynth.connect(this.delay);

    // 4. PIANO Synth (Classic/Acoustic-ish)
    this.pianoSynth = new Tone.PolySynth(Tone.Synth, {
      volume: -5,
      oscillator: {
        type: 'triangle',
      },
      envelope: {
        attack: 0.005,
        decay: 3.0,
        sustain: 0.0,
        release: 0.8,
      },
    });
    this.pianoSynth.maxPolyphony = 12; // Optimized
    this.pianoSynth.connect(this.roomReverb);

    this.isInitialized = true;
  }

  public setPreset(preset: SynthPreset): void {
    this.currentPreset = preset;
  }

  public getPreset(): SynthPreset {
    return this.currentPreset;
  }

  private getActiveSynth(): Tone.PolySynth | null {
    if (this.currentPreset === 'VANGELIS') return this.vangelisSynth;
    if (this.currentPreset === 'JUMP') return this.jumpSynth;
    if (this.currentPreset === 'PIANO') return this.pianoSynth;
    return this.pianoSynth;
  }

  public async playNotes(notes: string[], duration: number, timeOffset: number = 0): Promise<void> {
    await this.init();

    const synth = this.getActiveSynth();
    if (!synth) return;

    const now = Tone.now();
    const startTime = now + timeOffset;

    synth.triggerAttackRelease(notes, duration, startTime);
  }

  public async playProgression(notesMatrix: string[][], tempoBPM: number = 80): Promise<void> {
    await this.init();

    const synth = this.getActiveSynth();
    if (!synth) return;

    const beatDuration = 60 / tempoBPM;
    const chordDuration = beatDuration * 2; // Half notes
    const now = Tone.now();

    // Schedule all chords
    notesMatrix.forEach((chordNotes, index) => {
      const time = now + index * chordDuration;

      // Trigger the chord
      synth.triggerAttackRelease(chordNotes, chordDuration, time);
    });

    // Return a promise that resolves when the progression (plus tail) finishes
    return new Promise<void>((resolve) => {
      const totalTime = notesMatrix.length * chordDuration;
      // Piano decays, Synths release
      const tailTime = this.currentPreset === 'PIANO' ? 1.5 : 2.5;
      setTimeout(
        () => {
          resolve();
        },
        (totalTime + tailTime) * 1000
      );
    });
  }
}

export const audioService = new AudioService();
