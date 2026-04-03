##########
# build
##########
FROM node:20-alpine AS build

WORKDIR /app

ENV HUSKY=0

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build \
  && ./node_modules/.bin/tsc \
    --module nodenext \
    --moduleResolution nodenext \
    --target ES2022 \
    --outDir migrations-build \
    --rootDir migrations \
    --skipLibCheck true \
    migrations/*.ts

##########
# runtime
##########
FROM node:20-alpine AS runtime

WORKDIR /app

# For pg_isready (wait for Postgres)
RUN apk add --no-cache postgresql-client bash

ENV HUSKY=0

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts \
  && npm install --no-save --ignore-scripts node-pg-migrate@8.0.4 \
  && npm cache clean --force

# App build output
COPY --from=build /app/build ./build

# node-pg-migrate needs migrations at runtime
COPY --from=build /app/migrations-build ./migrations-build

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 5007

ENTRYPOINT ["docker-entrypoint.sh"]
