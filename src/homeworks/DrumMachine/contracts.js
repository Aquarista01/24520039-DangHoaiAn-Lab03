/**
 * @typedef {Object} DrumPadData
 * @property {string} id Stable, unique pad identifier.
 * @property {string} name Human-readable instrument name.
 * @property {string} keyLabel Displayed shortcut letter.
 * @property {string} code Physical KeyboardEvent.code.
 * @property {string} src Same-origin audio file URL.
 * @property {number} illustrativeLevel Visual-only intensity (0-100).
 */

/**
 * @callback TriggerPad
 * @param {string} padId Stable pad identifier.
 * @returns {void}
 */

/**
 * @typedef {Object} DrumPadProps
 * @property {DrumPadData} pad
 * @property {boolean} [isActive]
 * @property {TriggerPad} onTrigger
 */

/**
 * @callback DrumKeyboardHook
 * @param {ReadonlyMap<string, string>} padMap
 * @param {TriggerPad} onTriggerPad
 * @param {boolean} [isEnabled]
 * @returns {void}
 */

export {};
