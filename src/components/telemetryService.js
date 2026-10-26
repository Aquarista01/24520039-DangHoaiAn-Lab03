const VALID_SQUADS = new Set(['ces', 'te', 'ge']);

function makeAbortError() {
  return new DOMException('Telemetry request aborted.', 'AbortError');
}

/**
 * Abortable simulated delay.
 * Clears both timer and abort listener after settlement.
 *
 * @param {number} delayMs
 * @param {AbortSignal} [signal]
 * @returns {Promise<void>}
 */
function abortableDelay(delayMs, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(makeAbortError());
      return;
    }

    let timer;

    function cleanup() {
      clearTimeout(timer);
      signal?.removeEventListener('abort', handleAbort);
    }

    function handleAbort() {
      cleanup();
      reject(makeAbortError());
    }

    timer = setTimeout(() => {
      cleanup();
      resolve();
    }, delayMs);

    signal?.addEventListener('abort', handleAbort, { once: true });
  });
}

/**
 * Validate JSON before moving the machine to SUCCESS.
 *
 * @param {unknown} value
 * @param {string} expectedId
 * @returns {boolean}
 */
function isValidTelemetry(value, expectedId) {
  if (!value || typeof value !== 'object') return false;

  return (
    value.id === expectedId &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0 &&
    typeof value.map === 'string' &&
    typeof value.phase === 'string' &&
    Number.isInteger(value.alive) &&
    value.alive >= 0 &&
    Number.isInteger(value.kills) &&
    value.kills >= 0 &&
    typeof value.wwcdProb === 'string' &&
    /^(100|[1-9]?\d)%$/.test(value.wwcdProb) &&
    typeof value.status === 'string'
  );
}

/**
 * Fetch locally simulated PUBG telemetry.
 * Normal mode: 1400ms additional delay and 35% simulated failure.
 *
 * @param {import('./telemetryContracts.js').SquadId} squadId
 * @param {import('./telemetryContracts.js').TelemetryFetchOptions} [options]
 * @returns {Promise<import('./telemetryContracts.js').TelemetryData>}
 */
export async function fetchKraftonPubgTelemetry(
  squadId,
  {
    signal,
    delayMs = 1400,
    failureRate = 0.35,
    random = Math.random,
    fetchImpl = fetch,
  } = {}
) {
  if (!VALID_SQUADS.has(squadId)) {
    throw new Error(`Unknown squad ID: ${squadId}`);
  }

  if (!Number.isFinite(delayMs) || delayMs < 0) {
    throw new RangeError('delayMs must be non-negative.');
  }

  if (
    !Number.isFinite(failureRate) ||
    failureRate < 0 ||
    failureRate > 1
  ) {
    throw new RangeError('failureRate must be between 0 and 1.');
  }

  if (signal?.aborted) {
    throw makeAbortError();
  }

  // A real HTTP request visible in Chrome Network.
  const response = await fetchImpl(`/telemetry/${squadId}.json`, {
    signal,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(
      `Telemetry HTTP request failed (${response.status}).`
    );
  }

  const payload = await response.json();

  // This delay is simulated work, not another HTTP request.
  await abortableDelay(delayMs, signal);

  if (signal?.aborted) {
    throw makeAbortError();
  }

  if (!isValidTelemetry(payload, squadId)) {
    throw new Error('Invalid telemetry data for the selected squad.');
  }

  // Simulated packet loss after a successful local HTTP response.
  if (random() < failureRate) {
    throw new Error(
      'Simulated packet loss on the Blue-Zone satellite link.'
    );
  }

  return { ...payload };
}

