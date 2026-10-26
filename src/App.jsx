import { useId, useState } from 'react';

import DrumMachine from './homeworks/DrumMachine/DrumMachine.jsx';
import ScientistDirectory from './components/ScientistDirectory.jsx';
import PubgMatchTelemetry from './components/PubgMatchTelemetry.jsx';

export default function App() {
  const [view, setView] = useState('drum');
  const [selectedSquadId, setSelectedSquadId] = useState('te');

  const squadSelectId = useId();

  return (
    <>
      <nav className="lab-switcher" aria-label="Lab 03 activities">
        <button
          type="button"
          aria-pressed={view === 'drum'}
          onClick={() => setView('drum')}
        >
          Homework 1 — Drum Kit
        </button>

        <button
          type="button"
          aria-pressed={view === 'scientists'}
          onClick={() => setView('scientists')}
        >
          Exercise 2 — Scientist Directory
        </button>

        <button
          type="button"
          aria-pressed={view === 'pubg'}
          onClick={() => setView('pubg')}
        >
          Exercise 3 — PUBG Telemetry
        </button>
      </nav>

      {view === 'drum' && <DrumMachine />}

      {view === 'scientists' && <ScientistDirectory />}

      {view === 'pubg' && (
        <section
          className="telemetry-activity"
          aria-label="PUBG Vietnam simulated telemetry"
        >
          <div className="telemetry-toolbar">
            <label htmlFor={squadSelectId}>Select PUBG Squad</label>

            <select
              id={squadSelectId}
              value={selectedSquadId}
              onChange={(event) => {
                setSelectedSquadId(event.target.value);
              }}
            >
              <option value="ces">CES — Cerberus Esports</option>
              <option value="te">TE — The Expendables</option>
              <option value="ge">GE — Genius Esports</option>
            </select>
          </div>

          <PubgMatchTelemetry
            key={selectedSquadId}
            squadId={selectedSquadId}
          />
        </section>
      )}
    </>
  );
}

