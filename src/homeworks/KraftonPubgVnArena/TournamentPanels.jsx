import { useState } from 'react';
import styles from './arena.module.css';

const teams = [
  { id: 'te', name: 'The Expendables', wwcd: 3, placementPoints: 46, killPoints: 41 },
  { id: 'ces', name: 'Cerberus Esports', wwcd: 2, placementPoints: 50, killPoints: 38 },
  { id: 'roy', name: 'Roy Esports', wwcd: 1, placementPoints: 32, killPoints: 45 },
  { id: 'agg', name: 'AGG', wwcd: 1, placementPoints: 29, killPoints: 30 },
];

const columns = [
  { key: 'wwcd', label: 'WWCD' },
  { key: 'placementPoints', label: 'Placement Points' },
  { key: 'killPoints', label: 'Kill Points' },
];

const killFeed = [
  { id: 'kf-6', time: '22:14', teamId: 'te', victimTeamId: 'ces' },
  { id: 'kf-5', time: '21:50', teamId: 'ces', victimTeamId: 'agg' },
  { id: 'kf-4', time: '20:37', teamId: 'roy', victimTeamId: 'te' },
  { id: 'kf-3', time: '19:26', teamId: 'te', victimTeamId: 'agg' },
  { id: 'kf-2', time: '18:42', teamId: 'roy', victimTeamId: 'ces' },
  { id: 'kf-1', time: '17:58', teamId: 'ces', victimTeamId: 'roy' },
];

const teamNames = new Map(teams.map((team) => [team.id, team.name]));

export default function TournamentPanels() {
  const [sort, setSort] = useState({ key: 'wwcd', direction: 'descending' });
  const [teamFilter, setTeamFilter] = useState('all');

  const rankedTeams = teams.toSorted((a, b) => {
    const difference = a[sort.key] - b[sort.key];
    const ordered = sort.direction === 'ascending' ? difference : -difference;
    return ordered || a.name.localeCompare(b.name);
  });

  const visibleFeed = killFeed.filter(
    (event) => teamFilter === 'all' || event.teamId === teamFilter,
  );

  function sortBy(key) {
    setSort((previous) => ({
      key,
      direction: previous.key === key && previous.direction === 'descending'
        ? 'ascending'
        : 'descending',
    }));
  }

  return (
    <>
      <section className={styles.panel} aria-labelledby="leaderboard-title">
        <h2 id="leaderboard-title">Championship Leaderboard</h2>
        <p>Simulated tournament standings. Select a metric to sort.</p>

        <div
          className={styles.tableViewport}
          role="region"
          aria-label="Scrollable leaderboard table"
          tabIndex={0}
        >
          <table className={styles.table}>
            <caption>Demo team standings</caption>
            <thead>
              <tr>
                <th scope="col">Team</th>
                {columns.map(({ key, label }) => (
                  <th
                    key={key}
                    scope="col"
                    aria-sort={sort.key === key ? sort.direction : undefined}
                  >
                    <button
                      type="button"
                      className={styles.sortButton}
                      onClick={() => sortBy(key)}
                    >
                      {label}
                      {sort.key === key && (
                        <span aria-hidden="true">
                          {sort.direction === 'descending' ? ' ↓' : ' ↑'}
                        </span>
                      )}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rankedTeams.map((team) => (
                <tr key={team.id}>
                  <th scope="row">{team.name}</th>
                  <td>{team.wwcd}</td>
                  <td>{team.placementPoints}</td>
                  <td>{team.killPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.panel} aria-labelledby="feed-title">
        <h2 id="feed-title">Kill Feed</h2>

        <div className={styles.controls}>
          <label htmlFor="feed-team">Filter by killer team</label>
          <select
            className={styles.select}
            id="feed-team"
            value={teamFilter}
            onChange={(event) => setTeamFilter(event.target.value)}
          >
            <option value="all">All teams</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>

        <p role="status">
          {visibleFeed.length === 0
            ? 'No eliminations for this team in the demo feed.'
            : visibleFeed.length + ' eliminations shown.'}
        </p>

        {visibleFeed.length > 0 && (
          <ul className={styles.feed}>
            {visibleFeed.map((event) => (
              <li key={event.id}>
                <span>{event.time} · </span>
                <strong>{teamNames.get(event.teamId)}</strong>
                {' eliminated a player from '}
                {teamNames.get(event.victimTeamId)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}