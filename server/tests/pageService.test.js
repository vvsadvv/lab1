const {
  mapPageToResponse,
  safeJsonParse,
  serializeExtraData,
} = require("../src/services/pageService");

describe("pageService", () => {
  test("safeJsonParse возвращает fallback для невалидного JSON", () => {
    expect(safeJsonParse("{bad-json}", { ok: false })).toEqual({ ok: false });
  });

  test("serializeExtraData сериализует объект в JSON", () => {
    const result = serializeExtraData({ key: "value", count: 2 });
    expect(result).toBe("{\"key\":\"value\",\"count\":2}");
  });

  test("mapPageToResponse преобразует extraData в объект", () => {
    const mapped = mapPageToResponse({
      id: 1,
      title: "Test",
      extraData: "{\"images\":[\"/img-1.jpg\"]}",
    });

    expect(mapped.extraData).toEqual({
      images: ["/img-1.jpg"],
    });
  });
});
