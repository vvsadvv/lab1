# Сайт-визитка «Aroma Lane» (React + Express)

Учебный проект сайта-визитки для кафе с поддержкой:
- многостраничного интерфейса (минимум 4 страницы);
- авторизации и разграничения прав;
- динамического CRUD для страниц (создание/редактирование/удаление);
- архитектуры `MVC`;
- ORM для БД.

## Стек
- Frontend: `React`, `React Router`, `Axios`, `Vite`.
- Backend: `Express` (Node.js), `Sequelize ORM`, `PostgreSQL`, `JWT`, `bcrypt`.
- Шаблонизатор/представления: `JSX` в React.

## Структура проекта

- `client/` — React-приложение (View).
- `server/` — Express API по MVC:
  - `routes/` — маршруты;
  - `controllers/` — контроллеры;
  - `models/` — модели Sequelize;
  - `services/` — бизнес-логика и сиды.
- `report/REPORT.md` — готовый отчет для сдачи.
- `server/sql/db-structure.sql` — SQL-структура БД PostgreSQL.

## Запуск

1. Установить зависимости:
   ```bash
   npm install
   npm run install:all
   ```
2. Настроить env-файлы:
   -  `server/.env`
   -  `client/.env`
3. Поднять PostgreSQL и создать БД `aroma_lane` (или указать `DATABASE_URL` в `server/.env`).
   БД можно не создавать вручную: сервер проверит наличие и создаст ее автоматически при старте.
4. Запустить проект:
   ```bash
   npm run dev
   ```
5. Открыть фронтенд: `http://localhost:5173`.

## Демо-авторизация
- Логин: `admin`
- Пароль: `admin123`
- Также доступна регистрация новых пользователей на странице `/login`.
- После регистрации пользователь получает статус `pending` и должен быть подтвержден администратором в `/admin/users`.

## Что реализовано по требованиям
- Общие `header/footer` на всех страницах.
- Главная, Контакты, Фотогалерея, Обратная связь.
- Переходы с главной страницы на другие + возврат на главную.
- Разные типы контента: текст, таблица, изображения, видео, форма.
- Гость: только просмотр.
- Авторизованный пользователь: CRUD страниц и просмотр заявок.
- Видимость пунктов интерфейса зависит от прав пользователя.

## Полезные API-маршруты
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/users/pending` (admin)
- `PATCH /api/users/:id/approve` (admin)
- `DELETE /api/users/:id/reject` (admin)
- `GET /api/pages/public`
- `GET /api/pages/public/:slug`
- `GET /api/pages` (auth)
- `POST /api/pages` (auth)
- `PUT /api/pages/:id` (auth)
- `DELETE /api/pages/:id` (auth)
- `POST /api/feedback/public`
- `GET /api/feedback` (auth)
- `GET /api/cache/stats` (admin)
- `DELETE /api/cache/clear` (admin)

## ЛР2: Кэширование и тесты
- Реализовано кэширование публичных страниц сайта с TTL и инвалидацией после CRUD.
- Добавлены unit и интеграционные тесты backend.
- Отчет по ЛР2: `report/LAB2_REPORT.md`.

## ЛР3: Docker Compose
- Реализован запуск сайта через Docker Compose.
- В Compose включены службы `client` (React + Nginx), `server` (Express API) и `db` (PostgreSQL).
- Запуск:
  ```bash
  docker compose up --build -d
  ```
- Остановка:
  ```bash
  docker compose down
  ```
- После запуска сайт доступен по адресу `http://localhost:5173`, API - по адресу `http://localhost:5000`.
- Отчет по ЛР3: `report/LAB3_REPORT.md`.
