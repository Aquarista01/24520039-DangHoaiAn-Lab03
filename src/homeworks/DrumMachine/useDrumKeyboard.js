import { useEffect, useRef } from 'react';

/**
 * Activates mapped pads using physical keyboard codes.
 *
 * @param {ReadonlyMap<string, string>} padMap
 * @param {(padId: string) => void} onTriggerPad
 * @param {boolean} [isEnabled=true]
 */
export function useDrumKeyboard(
  padMap,
  onTriggerPad,
  isEnabled = true
) {
  const callbackRef = useRef(onTriggerPad);

  useEffect(() => {
    callbackRef.current = onTriggerPad;
  }, [onTriggerPad]);

  useEffect(() => {
    if (!isEnabled) return;

    const heldKeys = new Set();

    function isEditable(target) {
      return target instanceof Element && (
        target.isContentEditable ||
        target.closest(
          'input, textarea, select, [role="textbox"]'
        ) !== null
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

      if (!padId) return;
      if (isEditable(event.target)) return;
      if (heldKeys.has(event.code)) return;

      event.preventDefault();

      heldKeys.add(event.code);
      callbackRef.current(padId);
    }

    function handleKeyUp(event) {
      heldKeys.delete(event.code);
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
  }, [padMap, isEnabled]);
}
