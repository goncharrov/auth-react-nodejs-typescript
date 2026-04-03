import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions = {};

export async function up(pgm: MigrationBuilder): Promise<void> {
   pgm.createTable('sessions', {
      id: { type: 'varchar(255)', primaryKey: true },
      expiredAt: { type: 'bigint', notNull: true },
      json: { type: 'text', notNull: true },
      destroyedAt: { type: 'timestamptz', notNull: false },
   });

   pgm.createIndex('sessions', 'expiredAt');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
   pgm.dropTable('sessions');
}
