# Приложение аутентификации c профилем пользователя

Полнофункциональное веб-приложение с аутентификацией и профилем пользователя, построенное на Node.js, PostgreSQL, TypeORM и React.

## Технологии

- **Frontend**: React + TypeScript + Vite (сборка в `client/dist`)
- **Backend**: Node.js + Express + TypeScript (сборка в `server/build`, запуск `node build/index.js`)
- **DB**: PostgreSQL
- **ORM**: TypeORM (в приложении)
- **Миграции**: `node-pg-migrate` (TS-монорепо миграции в `server/migrations/*.ts`)
- **Reverse proxy / static**: Nginx (в контейнере `client`)

## Структура проекта

- `client/` — frontend (React/Vite)
- `server/` — backend (Express/TS)
- `docker-compose.yml` — оркестрация сервисов (postgres + server + client)
- `.env.example` — пример переменных окружения

## Старт приложения

Для быстрого старта в **docker** смотрите инструкцию в файле **QUICKSTART.md**  
Для установки и настройки **локально** смотрите инструкцию в файле **SETUPMANUAL.md**

## Краткое описание приложения с иллюстрациями

Авторизация пользователя

<image src="/.images/auth-react-1.jpg" width="800" height="425" alt="">

Регистрация пользователя

<image src="/.images/auth-react-2.jpg" width="800" height="425" alt="">

При авторизации пользователя выполняется поиск пользователя по e-mail в базе данных

<image src="/.images/auth-react-3.jpg" width="800" height="425" alt="">

Если e-mail найден, возможна аутентификация по коду, отправленному на email (функционал реализован только в части записи кода в базу данных), либо паролю.

<image src="/.images/auth-react-4.jpg" width="800" height="425" alt="">

По умолчанию для удобства тестирования, так как не добавлен функционал отправки писем на e-mail, значение кода во всем приложении установлено **5555**.  
В рабочем варианте значение кода устанавливается методом **random()**.

<image src="/.images/auth-react-5.jpg" width="800" height="425" alt="">

Главная страница приложения

<image src="/.images/auth-react-6.jpg" width="800" height="425" alt="">

Профиль пользователя

<image src="/.images/auth-react-7.jpg" width="800" height="425" alt="">

Пример изменения e-mail пользователя.  
На первом этапе требуется подтвердить доступ к текущему e-mail пользователя. 

<image src="/.images/auth-react-8.jpg" width="800" height="425" alt="">

На втором этапе указывается новый e-mail пользователя. 

<image src="/.images/auth-react-9.jpg" width="800" height="425" alt="">

На третьем этапе требуется подтвердить доступ к новому e-mail пользователя.  
При указании некорректной информации выводится сообщение об ошибке.

<image src="/.images/auth-react-10.jpg" width="800" height="425" alt="">

Подтверждение доступа к новому e-mail пользователя.

<image src="/.images/auth-react-11.jpg" width="800" height="425" alt="">

Возврат на основную страницу профиля пользователя.

<image src="/.images/auth-react-12.jpg" width="800" height="425" alt="">

Страница ввода персональных данных пользователя.

<image src="/.images/auth-react-13.jpg" width="800" height="425" alt="">

Страница изменения пароля пользователя.

<image src="/.images/auth-react-14.jpg" width="800" height="425" alt="">
