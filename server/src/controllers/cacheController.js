const { clear, getStats } = require("../services/cacheService");

const cacheStats = async (req, res) => {
  return res.json(getStats());
};

const clearCache = async (req, res) => {
  clear();
  return res.status(204).send();
};

module.exports = {
  cacheStats,
  clearCache,
};
