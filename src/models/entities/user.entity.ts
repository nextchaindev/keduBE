import { CommonEntity } from 'src/commons/entities';
import { user_role } from 'src/commons/role';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'user', schema: process.env.POSTGRES_SCHEMA })
export class User extends CommonEntity {
  @Column({ name: 'full_name', type: 'varchar', length: 50 })
  full_name: string;

  @Column({ name: 'username', type: 'varchar', length: 50 })
  username: string;

  @Column({ name: 'email', type: 'varchar', length: 50 })
  email: string;

  @Column({ name: 'password', type: 'varchar' })
  password: string;

  @Column({ name: 'role', type: 'varchar', enum: user_role })
  role: string;
}
