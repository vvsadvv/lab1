const path = require("path");
const dotenv = require("dotenv");

const serverRoot = process.cwd().endsWith(`${path.sep}server`)
  ? process.cwd()
  : path.resolve(process.cwd(), "server");

dotenv.config({ path: path.join(serverRoot, ".env") });

const toBoolean = (value, defaultValue = false) => {
  if (value === undefined) return defaultValue;
  return String(value).toLowerCase() === "true";
};

module.exports = {
  port: Number(process.env.PORT) || 5000,
  jwtSecret: process.env.JWT_SECRET || "change_this_secret",
  dbDialect: process.env.DB_DIALECT || "postgres",
  dbUrl: process.env.DATABASE_URL || "",
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: Number(process.env.DB_PORT) || 5432,
  dbName: process.env.DB_NAME || "aroma_lane",
  dbUser: process.env.DB_USER || "postgres",
  dbPassword: process.env.DB_PASSWORD || "postgres",
  dbSsl: toBoolean(process.env.DB_SSL, false),
  dbStorage: process.env.DB_STORAGE || "./data/database.sqlite",
  serverRoot,
};
