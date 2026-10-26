import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Plays independent audio voices and releases resources on unmount.
 */
export function useDrumAudio() {
  const voicesRef = useRef(new Set());
  const mountedRef = useRef(false);
  const [error, setError] = useState('');

  useEffect(() => {
    mountedRef.current = true;
    const voices = voicesRef.current;

    return () => {
      mountedRef.current = false;

      for (const voice of voices) {
        voice.audio.pause();
        voice.cleanup();
      }

      voices.clear();
    };
  }, []);

  const play = useCallback((pad) => {
    const audio = new Audio(pad.src);
    const voice = { audio, cleanup: () => {} };
    let finished = false;

    function cleanup() {
      if (finished) return;
      finished = true;

      audio.removeEventListener('ended', cleanup);
      audio.removeEventListener('error', onError);
      voicesRef.current.delete(voice);
    }

    function onError() {
      if (mountedRef.current) {
        setError(
          `Unable to play ${pad.name}. Check the audio file or browser settings.`
        );
      }
      cleanup();
    }

    voice.cleanup = cleanup;
    voicesRef.current.add(voice);

    audio.addEventListener('ended', cleanup);
    audio.addEventListener('error', onError);

    setError('');

    try {
      const playback = audio.play();
      if (playback?.catch) {
        void playback.catch(onError);
      }
    } catch {
      onError();
    }
  }, []);

  return { play, error };
}
