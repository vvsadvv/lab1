const { cacheEnabled, cacheTtlMs } = require("../config/env");

const storage = new Map();

const stats = {
  hits: 0,
  misses: 0,
};

const now = () => Date.now();

const isExpired = (entry) => entry.expiresAt <= now();

const clone = (value) => JSON.parse(JSON.stringify(value));

const get = (key) => {
  if (!cacheEnabled) {
    return null;
  }

  const entry = storage.get(key);
  if (!entry) {
    stats.misses += 1;
    return null;
  }

  if (isExpired(entry)) {
    storage.delete(key);
    stats.misses += 1;
    return null;
  }

  stats.hits += 1;
  return clone(entry.value);
};

const set = (key, value, ttl = cacheTtlMs) => {
  if (!cacheEnabled) {
    return;
  }
  storage.set(key, {
    value: clone(value),
    expiresAt: now() + ttl,
  });
};

const invalidatePrefix = (prefix) => {
  for (const key of storage.keys()) {
    if (key.startsWith(prefix)) {
      storage.delete(key);
    }
  }
};

const clear = () => {
  storage.clear();
  stats.hits = 0;
  stats.misses = 0;
};

const readThrough = async (key, loader, ttl = cacheTtlMs) => {
  const cached = get(key);
  if (cached !== null) {
    return {
      cacheStatus: "HIT",
      value: cached,
    };
  }

  const value = await loader();
  set(key, value, ttl);
  return {
    cacheStatus: "MISS",
    value,
  };
};

const getStats = () => ({
  enabled: cacheEnabled,
  ttlMs: cacheTtlMs,
  size: storage.size,
  hits: stats.hits,
  misses: stats.misses,
});

module.exports = {
  clear,
  get,
  getStats,
  invalidatePrefix,
  readThrough,
  set,
};
