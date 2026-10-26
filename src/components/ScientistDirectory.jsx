import { useId, useLayoutEffect, useRef, useState } from 'react';
import { SMART_PEOPLE } from './smartPeople.js';
import styles from './ScientistDirectory.module.css';

/**
 * @param {import('./smartPeople.js').ScientistDirectoryProps} props
 */
export default function ScientistDirectory({
  initialData = SMART_PEOPLE,
}) {
  // Keep the original snapshot for later Reset functionality.
  const [initialSnapshot] = useState(() =>
    initialData.map((person) => ({ ...person }))
  );

  // Independent source and input states.
  const [people, setPeople] = useState(() =>
    initialSnapshot.map((person) => ({ ...person }))
  );
  const [query, setQuery] = useState('');
  const [minIq, setMinIq] = useState(160);
  const [sortBy, setSortBy] = useState('iq-desc');

const [notice, setNotice] = useState('');

const deleteButtonsRef = useRef(new Map());
const resetButtonRef = useRef(null);
const pendingFocusRef = useRef(null);

// Restore focus only after a deletion changes the DOM.
useLayoutEffect(() => {
  const request = pendingFocusRef.current;
  if (!request) return;

  pendingFocusRef.current = null;

  if (request.nextId) {
    const nextButton = deleteButtonsRef.current.get(request.nextId);

    if (nextButton) {
      nextButton.focus();
      return;
    }
  }

  resetButtonRef.current?.focus();
}, [people]);

  const searchId = useId();
  const minIqId = useId();
  const sortId = useId();

  // Derived values: never store these in additional state.
  const normalizedQuery = query.trim().toLocaleLowerCase();

  const visiblePeople = people
    .filter((person) =>
      person.name.toLocaleLowerCase().includes(normalizedQuery) &&
      person.iq >= minIq
    )
    .toSorted((a, b) => {
      if (sortBy === 'age-asc') {
        return (
          a.age - b.age ||
          b.iq - a.iq ||
          a.name.localeCompare(b.name) ||
          a.id.localeCompare(b.id)
        );
      }

      return (
        b.iq - a.iq ||
        a.age - b.age ||
        a.name.localeCompare(b.name) ||
        a.id.localeCompare(b.id)
      );
    });

function handleDelete(id) {
  const currentIndex = visiblePeople.findIndex(
    (person) => person.id === id
  );

  if (currentIndex === -1) return;

  const deletedPerson = visiblePeople[currentIndex];

  // Focus the next visible Delete button, or the previous one.
  const nextPerson =
    visiblePeople[currentIndex + 1] ??
    visiblePeople[currentIndex - 1];

  pendingFocusRef.current = {
    nextId: nextPerson?.id ?? null,
  };

  setPeople((previous) =>
    previous.filter((person) => person.id !== id)
  );

  setNotice(`Deleted ${deletedPerson.name}.`);
}

function handleReset() {
  pendingFocusRef.current = null;

  setPeople(
    initialSnapshot.map((person) => ({ ...person }))
  );

  setQuery('');
  setMinIq(160);
  setSortBy('iq-desc');
  setNotice('');

  resetButtonRef.current?.focus();
}

  return (
    <main className={styles.shell} id="scientist-main">
      <header className={styles.header}>
        <p className={styles.eyebrow}>
          Lab 03 / Exercise 2
        </p>

        <h1>Interactive Scientist & Pioneer Directory</h1>

        <p>
          Search, filter, and sort historical pioneers using React 19.
        </p>
      </header>

      <section className={styles.panel} aria-labelledby="filters-title">
        <h2 id="filters-title">Search and Filters</h2>

        <div className={styles.controls}>
          <div className={styles.field}>
            <label htmlFor={searchId}>Search by name</label>

            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(event) => {
  setQuery(event.target.value);
  setNotice('');
}}
              placeholder="Search a scientist..."
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={minIqId}>Minimum IQ</label>

            <input
              id={minIqId}
              type="number"
              min="0"
              step="1"
              value={minIq}
              onChange={(event) => {
                const value = event.target.valueAsNumber;
                setNotice('');

                setMinIq(
                  Number.isFinite(value)
                    ? Math.max(0, value)
                    : 0
                );
              }}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={sortId}>Sort by</label>

            <select
              id={sortId}
              value={sortBy}
              onChange={(event) => {
  setSortBy(event.target.value);
  setNotice('');
}}
            >
              <option value="iq-desc">IQ: High to Low</option>
              <option value="age-asc">Age: Low to High</option>
            </select>
          </div>
        </div>
      <div className={styles.resetRow}>
  <button
    ref={resetButtonRef}
    type="button"
    className={styles.actionButton}
    onClick={handleReset}
  >
    Reset Directory
  </button>
</div>
      </section>

      <section className={styles.panel} aria-labelledby="results-title">
        <h2 id="results-title">Directory Results</h2>

        <output
          className={styles.status}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {notice ? `${notice} ${visiblePeople.length} result(s) shown.` : `${visiblePeople.length} result(s) found.`}
        </output>

        {people.length === 0 ? (
          <p className={styles.empty}>The directory is empty. Use Reset Directory to restore it.</p>
        ) : visiblePeople.length === 0 ? (
          <p className={styles.empty}>
            No people match the current search and IQ filter.
          </p>
        ) : (
          <ul className={styles.peopleList}>
            {visiblePeople.map((person) => (
              <li key={person.id} className={styles.personCard}>
  <div className={styles.personDetails}>
    <h3>{person.name}</h3>
    <p>Age: {person.age}</p>
    <p>IQ: {person.iq}</p>

    <small className={styles.recordId}>
      Record ID: {person.id}
    </small>
  </div>

  <button
    type="button"
    className={styles.deleteButton}
    aria-label={`Delete ${person.name}, record ${person.id}`}
    ref={(node) => {
      if (node) {
        deleteButtonsRef.current.set(person.id, node);
      } else {
        deleteButtonsRef.current.delete(person.id);
      }
    }}
    onClick={() => handleDelete(person.id)}
  >
    Delete
  </button>
</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

