import test from 'node:test';
import assert from 'node:assert/strict';

import {
  fetchKraftonPubgTelemetry,
} from '../src/components/telemetryService.js';

const sample = {
  id: 'te',
  name: 'The Expendables',
  map: 'Miramar',
  phase: 'Phase 7',
  alive: 4,
  kills: 18,
  wwcdProb: '82%',
  status: 'Holding High Ground',
};

const mockFetch = async () =>
  new Response(JSON.stringify(sample), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

test('returns valid telemetry when failure is disabled', async () => {
  const data = await fetchKraftonPubgTelemetry('te', {
    delayMs: 0,
    failureRate: 0,
    fetchImpl: mockFetch,
  });

  assert.equal(data.id, 'te');
  assert.equal(data.kills, 18);
  assert.equal(data.wwcdProb, '82%');
});

test('simulates a failure when probability is 100%', async () => {
  await assert.rejects(
    fetchKraftonPubgTelemetry('te', {
      delayMs: 0,
      failureRate: 1,
      fetchImpl: mockFetch,
    }),
    /Simulated packet loss/
  );
});

test('aborts while simulated delay is pending', async () => {
  const controller = new AbortController();

  const request = fetchKraftonPubgTelemetry('te', {
    signal: controller.signal,
    delayMs: 1000,
    failureRate: 0,
    fetchImpl: mockFetch,
  });

  controller.abort();

  await assert.rejects(request, {
    name: 'AbortError',
  });
});

test('rejects an unknown squad without fetching', async () => {
  await assert.rejects(
    fetchKraftonPubgTelemetry('unknown', {
      delayMs: 0,
      fetchImpl: mockFetch,
    }),
    /Unknown squad ID/
  );
});


// Wait until the delay really installs its abort listener before cancelling it.
test('cancels an active delay and removes its abort listener', async () => {
  const controller = new AbortController();
  const ready = Promise.withResolvers();
  const add = controller.signal.addEventListener.bind(controller.signal);
  const remove = controller.signal.removeEventListener.bind(controller.signal);
  let removals = 0;
  controller.signal.addEventListener = (...args) => { add(...args); ready.resolve(); };
  controller.signal.removeEventListener = (...args) => { removals += 1; remove(...args); };
  const request = fetchKraftonPubgTelemetry('te', {
    signal: controller.signal, delayMs: 10000, failureRate: 0, fetchImpl: mockFetch,
  });
  await ready.promise;
  controller.abort();
  await assert.rejects(request, { name: 'AbortError' });
  assert.equal(removals, 1);
});

test('passes the signal to a genuinely pending fetch and propagates AbortError', async () => {
  const controller = new AbortController();
  const started = Promise.withResolvers();
  const request = fetchKraftonPubgTelemetry('te', {
    signal: controller.signal,
    fetchImpl: (url, options) => new Promise((resolve, reject) => {
      assert.equal(url, '/telemetry/te.json');
      assert.equal(options.signal, controller.signal);
      assert.equal(options.cache, 'no-store');
      options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
      started.resolve();
    }),
  });
  await started.promise;
  controller.abort();
  await assert.rejects(request, { name: 'AbortError' });
});

test('does not fetch when the signal is already aborted', async () => {
  const controller = new AbortController(); controller.abort();
  await assert.rejects(fetchKraftonPubgTelemetry('te', {
    signal: controller.signal,
    fetchImpl: () => assert.fail('must not fetch'),
  }), { name: 'AbortError' });
});

test('rejects HTTP errors and malformed JSON', async () => {
  await assert.rejects(fetchKraftonPubgTelemetry('te', {
    fetchImpl: async () => new Response('Not found', { status: 404 }),
  }), /HTTP request failed \(404\)/);
  await assert.rejects(fetchKraftonPubgTelemetry('te', {
    fetchImpl: async () => new Response('broken JSON'),
  }), SyntaxError);
});

test('rejects wrong-squad and invalid payloads', async () => {
  for (const change of [{ id: 'ces' }, { name: ' ' }, { alive: -1 }, { kills: 1.5 }, { wwcdProb: '101%' }, { wwcdProb: 'wrong' }]) {
    await assert.rejects(fetchKraftonPubgTelemetry('te', {
      delayMs: 0, failureRate: 0,
      fetchImpl: async () => new Response(JSON.stringify({ ...sample, ...change })),
    }), /Invalid telemetry data/);
  }
});

test('validates delay and probability before fetching', async () => {
  for (const options of [{ delayMs: -1 }, { delayMs: NaN }, { failureRate: -0.1 }, { failureRate: 1.1 }, { failureRate: Infinity }]) {
    await assert.rejects(fetchKraftonPubgTelemetry('te', {
      ...options, fetchImpl: () => assert.fail('must not fetch'),
    }), RangeError);
  }
});

test('uses the normal 35 percent boundary without changing the production defaults', async () => {
  await assert.rejects(fetchKraftonPubgTelemetry('te', {
    delayMs: 0, random: () => 0.349, fetchImpl: mockFetch,
  }), /Simulated packet loss/);
  const data = await fetchKraftonPubgTelemetry('te', {
    delayMs: 0, random: () => 0.35, fetchImpl: mockFetch,
  });
  assert.equal(data.id, 'te');
});
