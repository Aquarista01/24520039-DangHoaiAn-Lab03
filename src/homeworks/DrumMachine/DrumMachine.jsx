import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { PADS, PAD_BY_ID, PAD_BY_CODE } from './pads.js';
import DrumPad from './DrumPad.jsx';
import { useDrumAudio } from './useDrumAudio.js';
import { useDrumKeyboard } from './useDrumKeyboard.js';
import styles from './DrumMachine.module.css';

export default function DrumMachine() {
  const { play, error } = useDrumAudio();

  const [activeId, setActiveId] = useState(null);
  const timerRef = useRef(null);
  const [history, setHistory] = useState([]);
  const hitSequenceRef = useRef(0);
  const typingTestId = useId();
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true);

  const triggerPad = useCallback((id) => {
    const pad = PAD_BY_ID.get(id);
    if (!pad) return;

    play(pad);
    const hitId = ++hitSequenceRef.current;

    setHistory((previous) => [
      {
        id: hitId,
        name: pad.name,
        keyLabel: pad.keyLabel,
      },
      ...previous,
    ].slice(0, 6));
    setActiveId(id);

    window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      setActiveId(null);
      timerRef.current = null;
    }, 160);
  }, [play]);

  useDrumKeyboard(PAD_BY_CODE, triggerPad, shortcutsEnabled);

  const activePad = PAD_BY_ID.get(activeId);
  const meterLevel = activePad?.illustrativeLevel ?? 0;
  const latestHit = history[0];

  useEffect(() => {
    function handleBlur() {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
      setActiveId(null);
    }

    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      <a href="#main" className={styles.skipLink}>
        Skip to drum studio
      </a>

      <main id="main" tabIndex={-1} className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>React 19 / Sound Lab</p>
          <h1>Production Studio Drum Kit</h1>
          <p>
            Create your rhythm using the pads or
            keyboard shortcuts W, A, S, D, J, K, L.
          </p>
        </header>

        <label className={styles.shortcutToggle}>
          <input type="checkbox" checked={shortcutsEnabled}
            onChange={(event) => setShortcutsEnabled(event.target.checked)} />
          Enable keyboard shortcuts (W, A, S, D, J, K, L)
        </label>

        <section className={styles.panel} aria-labelledby="pads-heading">
          <h2 id="pads-heading">Drum Pads</h2>

          <ul className={styles.grid}>
            {PADS.map((pad) => (
              <DrumPad
                key={pad.id}
                pad={pad}
                isActive={activeId === pad.id}
                onTrigger={triggerPad}
              />
            ))}
          </ul>
        </section>

        <section
          className={styles.feedback}
          aria-labelledby="feedback-heading"
        >
          <h2 id="feedback-heading">Studio Feedback</h2>

          <h3>Recent Hits</h3>

          <output
            className={styles.liveOutput}
            aria-live="polite"
            aria-atomic="true"
          >
            {latestHit
              ? `Hit ${latestHit.id}: ${latestHit.name} (${latestHit.keyLabel}).`
              : 'No hits yet.'}
          </output>

          <ol className={styles.history} aria-label="Six most recent hits">
            {history.map((hit) => (
              <li key={hit.id}>
                {hit.name} — {hit.keyLabel}
              </li>
            ))}
          </ol>

          <h3>Visual Sound Meter</h3>

          <p className={styles.meterNote}>
            Illustrative sound intensity only.
            Values are not measured decibels (dB).
          </p>

          <div
            className={styles.meter}
            role="meter"
            aria-label="Illustrative sound intensity"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={meterLevel}
            aria-valuetext={`${meterLevel} percent illustrative intensity`}
          >
            <span
              className={styles.meterFill}
              style={{ width: `${meterLevel}%` }}
            />
          </div>

          <p className={styles.meterValue}>
            Illustrative level: {meterLevel}%
          </p>

          <div className={styles.inputGroup}>
            <label htmlFor={typingTestId}>
              Keyboard shortcut test
            </label>

            <input
              id={typingTestId}
              type="text"
              placeholder="Type W, A, S, D, J, K or L"
            />

            <p>
              Drum shortcuts are disabled while typing here.
            </p>
          </div>
        </section>

        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
      </main>
    </>
  );
}
