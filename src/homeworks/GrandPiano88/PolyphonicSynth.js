const MAX_VOICES = 8;
const FLOOR = 0.0001;
const PEAK = 0.075;
const ATTACK_SECONDS = 0.012;
const RELEASE_SECONDS = 0.04;

/** Owns the audio context and all oscillator/gain pairs. */
export class PolyphonicSynth {
  constructor({
    createContext = () => new AudioContext(),
    onVoicesChanged = () => {},
  } = {}) {
    this.createContext = createContext;
    this.onVoicesChanged = onVoicesChanged;
    this.context = null;
    this.voices = new Map();
    this.nodes = new Set();
  }

  get isSuspended() {
    return this.context?.state === 'suspended';
  }

  /** Call from a user activation before scheduling sound. */
  unlock() {
    this.context ??= this.createContext();
    if (this.context.state === 'running') return Promise.resolve();
    return this.context.resume();
  }

  /**
   * Start a MIDI note. At capacity, release the oldest held voice.
   * @returns {object|null} Voice identity, or null for a duplicate.
   */
  noteOn(midi, freqHz) {
    if (this.voices.has(midi)) return null;
    const context = this.context;
    if (!context) throw new Error('Unlock the audio context first.');

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const voice = { midi, oscillator, gain };

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(freqHz, now);
    gain.gain.setValueAtTime(FLOOR, now);
    gain.gain.exponentialRampToValueAtTime(PEAK, now + ATTACK_SECONDS);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.onended = () => this.#disconnect(voice);
    this.nodes.add(voice);

    try {
      oscillator.start(now);
    } catch (error) {
      this.#disconnect(voice);
      throw error;
    }

    if (this.voices.size === MAX_VOICES) {
      this.#release(this.voices.values().next().value);
    }

    this.voices.set(midi, voice);
    this.#notify();
    return voice;
  }

  /**
   * Release a held note. An expected voice must still own the MIDI pitch.
   * @returns {boolean} Whether a held voice was released.
   */
  noteOff(midi, expectedVoice, releaseDelaySeconds = 0) {
    const voice = this.voices.get(midi);
    if (!voice || (expectedVoice !== undefined && voice !== expectedVoice)) return false;

    this.#release(voice, releaseDelaySeconds);
    this.#notify();
    return true;
  }

  /** Stop held notes. Immediate mode clears existing release tails too. */
  stopAll(immediate = false) {
    const hadVoices = this.voices.size > 0;

    if (immediate) {
      for (const voice of this.nodes) this.#stopImmediately(voice);
      this.voices.clear();
    } else {
      for (const voice of this.voices.values()) this.#release(voice);
    }

    if (hadVoices) this.#notify();
  }

  /** Close the context and disconnect all audio nodes on teardown. */
  dispose() {
    this.onVoicesChanged = () => {};
    this.stopAll(true);
    const context = this.context;
    this.context = null;
    if (!context || context.state === 'closed') return Promise.resolve();
    return context.close();
  }

  #release(voice, delay = 0) {
    this.voices.delete(voice.midi);
    if (this.context.state !== 'running' && delay === 0) {
      this.#stopImmediately(voice);
      return;
    }

    const now = this.context.currentTime + delay;
    const level = voice.gain.gain;

    if (typeof level.cancelAndHoldAtTime === 'function') {
      level.cancelAndHoldAtTime(now);
    } else {
      const current = Math.max(level.value, FLOOR);
      level.cancelScheduledValues(now);
      level.setValueAtTime(current, now);
    }

    level.exponentialRampToValueAtTime(FLOOR, now + RELEASE_SECONDS);
    voice.oscillator.stop(now + RELEASE_SECONDS);
  }

  #stopImmediately(voice) {
    voice.oscillator.onended = null;
    try {
      voice.oscillator.stop(this.context.currentTime);
    } finally {
      this.#disconnect(voice);
    }
  }

  #disconnect(voice) {
    if (!this.nodes.delete(voice)) return;
    voice.oscillator.onended = null;
    voice.oscillator.disconnect();
    voice.gain.disconnect();
  }

  #notify() {
    this.onVoicesChanged(new Set(this.voices.keys()));
  }
}