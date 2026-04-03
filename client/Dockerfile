##########
# build
##########
FROM node:20-alpine AS build

WORKDIR /app

ENV HUSKY=0

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

##########
# nginx
##########
FROM nginx:alpine AS nginx

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
