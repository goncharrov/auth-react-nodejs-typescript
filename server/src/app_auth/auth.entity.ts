import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   OneToOne,
   JoinColumn,
   PrimaryColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';

@Entity({ schema: 'auth', name: 'users' })
export class User {
   @PrimaryGeneratedColumn()
   id!: number;

   @Column({ type: 'varchar', name: 'first_name', length: 100, nullable: true })
   firstName!: string;

   @Column({ type: 'varchar', name: 'last_name', length: 100, nullable: true })
   lastName!: string;

   @Column({
      type: 'varchar',
      name: 'preferred_name',
      length: 200,
      nullable: true,
   })
   preferredName!: string;

   @Column({ type: 'varchar', unique: true })
   email!: string;

   @Column({ type: 'varchar', unique: true, nullable: true })
   phone!: string;

   @Column({ type: 'timestamp', nullable: true })
   birthday!: Date;

   @Column({ type: 'varchar', length: 10, nullable: true })
   gender!: string;

   @Column({ type: 'varchar', length: 20, default: 'USER' })
   role!: string;

   @Column({ type: 'varchar', length: 128 })
   password!: string;

   @Column({ type: 'timestamp', name: 'created_at' })
   createdAt!: Date;

   @OneToOne(() => UserVerificationCode, (verification) => verification.user)
   verificationCode?: Relation<UserVerificationCode>;
}

@Entity({ schema: 'auth', name: 'verification_codes' })
export class UserVerificationCode {
   @PrimaryColumn({ name: 'user_id', type: 'int' })
   userId!: number;

   @OneToOne(() => User, (user) => user.verificationCode, {
      onDelete: 'RESTRICT',
   })
   @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
   user!: Relation<User>;

   @Column({ type: 'varchar', length: 128 })
   code!: string;

   @Column({ type: 'timestamp' })
   expire!: Date;
}
