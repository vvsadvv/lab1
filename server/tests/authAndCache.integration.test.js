const fs = require("fs");
const path = require("path");

describe("auth + cache integration", () => {
  let app;
  let sequelize;
  let initializeDatabase;
  let request;

  const testStorage = "./data/test-auth-cache.sqlite";
  const testDbAbsolutePath = path.resolve(
    process.cwd().endsWith(`${path.sep}server`) ? process.cwd() : path.resolve(process.cwd(), "server"),
    "data",
    "test-auth-cache.sqlite"
  );

  beforeAll(async () => {
    jest.resetModules();

    process.env.DB_DIALECT = "sqlite";
    process.env.DB_STORAGE = testStorage;
    process.env.JWT_SECRET = "test_secret";
    process.env.CACHE_ENABLED = "true";
    process.env.CACHE_TTL_MS = "120000";

    const supertest = require("supertest");
    ({ app } = require("../src/app"));
    ({ sequelize } = require("../src/models"));
    ({ initializeDatabase } = require("../src/services/seedService"));

    await initializeDatabase();
    request = supertest(app);
  });

  afterAll(async () => {
    await sequelize.close();
    if (fs.existsSync(testDbAbsolutePath)) {
      fs.unlinkSync(testDbAbsolutePath);
    }
  });

  test("регистрация создает pending-пользователя, вход блокируется до approve", async () => {
    const username = `pending_user_${Date.now()}`;
    const password = "pending123";

    const registerResponse = await request
      .post("/api/auth/register")
      .send({ username, password });
    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.role).toBe("pending");

    const blockedLoginResponse = await request
      .post("/api/auth/login")
      .send({ username, password });
    expect(blockedLoginResponse.status).toBe(403);

    const adminLoginResponse = await request
      .post("/api/auth/login")
      .send({ username: "admin", password: "admin123" });
    expect(adminLoginResponse.status).toBe(200);
    const adminToken = adminLoginResponse.body.token;

    const pendingListResponse = await request
      .get("/api/users/pending")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(pendingListResponse.status).toBe(200);

    const pendingUser = pendingListResponse.body.find((item) => item.username === username);
    expect(pendingUser).toBeDefined();

    const approveResponse = await request
      .patch(`/api/users/${pendingUser.id}/approve`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(approveResponse.status).toBe(200);

    const successLoginResponse = await request
      .post("/api/auth/login")
      .send({ username, password });
    expect(successLoginResponse.status).toBe(200);
    expect(successLoginResponse.body.user.role).toBe("editor");
  });

  test("кэширование public pages работает (MISS -> HIT -> BYPASS) и очищается после CRUD", async () => {
    const firstPublicResponse = await request.get("/api/pages/public");
    expect(firstPublicResponse.status).toBe(200);
    expect(firstPublicResponse.headers["x-cache"]).toBe("MISS");

    const secondPublicResponse = await request.get("/api/pages/public");
    expect(secondPublicResponse.status).toBe(200);
    expect(secondPublicResponse.headers["x-cache"]).toBe("HIT");

    const bypassPublicResponse = await request.get("/api/pages/public?noCache=1");
    expect(bypassPublicResponse.status).toBe(200);
    expect(bypassPublicResponse.headers["x-cache"]).toBe("BYPASS");

    const adminLoginResponse = await request
      .post("/api/auth/login")
      .send({ username: "admin", password: "admin123" });
    expect(adminLoginResponse.status).toBe(200);
    const adminToken = adminLoginResponse.body.token;

    const slug = `cache-page-${Date.now()}`;
    const createResponse = await request
      .post("/api/pages")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        slug,
        title: "Cache test page",
        summary: "summary",
        content: "content",
        pageType: "custom",
        menuLabel: "Cache page",
        menuOrder: 999,
        showInMenu: true,
        isPublished: true,
        extraData: {},
      });
    expect(createResponse.status).toBe(201);

    const afterCreateResponse = await request.get("/api/pages/public");
    expect(afterCreateResponse.status).toBe(200);
    expect(afterCreateResponse.headers["x-cache"]).toBe("MISS");
  });
});
