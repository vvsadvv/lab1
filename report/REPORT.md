# Отчет по лабораторной работе

## 1. Тема проекта
Сайт-визитка кафе **Aroma Lane** с многостраничным интерфейсом, авторизацией пользователей и административной панелью для управления контентом.

## 2. Использованные технологии
- Язык: `JavaScript`
- Frontend: `React`, `React Router`, `Axios`, `Vite`
- Backend (веб-фреймворк): `Express`
- Подход: `Model-View-Controller (MVC)`
- ORM: `Sequelize`
- База данных: `PostgreSQL`
- Шаблонизатор представлений: `JSX` (React)

## 3. Краткое описание сайта
Сайт состоит из публичной и административной частей.

Публичная часть содержит страницы:
1. Главная (`/`)
2. Контакты (`/contacts`)
3. Фотогалерея (`/gallery`)
4. Обратная связь (`/feedback`)

Административная часть:
- `/admin/pages` — создание, редактирование и удаление страниц (CRUD)
- `/admin/feedback` — просмотр заявок обратной связи
- `/admin/users` — подтверждение регистраций пользователей

Регистрация работает через статус `pending`: пользователь после регистрации не может войти, пока администратор не подтвердит заявку.

## 4. Реализация требований
- Общие `header` и `footer` используются на всех страницах сайта
- Реализована навигация с главной страницы на все основные разделы
- На любой странице есть возможность вернуться на главную
- Используются разные типы контента: текст, таблицы, изображения, видео, форма
- Разграничение прав:
- Неавторизованный пользователь — только просмотр
- Пользователь со статусом `pending` — ожидает подтверждение админом
- `editor`/`admin` — доступ к редактированию контента
- Элементы интерфейса отображаются в зависимости от роли

## 5. Скриншоты страниц
Добавьте скриншоты в папку `report/screenshots`:

1. Главная  
![Главная](./screenshots/home.png)

2. Контакты  
![Контакты](./screenshots/contacts.png)

3. Галерея  
![Галерея](./screenshots/gallery.png)

4. Обратная связь  
![Обратная связь](./screenshots/feedback.png)

5. Авторизация / регистрация  
![Авторизация](./screenshots/login.png)

6. CRUD страниц  
![CRUD страниц](./screenshots/admin-pages.png)

7. Подтверждение пользователей  
![Подтверждение пользователей](./screenshots/admin-users.png)

## 6. Фрагменты кода

### 6.1. Модель пользователя (ORM)
```js
const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM("admin", "editor", "pending"),
    allowNull: false,
    defaultValue: "pending",
  },
});
```

### 6.2. Регистрация пользователя
```js
const createdUser = await User.create({
  username: username.trim(),
  passwordHash,
  role: "pending",
});
```

### 6.3. Ограничение входа до подтверждения админом
```js
if (user.role === "pending") {
  return res.status(403).json({
    message: "Ваша заявка на регистрацию ожидает подтверждения администратором",
  });
}
```

### 6.4. Маршруты подтверждения пользователя администратором
```js
userRouter.get("/pending", asyncHandler(getPendingUsers));
userRouter.patch("/:id/approve", asyncHandler(approveUser));
userRouter.delete("/:id/reject", asyncHandler(rejectUser));
```

## 7. Структура базы данных

### Таблица `users`
- `id` — `SERIAL`, PK
- `username` — `VARCHAR(255)`, `NOT NULL`, `UNIQUE`
- `passwordHash` — `VARCHAR(255)`, `NOT NULL`
- `role` — `ENUM('admin','editor','pending')`, `NOT NULL`, default `pending`
- `createdAt` — `TIMESTAMP WITH TIME ZONE`
- `updatedAt` — `TIMESTAMP WITH TIME ZONE`

### Таблица `pages`
- `id` — `SERIAL`, PK
- `slug` — `VARCHAR(255)`, `NOT NULL`, `UNIQUE`
- `title` — `VARCHAR(255)`, `NOT NULL`
- `summary` — `VARCHAR(255)`, default `''`
- `content` — `TEXT`, default `''`
- `pageType` — `ENUM('home','contacts','gallery','feedback','custom')`
- `menuLabel` — `VARCHAR(255)`
- `menuOrder` — `INTEGER`
- `showInMenu` — `BOOLEAN`
- `isPublished` — `BOOLEAN`
- `isSystem` — `BOOLEAN`
- `extraData` — `TEXT` (JSON-данные в строке)
- `createdAt` — `TIMESTAMP WITH TIME ZONE`
- `updatedAt` — `TIMESTAMP WITH TIME ZONE`

### Таблица `feedback`
- `id` — `SERIAL`, PK
- `name` — `VARCHAR(255)`, `NOT NULL`
- `email` — `VARCHAR(255)`, `NOT NULL`
- `message` — `TEXT`, `NOT NULL`
- `createdAt` — `TIMESTAMP WITH TIME ZONE`
- `updatedAt` — `TIMESTAMP WITH TIME ZONE`

SQL-схема также приложена в файле `server/sql/db-structure.sql`.

## 8. Ссылка на репозиторий
Указать ссылку на репозиторий с кодом сайта: `https://...`

## 9. Вывод
Разработан сайт-визитка на `React + JavaScript` с серверной частью на `Express`, использованием `MVC` и `ORM` (`Sequelize`), поддержкой авторизации, регистрации с подтверждением администратором и динамическим управлением страницами.
