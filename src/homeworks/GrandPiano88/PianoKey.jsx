import { memo } from 'react';
import styles from './GrandPiano88.module.css';

const isPlayKey = (key) => key === 'Enter' || key === ' ';

const PianoKey = memo(function PianoKey({
  note, isPressed, onNoteOn, onNoteOff, onNoteTap,
}) {
  function releasePointer(event) {
    onNoteOff(note.midi, 'pointer:' + event.pointerId);
  }

  return (
    <button
      type="button"
      className={note.isBlack ? styles.blackKey : styles.whiteKey}
      style={{ '--key-position': note.position }}
      aria-label={note.isBlack ? note.name + ', ' + note.accessibleName : note.name}
      aria-pressed={isPressed}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture?.(event.pointerId);
        onNoteOn(note, 'pointer:' + event.pointerId);
      }}
      onPointerUp={(event) => {
        onNoteOff(note.midi, 'pointer:' + event.pointerId, event.pointerType !== 'mouse');
      }}
      onPointerCancel={releasePointer}
      onLostPointerCapture={releasePointer}
      onKeyDown={(event) => {
        if (!isPlayKey(event.key)) return;
        event.preventDefault();
        if (!event.repeat) onNoteOn(note, 'key:' + event.key);
      }}
      onKeyUp={(event) => {
        if (!isPlayKey(event.key)) return;
        event.preventDefault();
        onNoteOff(note.midi, 'key:' + event.key);
      }}
      onBlur={() => {
        onNoteOff(note.midi, 'key:Enter');
        onNoteOff(note.midi, 'key: ');
      }}
      onClick={(event) => {
        // Assistive technology can activate the button directly.
        if (event.detail === 0) onNoteTap(note);
      }}
    >
      <span aria-hidden="true">{note.name}</span>
    </button>
  );
});

export default PianoKey;