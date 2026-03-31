const path = require("path");
const { Client } = require("pg");
const { Sequelize } = require("sequelize");
const {
  dbDialect,
  dbHost,
  dbName,
  dbPassword,
  dbPort,
  dbSsl,
  dbStorage,
  dbUrl,
  dbUser,
  serverRoot,
} = require("./env");

const storagePath = path.isAbsolute(dbStorage)
  ? dbStorage
  : path.resolve(serverRoot, dbStorage);

const toSslConfig = () =>
  dbSsl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {};

const getPostgresConnection = () => {
  if (dbUrl) {
    const parsed = new URL(dbUrl);
    return {
      host: parsed.hostname,
      port: Number(parsed.port) || 5432,
      user: decodeURIComponent(parsed.username || ""),
      password: decodeURIComponent(parsed.password || ""),
      database: (parsed.pathname || "").replace(/^\//, "") || dbName,
    };
  }

  return {
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
  };
};

const quoteIdentifier = (value) => `"${String(value).replace(/"/g, "\"\"")}"`;

const ensureDatabaseExists = async () => {
  if (dbDialect !== "postgres") {
    return;
  }

  const postgres = getPostgresConnection();
  const client = new Client({
    host: postgres.host,
    port: postgres.port,
    user: postgres.user,
    password: postgres.password,
    database: "postgres",
    ...(dbSsl
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {}),
  });

  await client.connect();
  try {
    const checkResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [postgres.database]
    );

    if (checkResult.rowCount === 0) {
      await client.query(`CREATE DATABASE ${quoteIdentifier(postgres.database)}`);
      console.log(`База данных "${postgres.database}" создана автоматически.`);
    }
  } finally {
    await client.end();
  }
};

const createSequelizeInstance = () => {
  if (dbDialect === "postgres") {
    if (dbUrl) {
      return new Sequelize(dbUrl, {
        dialect: "postgres",
        logging: false,
        dialectOptions: toSslConfig(),
      });
    }

    const postgres = getPostgresConnection();
    return new Sequelize(postgres.database, postgres.user, postgres.password, {
      host: postgres.host,
      port: postgres.port,
      dialect: "postgres",
      logging: false,
      dialectOptions: toSslConfig(),
    });
  }

  return new Sequelize({
    dialect: "sqlite",
    storage: storagePath,
    logging: false,
  });
};

const sequelize = createSequelizeInstance();
sequelize.ensureDatabaseExists = ensureDatabaseExists;

module.exports = sequelize;
