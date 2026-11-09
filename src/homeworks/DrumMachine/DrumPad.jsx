import styles from './DrumMachine.module.css';

/**
 * @param {import('./contracts.js').DrumPadProps} props
 */
export default function DrumPad({
  pad,
  isActive = false,
  onTrigger,
}) {
  return (
    <li className={styles.padItem}>
      <button
        type="button"
        className={`${styles.pad} ${isActive ? styles.active : ''}`}
        aria-pressed={isActive}
        aria-keyshortcuts={pad.keyLabel.toLowerCase()}
        onKeyDown={(event) => {
          if (event.repeat && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
          }
        }}
        onClick={() => onTrigger(pad.id)}
      >
        <kbd className={styles.padKey}>{pad.keyLabel}</kbd>
        <span className={styles.padName}>{pad.name}</span>
        <span className={styles.padState} aria-hidden="true">
          {isActive ? 'HIT!' : 'Play'}
        </span>
      </button>
    </li>
  );
}
