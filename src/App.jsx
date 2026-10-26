import { useState } from 'react';
import DrumMachine from './homeworks/DrumMachine/DrumMachine.jsx';
import ScientistDirectory from './components/ScientistDirectory.jsx';

export default function App() {
  const [view, setView] = useState('drum');

  return (
    <>
      <nav className="lab-switcher" aria-label="Lab 03 activities">
        <button
          type="button"
          aria-pressed={view === 'drum'}
          onClick={() => setView('drum')}
        >
          Exercise 1 — Drum Kit
        </button>

        <button
          type="button"
          aria-pressed={view === 'scientists'}
          onClick={() => setView('scientists')}
        >
          Exercise 2 — Scientist Directory
        </button>
      </nav>

      {view === 'drum'
        ? <DrumMachine />
        : <ScientistDirectory />}
    </>
  );
}

