/**
 * @typedef {'ces' | 'te' | 'ge'} SquadId
 */

/**
 * @typedef {Object} TelemetryData
 * @property {SquadId} id
 * @property {string} name
 * @property {string} map
 * @property {string} phase
 * @property {number} alive
 * @property {number} kills
 * @property {string} wwcdProb
 * @property {string} status
 */

/**
 * @typedef {'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'} TelemetryStatus
 */

/**
 * @typedef {Object} TelemetryMachineState
 * @property {TelemetryStatus} status
 * @property {TelemetryData | null} data
 * @property {string | null} error
 */

/**
 * @typedef {Object} PubgMatchTelemetryProps
 * @property {SquadId} squadId
 */

/**
 * @typedef {Object} TelemetryFetchOptions
 * @property {AbortSignal} [signal]
 * @property {number} [delayMs=1400]
 * @property {number} [failureRate=0.35]
 * @property {() => number} [random]
 * @property {typeof fetch} [fetchImpl]
 */

export {};

