import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('app_visited')
export class AppVisited {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  user_id: string | null;

  @Column()
  ip: string;

  @Column()
  url: string;

  @Column({ type: 'boolean', default: false })
  is_pwa: boolean;

  @CreateDateColumn()
  created_at: Date;
}
