import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pg from 'pg';
import type { RequestHandler } from 'express';

const PgSession = connectPgSimple(session);

export function setupSessionMiddleware(): RequestHandler {
   const pgPool = new pg.Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
   });

   return session({
      store: new PgSession({
         pool: pgPool,
         tableName: 'user_sessions',
      }),
      secret: process.env.SESSION_SECRET ?? 'dev-secret-change-me',
      resave: false,
      saveUninitialized: false,
      cookie: {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'lax',
         maxAge: 1000 * 60 * 60 * 24 * 7,
      },
   });
}
