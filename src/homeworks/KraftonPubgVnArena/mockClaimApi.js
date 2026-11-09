class MockClaimError extends Error {
  constructor(status, message, { remainingStock, retryable = false } = {}) {
    super(message);
    this.name = 'MockClaimError';
    this.status = status;
    this.remainingStock = remainingStock;
    this.retryable = retryable;
  }
}

/** Create an in-memory inventory and a request log for one demo session. */
export function createMockClaimApi(items, {
  delayMs = 1400,
  now = () => Date.now(),
  wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
} = {}) {
  const inventory = new Map(items.map((item) => [item.id, { ...item }]));
  const requests = new Map();

  async function reserve(itemId, claimId, scenario) {
    await wait(delayMs);

    const item = inventory.get(itemId);
    if (!item) throw new MockClaimError(404, 'Item not found.');
    if (scenario === 'error') {
      throw new MockClaimError(503, 'Simulated service error.');
    }

    const currentTime = now();
    if (
      scenario === 'conflict' ||
      currentTime < item.dropEpochMs ||
      currentTime >= item.expiresEpochMs ||
      item.remainingStock <= 0
    ) {
      throw new MockClaimError(409, 'Claim could not be reserved.', {
        remainingStock: item.remainingStock,
      });
    }

    item.remainingStock -= 1;
    return { claimId, itemId, remainingStock: item.remainingStock };
  }

  function claim({ itemId, claimId, scenario = 'success' }) {
    const previous = requests.get(claimId);

    if (previous) {
      if (previous.itemId !== itemId || previous.scenario !== scenario) {
        return Promise.reject(new MockClaimError(409, 'Claim ID already in use.'));
      }
      return previous.operation;
    }

    const operation = reserve(itemId, claimId, scenario);
    requests.set(claimId, { itemId, scenario, operation });

    if (scenario === 'retry') {
      return operation.then(() => {
        throw new MockClaimError(0, 'Simulated lost response.', { retryable: true });
      });
    }

    return operation;
  }

  return { claim };
}