import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { setupSessionMiddleware } from './middleware/session.js';
import { csrfProtection } from './middleware/csrf.js';
import { AppDataSource } from './config/database.js';
import routes from './core/routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5007;

// Middleware
app.use(
   cors({
      origin:
         process.env.NODE_ENV === 'production'
            ? process.env.CLIENT_URL
            : 'http://localhost:5177',
      credentials: true,
   })
);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function startServer(): Promise<void> {
   try {
      // Инициализация подключения к БД
      await AppDataSource.initialize();
      console.log('Подключение к PostgreSQL установлено');

      // Middleware
      app.use(setupSessionMiddleware());
      app.use(csrfProtection());

      // Маршруты
      app.use('/api', routes);

      // Ошибки (после маршрутов)
      app.use(
         (
            err: unknown,
            _req: express.Request,
            res: express.Response,
            next: express.NextFunction
         ) => {
            void next;
            console.error('Express error handler:', err);
            res.status(500).json({
               success: false,
               error: 'Internal server error',
            });
         }
      );

      // Запуск сервера
      app.listen(PORT, () => {
         console.log(`Сервер запущен на порту ${PORT}`);
         console.log(`API доступен по адресу http://localhost:${PORT}`);
      });
   } catch (error) {
      console.error('Ошибка при запуске сервера:', error);
      process.exit(1);
   }
}

startServer();
