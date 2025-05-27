import { Gym } from 'src/gyms/gyms.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('feeds')
export class Feed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  is_read: boolean;

  @Column()
  thumbnail_url: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Gym, (gym) => gym.feeds, { onDelete: 'CASCADE' })
  gym: Gym;
}
