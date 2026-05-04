const { performance } = require("perf_hooks");
const request = require("supertest");

const { app } = require("../app");
const { sequelize } = require("../models");
const { initializeDatabase } = require("../services/seedService");
const { clear } = require("../services/cacheService");

const samples = Number(process.env.CACHE_BENCH_SAMPLES) || 30;

const average = (arr) => arr.reduce((sum, value) => sum + value, 0) / arr.length;

const measureEndpoint = async (url) => {
  const durations = [];
  for (let i = 0; i < samples; i += 1) {
    const started = performance.now();
    const response = await request(app).get(url);
    const finished = performance.now();
    if (response.status !== 200) {
      throw new Error(`Unexpected status ${response.status} for ${url}`);
    }
    durations.push(finished - started);
  }
  return durations;
};

const run = async () => {
  await initializeDatabase();
  clear();

  const withoutCacheDurations = await measureEndpoint("/api/pages/public?noCache=1");

  clear();
  await request(app).get("/api/pages/public"); // warm up miss
  const withCacheDurations = await measureEndpoint("/api/pages/public");

  const summary = {
    samples,
    withoutCacheAvgMs: Number(average(withoutCacheDurations).toFixed(3)),
    withCacheAvgMs: Number(average(withCacheDurations).toFixed(3)),
  };
  summary.speedup = Number((summary.withoutCacheAvgMs / summary.withCacheAvgMs).toFixed(2));

  console.log(JSON.stringify(summary, null, 2));
};

run()
  .catch((error) => {
    console.error("Cache benchmark failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
