import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserRole } from 'src/user-role/user-role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider: string; // ex) 'kakao'

  @Column()
  provider_id: string; // 카카오에서 내려주는 id

  @Column({ nullable: true })
  email?: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  profile_image?: string;

  @Column({ nullable: true })
  refresh_token_hash?: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];
}
