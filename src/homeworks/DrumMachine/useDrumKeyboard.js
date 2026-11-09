import { useEffect } from 'react';

/**
 * Triggers mapped pads once per physical key press and releases them on keyup.
 *
 * @param {ReadonlyMap<string, string>} padMap
 * @param {import('./contracts.js').TriggerPad} onTriggerPad
 * @param {(padId: string) => void} onReleasePad
 * @param {boolean} [isEnabled=true]
 */
export function useDrumKeyboard(
  padMap,
  onTriggerPad,
  onReleasePad,
  isEnabled = true
) {
  useEffect(() => {
    if (!isEnabled) return;

    const heldKeys = new Set();

    function isEditable(target) {
      return target instanceof Element && (
        target.isContentEditable ||
        target.closest('input, textarea, select, [role="textbox"]') !== null
      );
    }

    function handleKeyDown(event) {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.isComposing ||
        event.shiftKey ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey
      ) {
        return;
      }

      const padId = padMap.get(event.code);
      if (!padId || isEditable(event.target) || heldKeys.has(event.code)) return;

      event.preventDefault();
      heldKeys.add(event.code);
      onTriggerPad(padId, 'keyboard');
    }

    function handleKeyUp(event) {
      if (!heldKeys.delete(event.code)) return;

      const padId = padMap.get(event.code);
      if (padId) onReleasePad(padId);
    }

    function handleBlur() {
      heldKeys.clear();
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      heldKeys.clear();
    };
  }, [padMap, onTriggerPad, onReleasePad, isEnabled]);
}