import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Gym } from '../gyms/gyms.entity';

export type GymScheduleType = 'closed' | 'setup' | 'lesson' | 'etc';

@Entity('gym_schedules')
export class GymSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Gym, (gym) => gym.schedules, { onDelete: 'CASCADE' })
  gym: Gym;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'varchar' })
  type: GymScheduleType;

  @Column({ nullable: true })
  reason?: string;

  @Column({ default: false })
  is_regular: boolean;

  @CreateDateColumn()
  created_at: Date;
}
