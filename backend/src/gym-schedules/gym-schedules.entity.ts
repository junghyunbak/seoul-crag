import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Gym } from '../gyms/gyms.entity';
import { GYM_IMAGE_TYPES } from 'src/gym-images/gym-images.type';
import { format } from 'date-fns';

export const GYM_SCHEDULE_TYPES = ['closed', 'setup', 'reduced'] as const;

export type GymScheduleType = (typeof GYM_IMAGE_TYPES)[number];

@Entity('gym_schedules')
export class GymSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'timestamp',
    transformer: {
      from: (val: Date | null) =>
        val ? format(val, "yyyy-MM-dd'T'HH:mm:ss") : null,
      to: (val: string | null) => val,
    },
  })
  open_date: string;

  @Column({
    type: 'timestamp',
    transformer: {
      from: (val: Date | null) =>
        val ? format(val, "yyyy-MM-dd'T'HH:mm:ss") : null,
      to: (val: string | null) => val,
    },
  })
  close_date: string;

  @Column({ type: 'varchar' })
  type: GymScheduleType;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'boolean', default: false })
  is_all_day: boolean;

  @ManyToOne(() => Gym, (gym) => gym.schedules, { onDelete: 'CASCADE' })
  gym: Gym;
}
