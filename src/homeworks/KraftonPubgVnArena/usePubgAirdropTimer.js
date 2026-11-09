import { useEffect, useState } from 'react';

/**
 * Track the remaining time until an absolute deadline.
 * @param {number} targetEpochMs Deadline as Unix epoch milliseconds.
 * @param {number} [serverOffsetMs=0] Server clock minus client clock, in ms.
 * @returns {number} Remaining milliseconds, clamped to zero.
 */
export function usePubgAirdropTimer(targetEpochMs, serverOffsetMs = 0) {
  const [remainingMs, setRemainingMs] = useState(() =>
    Math.max(0, targetEpochMs - (Date.now() + serverOffsetMs)),
  );

  useEffect(() => {
    let timeoutId;

    function sync() {
      window.clearTimeout(timeoutId);
      const remaining = Math.max(0, targetEpochMs - (Date.now() + serverOffsetMs));
      setRemainingMs(remaining);

      if (remaining > 0 && document.visibilityState !== 'hidden') {
        const nextSecondBoundary = remaining % 1000 || 1000;
        timeoutId = window.setTimeout(sync, nextSecondBoundary);
      }
    }

    document.addEventListener('visibilitychange', sync);
    timeoutId = window.setTimeout(sync, 0);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [targetEpochMs, serverOffsetMs]);

  return remainingMs;
}