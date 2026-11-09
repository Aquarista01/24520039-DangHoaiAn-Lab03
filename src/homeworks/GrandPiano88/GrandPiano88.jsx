import { useCallback, useEffect, useRef, useState } from 'react';
import PianoKey from './PianoKey.jsx';
import { PIANO_NOTES, WHITE_KEY_COUNT } from './pianoNotes.js';
import styles from './GrandPiano88.module.css';

export default function GrandPiano88() {
  const [pressed, setPressed] = useState(() => new Set());
  const inputsRef = useRef(new Map());
  const tapsRef = useRef(new Set());

  const onNoteOn = useCallback((note, inputId) => {
    const inputs = inputsRef.current;
    const held = inputs.get(note.midi);

    if (held) {
      held.add(inputId);
      return true;
    }

    inputs.set(note.midi, new Set([inputId]));
    setPressed((previous) => new Set(previous).add(note.midi));
    return true;
  }, []);

  const onNoteOff = useCallback((midi, inputId) => {
    const inputs = inputsRef.current;
    const held = inputs.get(midi);
    if (!held?.delete(inputId) || held.size > 0) return;

    inputs.delete(midi);
    setPressed((previous) => {
      const next = new Set(previous);
      next.delete(midi);
      return next;
    });
  }, []);

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
      setPressed(new Set());
    }

    window.addEventListener('blur', handleWindowBlur);
    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      releaseInputs();
    };
  }, [releaseInputs]);

  return (
    <main className={styles.page}>
      <header>
        <p className={styles.eyebrow}>Lab 03 / Homework 2</p>
        <h1>Grand Piano 88</h1>
        <p>88-Key Polyphonic Piano &amp; Concurrent FIFO Sequencer</p>
      </header>
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