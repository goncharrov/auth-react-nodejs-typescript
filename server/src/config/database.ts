import 'reflect-metadata';
import { DataSource } from 'typeorm';
// import { User, UserVerificationCode } from '../entity/User.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const runningFromBuild = __dirname.includes(`${join('build', 'config')}`);
const runtimeExt = runningFromBuild ? 'js' : 'ts';

export const AppDataSource = new DataSource({
   type: 'postgres',
   host: process.env.DB_HOST,
   port: Number(process.env.DB_PORT),
   username: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME,
   // entities: [User, UserVerificationCode],
   // entities: [
   //    'src/app_auth/authEntities.{ts,js}',
   //    'src/app_session/sessionEntities.{ts,js}',
   // ],
   entities: [
      join(__dirname, '..', 'app_auth', `authEntities.${runtimeExt}`),
      join(__dirname, '..', 'app_session', `sessionEntities.${runtimeExt}`),
   ],
   // migrations: ['src/migrations/*.ts'],
   migrations: [],
   synchronize: false,
   logging: false,
});
