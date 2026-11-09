import { useCallback, useEffect, useRef, useState } from 'react';
import PianoKey from './PianoKey.jsx';
import { PolyphonicSynth } from './PolyphonicSynth.js';
import { PIANO_NOTES, WHITE_KEY_COUNT } from './pianoNotes.js';
import { runSequence, SequenceRecorder } from './sequence.js';
import styles from './GrandPiano88.module.css';

export default function GrandPiano88() {
  const [pressed, setPressed] = useState(() => new Set());
  const [audioError, setAudioError] = useState('');
  const [mode, setMode] = useState('idle');
  const [events, setEvents] = useState([]);
  const [speed, setSpeed] = useState(1);
  const recorderRef = useRef(null);
  const replayRef = useRef(null);
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
    if (replayRef.current) return false;

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
    recorderRef.current?.noteOn(note.midi, note.freqHz, performance.now());
    return true;
  }, [getSynth, unlockAudio]);

  const onNoteOff = useCallback((midi, inputId, touchActivation = false) => {
    const inputs = inputsRef.current;
    const held = inputs.get(midi);
    if (!held?.delete(inputId) || held.size > 0) return;

    inputs.delete(midi);
    recorderRef.current?.noteOff(midi, performance.now());
    const synth = synthRef.current;
    if (!synth) return;

    if (touchActivation && synth.isSuspended) {
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
    recorderRef.current?.releaseAll(performance.now());
  }, []);

  function startRecording() {
    if (replayRef.current || recorderRef.current) return;
    recorderRef.current = new SequenceRecorder();
    setMode('recording');
  }

  function stopRecording() {
    const recorder = recorderRef.current;
    if (!recorder) return;
    recorderRef.current = null;
    setEvents(recorder.finish(performance.now()));
    setMode('idle');
  }

  async function playSequence() {
    if (replayRef.current || recorderRef.current || events.length === 0) return;

    const controller = new AbortController();
    replayRef.current = controller;
    setMode('playing');
    setAudioError('');
    releaseInputs();
    const synth = getSynth();

    try {
      synth.stopAll(true);
      await synth.unlock();
      if (controller.signal.aborted) return;

      await runSequence(events, {
        speed,
        signal: controller.signal,
        noteOn: (midi, freqHz) => synth.noteOn(midi, freqHz),
        noteOff: (midi, voice) => synth.noteOff(midi, voice),
      });
    } catch {
      if (!controller.signal.aborted) {
        synth.stopAll(true);
        setAudioError('The sequence could not be played.');
      }
    } finally {
      if (replayRef.current === controller) {
        replayRef.current = null;
        setMode('idle');
      }
    }
  }

  const stopSequence = useCallback(() => {
    const controller = replayRef.current;
    if (!controller) return;

    replayRef.current = null;
    controller.abort();
    synthRef.current?.stopAll(true);
    setMode('idle');
  }, []);

  useEffect(() => {
    function handleWindowBlur() {
      releaseInputs();
      if (replayRef.current) stopSequence();
      else synthRef.current?.stopAll(true);
    }

    window.addEventListener('blur', handleWindowBlur);
    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      replayRef.current?.abort();
      replayRef.current = null;
      recorderRef.current = null;
      releaseInputs();
      const synth = synthRef.current;
      synthRef.current = null;
      if (synth) void synth.dispose().catch(() => {});
    };
  }, [releaseInputs, stopSequence]);

  return (
    <main className={styles.page}>
      <header>
        <p className={styles.eyebrow}>Lab 03 / Homework 2</p>
        <h1>Grand Piano 88</h1>
        <p>88-Key Polyphonic Piano &amp; Concurrent FIFO Sequencer</p>
      </header>
      {audioError && <p role="alert">{audioError}</p>}

      <section aria-labelledby="sequencer-title" className={styles.panel}>
        <h2 id="sequencer-title">FIFO Sequencer</h2>
        <div className={styles.controls}>
          <button type="button" onClick={startRecording} disabled={mode !== 'idle'}>
            Record
          </button>
          <button type="button" onClick={stopRecording} disabled={mode !== 'recording'}>
            Stop Recording
          </button>
          <button type="button" onClick={playSequence} disabled={mode !== 'idle' || events.length === 0}>
            Play Sequence
          </button>
          <button type="button" onClick={stopSequence} disabled={mode !== 'playing'}>
            Stop Sequence
          </button>
          <label>
            Speed{' '}
            <select
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
              disabled={mode === 'playing'}
            >
              <option value={0.5}>0.5×</option>
              <option value={1}>1×</option>
              <option value={2}>2×</option>
            </select>
          </label>
        </div>
        <output className={styles.status} aria-live="polite">
          {mode === 'recording' && 'Recording notes…'}
          {mode === 'playing' && 'Playing sequence. Live keys are paused.'}
          {mode === 'idle' && (events.length === 0
            ? 'No notes recorded.'
            : `${events.length} recorded ${events.length === 1 ? 'note' : 'notes'}. Ready to play.`)}
        </output>
      </section>

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