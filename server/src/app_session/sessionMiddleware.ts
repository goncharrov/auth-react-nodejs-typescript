import dotenv from 'dotenv';
import session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import { QueryFailedError } from 'typeorm';
import { AppDataSource } from '../config/database.js';
import { Session } from './sessionEntities.js';
import type { RequestHandler } from 'express';

dotenv.config();

// Postgres unique_violation — два параллельных set() с одним sid оба дошли до INSERT
function isUniqueViolation(err: unknown): boolean {
   if (!(err instanceof QueryFailedError)) return false;
   const code = (err.driverError as { code?: string } | undefined)?.code;
   return code === '23505';
}

function patchStoreSetForInsertRace(
   store: InstanceType<typeof TypeormStore>
): void {
   const originalSet = store.set.bind(store);
   store.set = (sid, sess, fn) => {
      originalSet(sid, sess, (err) => {
         if (err && isUniqueViolation(err)) {
            originalSet(sid, sess, fn);
            return;
         }
         fn?.(err);
      });
   };
}

// Вынесем в отдельную функцию, чтобы можно было вызывать после init DataSource
export async function setupSessionMiddleware(): Promise<RequestHandler> {
   const sessionRepository = AppDataSource.getRepository(Session);

   const store = new TypeormStore({
      cleanupLimit: 2, // сколько записей очищать за раз
      ttl: 60 * 60 * 24, // время жизни сессии в секундах (1 день)
      // limitSubquery: false, // если вдруг MariaDB, для Postgres обычно не нужно
   }).connect(sessionRepository); // важный вызов .connect(...) [web:10]

   patchStoreSetForInsertRace(store);

   const sessionMiddleware = session({
      secret: process.env.SESSION_SECRET ?? 'dev-secret-change-me',
      resave: false,
      saveUninitialized: false,
      store,
      cookie: {
         maxAge: 1000 * 60 * 60 * 24, // 1 день в мс
         secure: false, // true в prod за HTTPS
         httpOnly: true,
         sameSite: 'lax',
      },
   });

   return sessionMiddleware;
}
