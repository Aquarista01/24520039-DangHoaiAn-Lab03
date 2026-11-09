const PITCH_CLASSES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
];

const FIRST_MIDI = 21;
const LAST_MIDI = 108;

function createPianoNotes() {
  let whiteCount = 0;

  return Array.from({ length: LAST_MIDI - FIRST_MIDI + 1 }, (_, index) => {
    const midi = FIRST_MIDI + index;
    const pitch = PITCH_CLASSES[midi % 12];
    const octave = Math.floor(midi / 12) - 1;
    const isBlack = pitch.endsWith('#');

    // Black keys sit on the boundary after the preceding white key.
    const position = whiteCount;
    if (!isBlack) whiteCount += 1;

    return Object.freeze({
      midi,
      name: pitch + octave,
      accessibleName: pitch.replace('#', ' sharp') + ' ' + octave,
      octave,
      isBlack,
      position,
      freqHz: 440 * 2 ** ((midi - 69) / 12),
    });
  });
}

export const PIANO_NOTES = Object.freeze(createPianoNotes());
export const WHITE_KEY_COUNT = PIANO_NOTES.filter((note) => !note.isBlack).length;