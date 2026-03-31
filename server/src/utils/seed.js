const { initializeDatabase } = require("../services/seedService");

const run = async () => {
  await initializeDatabase();
  console.log("База данных инициализирована");
  process.exit(0);
};

run().catch((error) => {
  console.error("Ошибка при инициализации БД:", error);
  process.exit(1);
});
