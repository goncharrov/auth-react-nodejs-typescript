# Быстрый старт с Docker

## Архитектура

- `postgres` — база данных.
- `server` — backend (Node.js). При старте контейнера:
  - ждёт готовности Postgres (`pg_isready`)
  - применяет миграции `node-pg-migrate`
  - запускает приложение `node build/index.js`
- `client` — Nginx, раздаёт `client/dist` и проксирует запросы `/api/*` на backend `server:5007`.

## Запуск приложения

**!!! Команды запускаются из корневой дирректории приложения !!!**

## Требования

- Docker
- Docker Compose (плагин `docker compose`)

## Подготовка

1. Скопируйте `.env.example` в `.env`:

```bash
cp .env.example .env
```

2. При необходимости отредактируйте значения в `.env`.

Если вы меняете порт клиента, обязательно выставьте `CLIENT_URL` в тот же адрес (это нужно для CORS в production).

## Запуск

```bash
# Запуск всех сервисов
docker compose up -d --build

# Просмотр логов
docker compose logs -f

# Остановка
docker compose down
```

## Доступ к приложению

- **Frontend**: http://localhost:8010/
- **API**: http://localhost:8010/api (через nginx proxy)
- **API напрямую**: http://localhost:5007 (для отладки)
- **PostgreSQL**: localhost:5432

## Проверка работы

```bash
# Проверка статуса всех контейнеров
docker compose ps

# Проверка health checks
curl http://localhost:8010/api/csrf-token   # Client
curl http://localhost:5007/api/csrf-token   # Server
```

## Структура

- `client/Dockerfile` - Multi-stage build (Vite + Nginx)
- `server/Dockerfile` - Node.js production build
- `docker-compose.yml` - Оркестрация всех сервисов
- `.dockerignore` - Исключения для ускорения сборки

## Переменные окружения

Все переменные настроены в `docker-compose.yml`. Для изменения создайте `.env` файл на основе `.env.example`.

## Troubleshooting

Если что-то не работает:

```bash
# Перезапуск контейнера
docker compose restart

# Пересборка с очисткой кэша
docker compose build --no-cache

# Перезапуск сервиса
docker compose restart server
```

После старта:

- Frontend будет доступен на порту `CLIENT_PORT` (по умолчанию **8010**)
- Backend внутри сети доступен как `http://server:5007`
- Backend (для отладки) доступен напрямую на хосте `http://localhost:5007`
- DB внутри сети доступна как `postgres:5432`

## Полезные команды

Пересобрать только backend:

```bash
docker compose build server
docker compose up -d server
```

Пересобрать только frontend:

```bash
docker compose build client
docker compose up -d client
```

Логи конкретного сервиса:

```bash
docker compose logs -f server
docker compose logs -f client
docker compose logs -f postgres
```

Зайти в контейнер backend:

```bash
docker compose exec server sh
```

Зайти в контейнер postgres:

```bash
docker compose exec postgres sh
```

## Как работают миграции

Миграции гарантированно применяются **до запуска backend** за счёт entrypoint-скрипта в контейнере `server`:

1. `server` ждёт доступности Postgres через `pg_isready`.
2. Если Postgres готов — выполняется `node-pg-migrate up`.
3. Если миграции завершились успешно — запускается `node build/index.js`.
4. Если миграции упали — контейнер `server` завершается с ошибкой и приложение не стартует.

### Важный нюанс про `node-pg-migrate` в production

В репозитории `node-pg-migrate` находится в `devDependencies`, но в production-образе нужны миграции.
Поэтому в `server/Dockerfile` runtime-слой устанавливает production-зависимости (`npm ci --omit=dev`) и **докачивает `node-pg-migrate` без сохранения в lockfile**:

- это позволяет не менять ваш `package.json`,
- при этом миграции в контейнере работают стабильно.

## Сетевое взаимодействие

- `client` (nginx) раздаёт статические файлы React-приложения.
- `client` проксирует `GET/POST/... /api/*` на `server:5007` (без удаления префикса `/api`, так как backend монтирует роуты на `/api`).
- `server` работает с `postgres` в той же docker-сети.

## Примечания

- Данные Postgres лежат в docker volume `postgres_data`.
- Файл `.env` **не коммитьте** (используйте `.env.example` как шаблон).
- При изменении зависимостей (`package-lock.json`) пересоберите образы: `docker compose up --build -d`.
