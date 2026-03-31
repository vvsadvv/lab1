const safeJsonParse = (value, fallback = {}) => {
  if (!value) {
    return fallback;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

const serializeExtraData = (value) => {
  if (typeof value === "string") {
    const parsed = safeJsonParse(value, null);
    return JSON.stringify(parsed ?? {});
  }
  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }
  return "{}";
};

const mapPageToResponse = (pageInstance) => {
  const page = pageInstance.toJSON ? pageInstance.toJSON() : pageInstance;
  return {
    ...page,
    extraData: safeJsonParse(page.extraData, {}),
  };
};

module.exports = {
  safeJsonParse,
  serializeExtraData,
  mapPageToResponse,
};
