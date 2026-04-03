import {
   Entity,
   Column,
   PrimaryColumn,
   Index,
   DeleteDateColumn,
} from 'typeorm';
import type { ISession } from 'connect-typeorm';

@Entity({ name: 'sessions' })
export class Session implements ISession {
   @PrimaryColumn({ type: 'varchar', length: 255 })
   id!: string; // sid из express-session

   @Index()
   @Column({ type: 'bigint' })
   expiredAt!: number; // unix timestamp (ms или s — важно быть последовательным)

   @Column({ type: 'text' })
   json!: string; // сериализованные данные сессии

   // Требуется connect-typeorm: soft delete + update в TypeormStore
   @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
   destroyedAt?: Date;
}
