#!/usr/bin/env bash
set -e

: "${NODE_ENV:=production}"
: "${PORT:=3000}"

# Preferred: DATABASE_URL=postgres://user:pass@host:port/db
# Fallback:
: "${DB_HOST:=postgres}"
: "${DB_PORT:=5432}"
: "${DB_NAME:=app_db}"
: "${DB_USER:=app_user}"
: "${DB_PASSWORD:=app_password}"

if [ -n "${DATABASE_URL:-}" ]; then
  export PGCONNECT_TIMEOUT="${PGCONNECT_TIMEOUT:-3}"
  # pg_isready can use a connection string as well
  PG_ISREADY_ARGS=(-d "${DATABASE_URL}")
else
  export PGHOST="${DB_HOST}"
  export PGPORT="${DB_PORT}"
  export PGDATABASE="${DB_NAME}"
  export PGUSER="${DB_USER}"
  export PGPASSWORD="${DB_PASSWORD}"
  PG_ISREADY_ARGS=(-h "${PGHOST}" -p "${PGPORT}" -d "${PGDATABASE}" -U "${PGUSER}")
fi

echo "Waiting for Postgres to be ready..."
for i in $(seq 1 "${DB_WAIT_RETRIES:-60}"); do
  if pg_isready "${PG_ISREADY_ARGS[@]}" >/dev/null 2>&1; then
    echo "Postgres is ready."
    break
  fi
  if [ "$i" -eq "${DB_WAIT_RETRIES:-60}" ]; then
    echo "Postgres is not ready after ${DB_WAIT_RETRIES:-60} attempts." >&2
    exit 1
  fi
  sleep "${DB_WAIT_SLEEP_SECONDS:-1}"
done

echo "Running migrations..."

MIGRATE_BIN="./node_modules/.bin/node-pg-migrate"
if [ ! -x "${MIGRATE_BIN}" ]; then
  echo "Migration binary not found/executable: ${MIGRATE_BIN}" >&2
  echo "node_modules/.bin contains:" >&2
  ls -la ./node_modules/.bin >&2 || true
  exit 1
fi

# node-pg-migrate options:
# -j js                -> JS migrations
# -m migrations-build   -> compiled migrations directory

# Ensure DATABASE_URL is present for node-pg-migrate (most reliable in containers)
if [ -z "${DATABASE_URL:-}" ]; then
  export DATABASE_URL="postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
fi

# Important: do NOT pass -d with a connection string (some node-pg-migrate setups
# interpret -d as env-var name). Rely on DATABASE_URL instead.
"${MIGRATE_BIN}" -j js -m migrations-build up

echo "Starting server..."
exec node build/index.js
