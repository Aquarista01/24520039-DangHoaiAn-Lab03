import { useCallback, useEffect, useRef, useState } from 'react';
import { PADS, PAD_BY_ID } from './pads.js';
import DrumPad from './DrumPad.jsx';
import { useDrumAudio } from './useDrumAudio.js';
import styles from './DrumMachine.module.css';

export default function DrumMachine() {
  const { play, error } = useDrumAudio();

  const [activeId, setActiveId] = useState(null);
  const timerRef = useRef(null);

  const triggerPad = useCallback((id) => {
    const pad = PAD_BY_ID.get(id);
    if (!pad) return;

    play(pad);
    setActiveId(id);

    window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      setActiveId(null);
      timerRef.current = null;
    }, 160);
  }, [play]);

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

        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
      </main>
    </>
  );
}
