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

<!-- ![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-1.jpg) -->

<!-- <img src="https://drive.google.com/file/d/1voOblBqRfpXG72-1mRC_3nieQKkeMD6D/view?usp=drive_link" width="800" height="425" alt=""> -->

<image src="/.images/auth-react-1.jpg" width="800" height="425" alt="">

Регистрация пользователя

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-2.jpg)

При авторизации пользователя выполняется поиск пользователя по e-mail в базе данных

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-3.jpg)

Если e-mail найден, возможна аутентификация по коду, отправленному на email (функционал реализован только в части записи кода в базу данных), либо паролю.

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-4.jpg)

По умолчанию для удобства тестирования, так как не добавлен функционал отправки писем на e-mail, значение кода во всем приложении установлено **5555**.  
В рабочем варианте значение кода устанавливается методом **random()**.

![Screen|800x425](https://ruproject.org/media/files/2026/04/03/auth-react-ts-5.jpg)

Главная страница приложения

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-6.jpg)

Профиль пользователя

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-7.jpg)

Пример изменения e-mail пользователя.  
На первом этапе требуется подтвердить доступ к текущему e-mail пользователя. 

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-8.jpg)

На втором этапе указывается новый e-mail пользователя. 

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-9.jpg)

На третьем этапе требуется подтвердить доступ к новому e-mail пользователя.  
При указании некорректной информации выводится сообщение об ошибке.

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-10.jpg)

Подтверждение доступа к новому e-mail пользователя.

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-11.jpg)

Возврат на основную страницу профиля пользователя.

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-12.jpg)

Страница ввода персональных данных пользователя.

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-13.jpg)

Страница изменения пароля пользователя.

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-14.jpg)
