import { useCallback, useEffect, useRef, useState } from 'react';
import PianoKey from './PianoKey.jsx';
import { PolyphonicSynth } from './PolyphonicSynth.js';
import { PIANO_NOTES, WHITE_KEY_COUNT } from './pianoNotes.js';
import styles from './GrandPiano88.module.css';

export default function GrandPiano88() {
  const [pressed, setPressed] = useState(() => new Set());
  const [audioError, setAudioError] = useState('');
  const synthRef = useRef(null);
  const inputsRef = useRef(new Map());
  const tapsRef = useRef(new Set());

    const getSynth = useCallback(() => {
    synthRef.current ??= new PolyphonicSynth({ onVoicesChanged: setPressed });
    return synthRef.current;
  }, []);

  const unlockAudio = useCallback((synth) => {
    const ready = synth.unlock();
    void ready.catch(() => {
      if (synthRef.current !== synth) return;
      synth.stopAll(true);
      setAudioError('Audio could not start. Release the keys and try again.');
    });
    return ready;
  }, []);

  const onNoteOn = useCallback((note, inputId) => {
    const inputs = inputsRef.current;
    const held = inputs.get(note.midi);

    if (held) {
      held.add(inputId);
      return true;
    }

    const synth = getSynth();
    try {
      setAudioError('');
      unlockAudio(synth);
      if (!synth.noteOn(note.midi, note.freqHz)) return false;
    } catch {
      setAudioError('Audio could not start. Release the keys and try again.');
      return false;
    }

    inputs.set(note.midi, new Set([inputId]));
    return true;
  }, [getSynth, unlockAudio]);

  const onNoteOff = useCallback((midi, inputId, touchActivation = false) => {
    const inputs = inputsRef.current;
    const held = inputs.get(midi);
    if (!held?.delete(inputId) || held.size > 0) return;

    inputs.delete(midi);
    const synth = synthRef.current;
    if (!synth) return;

    if (touchActivation && synth.isSuspended) {
      // Touch pointerup can provide the first eligible user activation.
      unlockAudio(synth);
      synth.noteOff(midi, undefined, 0.1);
    } else {
      synth.noteOff(midi);
    }
  }, [unlockAudio]);

  const onNoteTap = useCallback((note) => {
    const inputId = Symbol('button activation');
    if (!onNoteOn(note, inputId)) return;

    const timers = tapsRef.current;
    const timer = window.setTimeout(() => {
      timers.delete(timer);
      onNoteOff(note.midi, inputId);
    }, 120);
    timers.add(timer);
  }, [onNoteOn, onNoteOff]);

  const releaseInputs = useCallback(() => {
    for (const timer of tapsRef.current) window.clearTimeout(timer);
    tapsRef.current.clear();
    inputsRef.current.clear();
  }, []);

    useEffect(() => {
    function handleWindowBlur() {
      releaseInputs();
      synthRef.current?.stopAll(true);
    }

    window.addEventListener('blur', handleWindowBlur);
    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      releaseInputs();
      const synth = synthRef.current;
      synthRef.current = null;
      if (synth) void synth.dispose().catch(() => {});
    };
  }, [releaseInputs]);

  return (
    <main className={styles.page}>
      <header>
        <p className={styles.eyebrow}>Lab 03 / Homework 2</p>
        <h1>Grand Piano 88</h1>
        <p>88-Key Polyphonic Piano &amp; Concurrent FIFO Sequencer</p>
      </header>
            {audioError && <p role="alert">{audioError}</p>}
      <section aria-labelledby="keyboard-title" className={styles.panel}>
        <h2 id="keyboard-title">Piano Keyboard</h2>
        <p id="keyboard-help">
          Scroll to reach all notes. Use Tab to focus a key, then hold Enter or
          Space to play. You can also press a key with a mouse or touch.
        </p>
        <div
          className={styles.scroller}
          role="group"
          aria-labelledby="keyboard-title"
          aria-describedby="keyboard-help"
        >
          <div className={styles.keyboard} style={{ '--white-count': WHITE_KEY_COUNT }}>
            {PIANO_NOTES.map((note) => (
              <PianoKey
                key={note.midi}
                note={note}
                isPressed={pressed.has(note.midi)}
                onNoteOn={onNoteOn}
                onNoteOff={onNoteOff}
                onNoteTap={onNoteTap}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}