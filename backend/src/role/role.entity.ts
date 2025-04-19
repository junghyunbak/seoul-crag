import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRole } from 'src/user-role/user-role.entity';

export type RoleName = 'owner' | 'gym_admin' | 'partner_admin';

export const DEFAULT_ROLES: RoleName[] = [
  'owner',
  'gym_admin',
  'partner_admin',
];

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  name: RoleName;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}
