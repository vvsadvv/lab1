const express = require("express");
const cors = require("cors");
const { dbDialect, port } = require("./config/env");
const apiRoutes = require("./routes");
const { initializeDatabase } = require("./services/seedService");

const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api", apiRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: "Маршрут не найден" });
  });

  app.use((error, req, res, next) => {
    console.error(error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: error.errors.map((entry) => entry.message).join("; "),
      });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Нарушено ограничение уникальности",
      });
    }
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  });

  return app;
};

const app = createApp();

const startServer = async () => {
  try {
    await initializeDatabase();
    const server = app.listen(port, () => {
      console.log(`Express API запущен на http://localhost:${port}`);
    });
    return server;
  } catch (error) {
    console.error(
      `Не удалось запустить сервер: ошибка подключения к БД (${dbDialect}).`
    );
    console.error(error.message);
    throw error;
  }
};

if (require.main === module) {
  startServer().catch(() => {
    process.exit(1);
  });
}

module.exports = {
  app,
  createApp,
  startServer,
};
