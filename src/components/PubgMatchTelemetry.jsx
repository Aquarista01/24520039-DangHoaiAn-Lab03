import { useEffect, useReducer } from 'react';
import { fetchKraftonPubgTelemetry } from './telemetryService.js';
import styles from './PubgMatchTelemetry.module.css';

/** @type {import('./telemetryContracts.js').TelemetryMachineState} */
const INITIAL_STATE = {
  status: 'IDLE',
  data: null,
  error: null,
};

function telemetryReducer(state, action) {
  switch (action.type) {
    case 'START':
      return {
        status: 'LOADING',
        data: null,
        error: null,
      };

    case 'RESOLVE':
      if (state.status !== 'LOADING') return state;

      return {
        status: 'SUCCESS',
        data: action.data,
        error: null,
      };

    case 'REJECT':
      if (state.status !== 'LOADING') return state;

      return {
        status: 'ERROR',
        data: null,
        error: action.message,
      };

    default:
      return state;
  }
}

/**
 * @param {import('./telemetryContracts.js').PubgMatchTelemetryProps} props
 */
export default function PubgMatchTelemetry({ squadId }) {
  const [machine, dispatch] = useReducer(
    telemetryReducer,
    INITIAL_STATE
  );

  useEffect(() => {
    const controller = new AbortController();
    let current = true;

    dispatch({ type: 'START' });

    fetchKraftonPubgTelemetry(squadId, {
      signal: controller.signal,
    })
      .then((data) => {
        if (!current || controller.signal.aborted) return;
        if (data.id !== squadId) return;

        dispatch({
          type: 'RESOLVE',
          data,
        });
      })
      .catch((error) => {
        if (
          !current ||
          controller.signal.aborted ||
          error?.name === 'AbortError'
        ) {
          return;
        }

        dispatch({
          type: 'REJECT',
          message:
            error instanceof Error
              ? error.message
              : 'Unable to retrieve match telemetry.',
        });
      });

    return () => {
      current = false;
      controller.abort();
    };
  }, [squadId]);

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>
          Lab 03 / Exercise 3
        </p>

        <h1>KRAFTON PUBG Vietnam Series Telemetry</h1>

        <p>
          Simulated practice data — not an official live KRAFTON feed.
        </p>
      </header>

      <section className={styles.panel} aria-label="Match telemetry">
        {machine.status === 'IDLE' && (
          <p>No telemetry request has started.</p>
        )}

        {machine.status === 'LOADING' && (
          <p role="status">Loading {squadId.toUpperCase()} telemetry...</p>
        )}

        {machine.status === 'ERROR' && (
          <p className={styles.error}>
            Telemetry unavailable: {machine.error}
          </p>
        )}

        {machine.status === 'SUCCESS' && machine.data && (
          <article className={styles.result}>
            <h2>{machine.data.name}</h2>

            <p>Map: {machine.data.map}</p>
            <p>Phase: {machine.data.phase}</p>
            <p>Players alive: {machine.data.alive}</p>
            <p>Kills: {machine.data.kills}</p>
            <p>WWCD probability: {machine.data.wwcdProb}</p>
            <p>Tactical status: {machine.data.status}</p>
          </article>
        )}
      </section>

      <p className={styles.stateLabel}>
        Current state: {machine.status}
      </p>
    </main>
  );
}

