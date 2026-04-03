## Установка и настройка

Этот документ описывает **только ручной запуск без Docker**.

#### 1) Установка зависимостей

```bash
cd server && npm install
cd ../client && npm install
```

#### 2) Postgres

Нужно запустить Postgres локально и создать БД/пользователя.

#### 3) Переменные окружения

Для локального запуска backend используйте `server/.env` (если он у вас есть) или задайте переменные окружения аналогично.

- `PORT` (по умолчанию в коде есть fallback на `5007`)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `CLIENT_URL` (origin фронта для CORS)

Минимальный пример `server/.env` для разработки:

```env
# Server
NODE_ENV=development
PORT=5007

# Frontend origin (нужно для CORS)
CLIENT_URL=http://localhost:5177

# Postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=app_db
DB_USER=app_user
DB_PASSWORD=app_password
```

#### 4) Запуск

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

Ожидаемые значения по умолчанию (если вы не меняли конфиги):

- Backend: `http://localhost:5007`
- Frontend (Vite dev server): `http://localhost:5177`

## API Endpoints

### CSRF
- `GET /api/csrf-token` - Получение CSRF токена

### Аутентификация
- `POST /api/auth/check-email` - Проверка существования email
- `POST /api/auth/login-with-password` - Вход пользователя по паролю
- `POST /api/auth/login-with-code` - Вход пользователя по коду на email (5555)
- `POST /api/auth/registration` - Регистрация пользователя
- `GET /api/auth/user` - Получение текущего пользователя
- `POST /api/auth/logout` - Выход пользователя

Все POST запросы требуют CSRF токен в заголовке `X-CSRF-Token` (в коде клиента используется `x-csrf-token`).

## Использование

1. Откройте браузер и перейдите на адрес фронта (обычно `http://localhost:5177`)
2. Нажмите "Вход" или перейдите на `/auth`
3. Введите email для проверки
4. Если пользователь существует, введите пароль
5. Для регистрации нового пользователя перейдите на `/auth/reg`

## Безопасность

- Пароли хешируются с помощью bcrypt (10 раундов)
- CSRF токены защищают от межсайтовых запросов
- Сессии хранятся в PostgreSQL
- Валидация всех входных данных на сервере
- HTTP-only cookies для сессий

## Структура базы данных

Миграции создают таблицы:

### Таблица `auth_users`

Основные поля (см. миграции в `server/migrations/*.ts`):

- `id` (serial, PK)
- `first_name`, `last_name`, `preferred_name`
- `email` (unique, not null)
- `phone` (unique, nullable)
- `birthday`, `gender`
- `role` (default `'USER'`)
- `password`
- `created_at`

### Таблица `sessions`

Используется для хранения сессий:

- `id` (varchar, PK)
- `expiredAt` (bigint, index)
- `json` (text)
- `destroyedAt` (timestamptz, nullable)

## Troubleshooting

### Ошибка подключения к БД

1. Убедитесь, что Postgres запущен и доступен
2. Проверьте параметры подключения в `server/.env`
3. Посмотрите логи backend в консоли, где он запущен (`npm run dev`)

### Ошибка CSRF токена

- Убедитесь, что запросы идут с правильным заголовком `X-CSRF-Token`
- Проверьте, что сессии работают корректно

### Сессии не сохраняются

- Проверьте, что таблица `sessions` создана в БД (миграции)
- Убедитесь, что cookies разрешены в браузере
- Проверьте настройки CORS на сервере

## Лицензия

ISC