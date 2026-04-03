import type { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions = {};

export async function up(pgm: MigrationBuilder): Promise<void> {
   // Таблица auth_users
   pgm.createTable('auth_users', {
      id: {
         type: 'serial',
         primaryKey: true,
      },
      first_name: {
         type: 'varchar(100)',
         notNull: false,
      },
      last_name: {
         type: 'varchar(100)',
         notNull: false,
      },
      preferred_name: {
         type: 'varchar(200)',
         notNull: false,
      },
      email: {
         type: 'varchar(255)',
         notNull: true,
      },
      phone: {
         type: 'varchar(255)',
         notNull: false,
      },
      birthday: {
         type: 'timestamp',
         notNull: false,
      },
      gender: {
         type: 'varchar(10)',
         notNull: false,
      },
      role: {
         type: 'varchar(20)',
         notNull: true,
         default: pgm.func(`'USER'`),
      },
      password: {
         type: 'varchar(128)',
         notNull: true,
      },
      created_at: {
         type: 'timestamp',
         notNull: true,
         default: pgm.func('now()'),
      },
   });

   // Уникальные индексы для email и phone
   pgm.addConstraint('auth_users', 'auth_users_email_unique', {
      unique: ['email'],
   });
   pgm.addConstraint('auth_users', 'auth_users_phone_unique', {
      unique: ['phone'],
   });

   // Таблица auth_users_verification_code
   pgm.createTable('auth_users_verification_code', {
      user_id: {
         type: 'int',
         primaryKey: true,
      },
      code: {
         type: 'varchar(128)',
         notNull: true,
      },
      expire: {
         type: 'timestamp',
         notNull: true,
      },
   });

   // FK: auth_users_verification_code.user_id -> auth_users.id
   pgm.addConstraint(
      'auth_users_verification_code',
      'auth_users_verification_code_user_id_fkey',
      {
         foreignKeys: [
            {
               columns: ['user_id'],
               references: 'auth_users(id)',
               onDelete: 'RESTRICT',
               onUpdate: 'CASCADE',
            },
         ],
      }
   );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
   // Сначала дропаем таблицу, зависящую от auth_users
   pgm.dropTable('auth_users_verification_code');

   // Затем основную таблицу auth_users
   pgm.dropTable('auth_users');
}
