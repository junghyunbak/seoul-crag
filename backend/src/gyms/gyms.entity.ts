import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { GymImage } from 'src/gym-images/gym-images.entity';
import { GymSchedule } from 'src/gym-schedules/gym-schedules.entity';

@Entity('gyms')
export class Gym {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  thumbnail_url?: string;

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;

  @Column({ type: 'float', nullable: true })
  area: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => GymImage, (image) => image.gym)
  images: GymImage[];

  @OneToMany(() => GymSchedule, (schedule) => schedule.gym)
  schedules: GymSchedule[];
}
