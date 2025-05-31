import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Gym } from 'src/gyms/gyms.entity';

@Entity('gym_discounts')
export class GymDiscount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ['group', 'time', 'event'] })
  type: 'group' | 'time' | 'event';

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', nullable: true })
  weekday?: number;

  @Column({ type: 'int', nullable: true })
  min_group_size?: number;

  @Column({ type: 'date', nullable: true })
  date?: string;

  @Column({ type: 'time', nullable: true })
  time_start?: string;

  @Column({ type: 'time', nullable: true })
  time_end?: string;

  @ManyToOne(() => Gym, { onDelete: 'CASCADE' })
  gym: Gym;
}
