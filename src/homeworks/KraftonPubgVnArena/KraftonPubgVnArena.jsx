import { useState } from 'react';
import { usePubgAirdropTimer } from './usePubgAirdropTimer.js';
import styles from './arena.module.css';

const money = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

function createDemoItems(now = Date.now()) {
  return [
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

function AirdropCard({ item, onClaim }) {
  const opensInMs = usePubgAirdropTimer(item.dropEpochMs);
  const closesInMs = usePubgAirdropTimer(item.expiresEpochMs);
  const status = getDropStatus(item.remainingStock, opensInMs, closesInMs);
  const headingId = 'drop-' + item.id;

  return (
    <article className={styles.card} aria-labelledby={headingId}>
      <h2 id={headingId}>{item.title}</h2>
      <p>{money.format(item.priceVnd)}</p>
      <p>Stock: <strong>{item.remainingStock}</strong></p>

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
        disabled={status !== 'AIRDROP_LIVE'}
        onClick={() => onClaim(item.id)}
      >
        Claim
      </button>
    </article>
  );
}

export default function KraftonPubgVnArena() {
  const [items, setItems] = useState(createDemoItems);

  function claimDemoItem(id) {
    const now = Date.now();

    setItems((previous) => previous.map((item) => {
      if (item.id !== id) return item;

      const status = getDropStatus(
        item.remainingStock,
        item.dropEpochMs - now,
        item.expiresEpochMs - now,
      );

      return status === 'AIRDROP_LIVE'
        ? { ...item, remainingStock: item.remainingStock - 1 }
        : item;
    }));
  }

  return (
    <main className={styles.page}>
      <header>
        <p className={styles.eyebrow}>Lab 03 · Homework 3</p>
        <h1>KRAFTON × PUBG Vietnam Championship</h1>
        <p>Airdrop Arena · Demo inventory and claims. No payment is collected.</p>

        <button
          className={styles.button}
          type="button"
          onClick={() => setItems(createDemoItems())}
        >
          Reset demo
        </button>
      </header>

      <section className={styles.grid} aria-label="Available airdrops">
        {items.map((item) => (
          <AirdropCard
            key={item.id + ':' + item.dropEpochMs}
            item={item}
            onClaim={claimDemoItem}
          />
        ))}
      </section>
    </main>
  );
}