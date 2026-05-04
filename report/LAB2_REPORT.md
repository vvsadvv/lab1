# Лабораторная работа №2

## 1. Выполненные действия
В рамках сайта из ЛР1 реализованы два пункта из задания:

1. `Кэширование`:
- Добавлено серверное in-memory кэширование публичных страниц (`/api/pages/public`, `/api/pages/public/:slug`) с TTL.
- Добавлен bypass-режим (`?noCache=1`) для сравнения скорости с кэшем и без кэша.
- Добавлена инвалидация кэша при создании/редактировании/удалении страниц.

2. `Покрытие кода тестами`:
- Добавлены unit-тесты для сервиса сериализации/парсинга данных страницы.
- Добавлены интеграционные тесты для:
- регистрации пользователя со статусом `pending`;
- подтверждения пользователя администратором;
- проверки кэширования (`MISS -> HIT -> BYPASS`) и инвалидации после CRUD.

## 2. Измененные файлы
- `server/src/services/cacheService.js` — сервис кэша с TTL и статистикой.
- `server/src/controllers/pageController.js` — подключение read-through кэша + инвалидация.
- `server/src/controllers/cacheController.js`, `server/src/routes/cacheRoutes.js` — admin API для статистики/очистки кэша.
- `server/src/app.js` — рефакторинг запуска сервера для корректного тестирования.
- `server/tests/pageService.test.js` — unit-тесты.
- `server/tests/authAndCache.integration.test.js` — интеграционные тесты.
- `server/src/utils/cacheBenchmark.js` — скрипт замера времени с кэшем/без кэша.

## 3. Фрагменты кода

### 3.1. Read-through кэширование публичных страниц
```js
const key = `${publicCachePrefix}menu`;
const result = await readThrough(key, loadPages);
res.set("x-cache", result.cacheStatus);
return res.json(result.value);
```

### 3.2. Инвалидация кэша после изменения страниц
```js
const createdPage = await Page.create({
  ...data,
  isSystem: false,
});
invalidatePrefix(publicCachePrefix);
return res.status(201).json(mapPageToResponse(createdPage));
```

### 3.3. Тест кэширования (интеграционный)
```js
const firstPublicResponse = await request.get("/api/pages/public");
expect(firstPublicResponse.headers["x-cache"]).toBe("MISS");

const secondPublicResponse = await request.get("/api/pages/public");
expect(secondPublicResponse.headers["x-cache"]).toBe("HIT");

const bypassPublicResponse = await request.get("/api/pages/public?noCache=1");
expect(bypassPublicResponse.headers["x-cache"]).toBe("BYPASS");
```

## 4. Результаты тестирования
Команда:
```bash
npm run test --prefix server
```

Результат:
- `Test Suites: 2 passed, 2 total`
- `Tests: 5 passed, 5 total`

## 5. Результаты по кэшированию (сравнение времени)
Команда:
```bash
npm run benchmark:cache --prefix server
```

Замер (30 запросов):
- без кэша (`/api/pages/public?noCache=1`): `5.442 ms` (среднее)
- с кэшем (`/api/pages/public` после прогрева): `2.933 ms` (среднее)
- ускорение: `~1.86x`

## 6. Вывод
Требование ЛР2 выполнено: на сайте реализовано кэширование и добавлено автоматическое тестирование части backend-кода. В отчете приведены выполненные действия и фрагменты кода.
