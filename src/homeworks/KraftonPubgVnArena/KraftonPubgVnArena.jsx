import { useRef, useState } from 'react';
import { createMockClaimApi } from './mockClaimApi.js';
import { usePubgAirdropTimer } from './usePubgAirdropTimer.js';
import styles from './arena.module.css';

const money = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

function createDemoSession(now = Date.now()) {
  const items = [
    {
      id: 'vip-tickets',
      title: 'PVS Grand Finals VIP Tickets',
      priceVnd: 499000,
      remainingStock: 2,
      dropEpochMs: now + 8000,
      expiresEpochMs: now + 35000,
    },
    {
      id: 'gcoin-crates',
      title: 'G-Coin Crates',
      priceVnd: 99000,
      remainingStock: 1,
      dropEpochMs: now + 12000,
      expiresEpochMs: now + 40000,
    },
  ];

  return { items, api: createMockClaimApi(items) };
}

function getDropStatus(stock, opensInMs, closesInMs) {
  if (closesInMs <= 0) return 'EXPIRED';
  if (opensInMs > 0) return 'WARMUP';
  return stock > 0 ? 'AIRDROP_LIVE' : 'LOOTED_OUT';
}

function formatCountdown(milliseconds) {
  const seconds = Math.ceil(milliseconds / 1000);
  const minutesLabel = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secondsLabel = String(seconds % 60).padStart(2, '0');
  return minutesLabel + ':' + secondsLabel;
}

function AirdropCard({ item, pending, notice, onClaim }) {
  const opensInMs = usePubgAirdropTimer(item.dropEpochMs);
  const closesInMs = usePubgAirdropTimer(item.expiresEpochMs);
  const status = getDropStatus(item.remainingStock, opensInMs, closesInMs);
  const visibleStock = Math.max(0, item.remainingStock - Number(pending));
  const headingId = 'drop-' + item.id;

  return (
    <article className={styles.card} aria-labelledby={headingId}>
      <h2 id={headingId}>{item.title}</h2>
      <p>{money.format(item.priceVnd)}</p>
      <p>Stock: <strong>{visibleStock}</strong></p>

      <p className={styles.status} data-status={status} aria-live="polite">
        {status}
      </p>

      <p className={styles.clock}>
        {status === 'WARMUP' && 'Opens in ' + formatCountdown(opensInMs)}
        {status === 'EXPIRED' && 'Drop closed'}
        {status !== 'WARMUP' && status !== 'EXPIRED' &&
          'Closes in ' + formatCountdown(closesInMs)}
      </p>

      <button
        className={styles.button}
        type="button"
        disabled={pending || status !== 'AIRDROP_LIVE'}
        onClick={() => onClaim(item.id)}
      >
        {pending ? 'Claiming…' : 'Claim'}
      </button>

      <p className={styles.notice} role="status">{notice}</p>
    </article>
  );
}

export default function KraftonPubgVnArena() {
  const [session, setSession] = useState(createDemoSession);
  const [scenario, setScenario] = useState('success');
  const [pendingIds, setPendingIds] = useState(() => new Set());
  const [notices, setNotices] = useState({});
  const pendingRef = useRef(new Set());
  const nextClaimId = useRef(1);

  function setItemStock(id, remainingStock) {
    setSession((previous) => ({
      ...previous,
      items: previous.items.map((item) =>
        item.id === id ? { ...item, remainingStock } : item,
      ),
    }));
  }

  function announce(id, message) {
    setNotices((previous) => ({ ...previous, [id]: message }));
  }

  function resetDemo() {
    if (pendingRef.current.size > 0) return;
    setSession(createDemoSession());
    setScenario('success');
    setNotices({});
  }

  async function claimItem(id) {
    const pending = pendingRef.current;
    if (pending.has(id)) return;

    const item = session.items.find((entry) => entry.id === id);
    if (!item) return;

    const now = Date.now();
    const status = getDropStatus(
      item.remainingStock,
      item.dropEpochMs - now,
      item.expiresEpochMs - now,
    );
    if (status !== 'AIRDROP_LIVE') return;

    const request = { itemId: id, claimId: 'claim-' + nextClaimId.current, scenario };
    nextClaimId.current += 1;

    pending.add(id);
    setPendingIds(new Set(pending));
    announce(id, 'Sending claim…');

    try {
      let result;
      let retried = false;

      try {
        result = await session.api.claim(request);
      } catch (error) {
        if (!error?.retryable) throw error;
        retried = true;
        result = await session.api.claim(request);
      }

      setItemStock(id, result.remainingStock ?? item.remainingStock - 1);
      announce(id, retried
        ? 'Claim confirmed after retrying the same request ID.'
        : 'Claim confirmed.');
    } catch (error) {
      const officialStock = error?.remainingStock;
      const hasOfficialStock = Number.isInteger(officialStock);
      if (hasOfficialStock) setItemStock(id, officialStock);

      if (error?.status === 409) {
        announce(id, '409 Conflict. Claim rolled back.' +
          (hasOfficialStock ? ' Official stock synced.' : ''));
      } else {
        announce(id, 'Claim failed. Stock restored.');
      }
    } finally {
      pending.delete(id);
      setPendingIds(new Set(pending));
    }
  }

  return (
    <main className={styles.page}>
      <header>
        <p className={styles.eyebrow}>Lab 03 · Homework 3</p>
        <h1>KRAFTON × PUBG Vietnam Championship</h1>
        <p>Airdrop Arena · Simulated inventory and claims. No payment is collected.</p>

        <div className={styles.controls}>
          <button
            className={styles.button}
            type="button"
            disabled={pendingIds.size > 0}
            onClick={resetDemo}
          >
            Reset demo
          </button>

          <label htmlFor="claim-scenario">Claim scenario</label>
          <select
            className={styles.select}
            id="claim-scenario"
            value={scenario}
            onChange={(event) => setScenario(event.target.value)}
          >
            <option value="success">Success</option>
            <option value="conflict">409 Conflict</option>
            <option value="retry">Lost response and retry</option>
            <option value="error">Service error</option>
          </select>
        </div>
      </header>

      <section className={styles.grid} aria-label="Available airdrops">
        {session.items.map((item) => (
          <AirdropCard
            key={item.id + ':' + item.dropEpochMs}
            item={item}
            pending={pendingIds.has(item.id)}
            notice={notices[item.id]}
            onClaim={claimItem}
          />
        ))}
      </section>
    </main>
  );
}