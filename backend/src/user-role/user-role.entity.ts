import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';

import { User } from 'src/user/user.entity';
import { Role } from 'src/role/role.entity';

@Entity('user_roles')
@Unique(['user', 'role'])
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userRoles, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Role, { eager: true, onDelete: 'CASCADE' })
  role: Role;
}
