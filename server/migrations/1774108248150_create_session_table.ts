import type { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
   pgm.createTable(
      { schema: 'auth', name: 'sessions' }, 
      {
         sid: { type: 'varchar', primaryKey: true, notNull: true },
         sess: { type: 'json', notNull: true },
         expire: { type: 'timestamp(6)', notNull: true },
      }
   );

   pgm.createIndex({ schema: 'auth', name: 'sessions' }, 'expire', {
      name: 'IDX_sessions_expire',
   });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
   pgm.dropTable({ schema: 'auth', name: 'sessions' });
}
