import { useEffect, useReducer, useRef, useState } from 'react';
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
  const [machine, dispatch] = useReducer(telemetryReducer, INITIAL_STATE);

  const [retryTick, setRetryTick] = useState(0);
  const mainRef = useRef(null);

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
  }, [squadId, retryTick]);

  const statusMessage =
    machine.status === 'LOADING'
      ? 'Syncing KRAFTON Radar...'
      : machine.status === 'SUCCESS' && machine.data !== null
        ? `Telemetry updated for ${machine.data.name}.`
        : machine.status === 'IDLE'
          ? 'Telemetry has not started.'
          : '';

  return (
    <main ref={mainRef} tabIndex={-1} className={styles.shell}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Lab 03 / Exercise 3</p>

        <h1>KRAFTON PUBG Vietnam Series Telemetry</h1>

        <p>
          Simulated PVS match data for educational use. Not an official KRAFTON
          live feed.
        </p>
      </header>

      <section
        className={styles.panel}
        aria-label="Match telemetry"
        aria-busy={machine.status === 'LOADING'}
      >
        {machine.status === 'IDLE' && <p>No telemetry request has started.</p>}

        {machine.status === 'LOADING' && (
          <div className={styles.radarSkeleton} aria-hidden="true">
            <div className={styles.radarCircle} />

            <div className={styles.skeletonContent}>
              <span className={styles.skeletonLine} />
              <span className={styles.skeletonLineShort} />
              <span className={styles.skeletonLine} />
            </div>
          </div>
        )}

        {machine.status === 'ERROR' && (
          <section
            className={styles.errorPanel}
            role="alert"
            aria-labelledby="connection-error-title"
          >
            <h2 id="connection-error-title">Blue-Zone Link Lost</h2>

            <p>Unable to synchronize the selected squad's telemetry.</p>

            <p className={styles.errorDetail}>{machine.error}</p>

            <button
              type="button"
              className={styles.retryButton}
              onClick={() => {
                mainRef.current?.focus({ preventScroll: true });
                setRetryTick((tick) => tick + 1);
              }}
            >
              Reconnect Satellite
            </button>
          </section>
        )}

        {machine.status === 'SUCCESS' && machine.data !== null && (
          <article
            className={styles.successCard}
            aria-labelledby="squad-heading"
          >
            <p className={styles.successLabel}>Telemetry synchronized</p>

            <h2 id="squad-heading">{machine.data.name}</h2>

            <dl className={styles.statsGrid}>
              <div className={styles.stat}>
                <dt>Map</dt>
                <dd>{machine.data.map}</dd>
              </div>

              <div className={styles.stat}>
                <dt>Current Phase</dt>
                <dd>{machine.data.phase}</dd>
              </div>

              <div className={styles.stat}>
                <dt>Players Alive</dt>
                <dd>{machine.data.alive}</dd>
              </div>

              <div className={styles.stat}>
                <dt>Total Kills</dt>
                <dd>{machine.data.kills}</dd>
              </div>

              <div className={styles.stat}>
                <dt>WWCD Probability</dt>
                <dd>{machine.data.wwcdProb}</dd>
              </div>

              <div className={styles.stat}>
                <dt>Tactical Status</dt>
                <dd>{machine.data.status}</dd>
              </div>
            </dl>

            <p className={styles.explanation}>
              WWCD = Winner Winner Chicken Dinner. The probability is simulated,
              not an official prediction.
            </p>
          </article>
        )}
      </section>

      {statusMessage && (
        <p
          className={styles.statusMessage}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {statusMessage}
        </p>
      )}

      <p className={styles.stateLabel}>Current state: {machine.status}</p>
    </main>
  );
}
