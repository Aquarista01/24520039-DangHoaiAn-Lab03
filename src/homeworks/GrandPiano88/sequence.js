/**
 * @typedef {{ midi: number, freqHz: number, durationMs: number, deltaMs: number }} NoteEvent
 * durationMs is the held time. deltaMs is the gap from the previous note-on.
 */

/** Stores events in note-on order, even when note-offs arrive out of order. */
export class SequenceRecorder {
  constructor() {
    /** @type {NoteEvent[]} */
    this.events = [];
    this.active = new Map();
    this.previousStartMs = null;
  }

  noteOn(midi, freqHz, nowMs) {
    if (this.active.has(midi)) return;

    const deltaMs = this.previousStartMs === null ? 0 : nowMs - this.previousStartMs;
    const event = { midi, freqHz, durationMs: 0, deltaMs };
    this.events.push(event);
    this.active.set(midi, { event, startMs: nowMs });
    this.previousStartMs = nowMs;
  }

  noteOff(midi, nowMs) {
    const entry = this.active.get(midi);
    if (!entry) return;

    entry.event.durationMs = Math.max(0, nowMs - entry.startMs);
    this.active.delete(midi);
  }

  releaseAll(nowMs) {
    for (const midi of this.active.keys()) this.noteOff(midi, nowMs);
  }

  finish(nowMs) {
    this.releaseAll(nowMs);
    return this.events.map((event) => ({ ...event }));
  }
}

/**
 * Start events FIFO and release each voice at its own deadline.
 * Abort clears pending callbacks. The caller owns and silences audio.
 * @param {NoteEvent[]} events
 */
export function runSequence(events, {
  speed = 1,
  signal,
  noteOn,
  noteOff,
  now = () => performance.now(),
  setTimer = (fn, delay) => setTimeout(fn, delay),
  clearTimer = (timer) => clearTimeout(timer),
}) {
  if (![0.5, 1, 2].includes(speed)) throw new RangeError('Unsupported playback speed.');
  if (signal.aborted || events.length === 0) return Promise.resolve();

  let startMs = 0;
  const timeline = events.flatMap((event, index) => {
    startMs += event.deltaMs / speed;
    return [
      { at: startMs, index, isStart: true },
      { at: startMs + event.durationMs / speed, index, isStart: false },
    ];
  });

  // Simultaneous starts stay FIFO. An earlier voice can end at the next start.
  timeline.sort((a, b) => a.at - b.at || a.index - b.index || Number(b.isStart) - Number(a.isStart));

  const origin = now();
  const voices = new Map();
  let cursor = 0;
  let timer = null;

  return new Promise((resolve, reject) => {
    function cleanup() {
      if (timer !== null) clearTimer(timer);
      signal.removeEventListener('abort', handleAbort);
      voices.clear();
    }

    function handleAbort() {
      cleanup();
      resolve();
    }

    function drain() {
      timer = null;
      if (signal.aborted) return;

      try {
        const elapsed = now() - origin;

        while (!signal.aborted && cursor < timeline.length && timeline[cursor].at <= elapsed) {
          const { index, isStart } = timeline[cursor++];
          const event = events[index];

          if (isStart) {
            const voice = noteOn(event.midi, event.freqHz);
            if (voice) voices.set(index, voice);
          } else {
            const voice = voices.get(index);
            if (voice) noteOff(event.midi, voice);
            voices.delete(index);
          }
        }

        if (signal.aborted) return;

        if (cursor === timeline.length) {
          cleanup();
          resolve();
        } else {
          timer = setTimer(drain, Math.max(0, timeline[cursor].at - (now() - origin)));
        }
      } catch (error) {
        cleanup();
        reject(error);
      }
    }

    signal.addEventListener('abort', handleAbort, { once: true });
    drain();
  });
}