import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Gym } from '../gyms/gyms.entity';

export type WeekDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

@Entity('gym_opening_hours')
@Unique(['gym', 'day'])
export class GymOpeningHour {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Gym, (gym) => gym.openingHours, { onDelete: 'CASCADE' })
  gym: Gym;

  @Column()
  day: WeekDay;

  @Column({ type: 'time', nullable: true })
  open_time: string;

  @Column({ type: 'time', nullable: true })
  close_time: string;

  @Column({ default: false })
  is_closed: boolean;
}
