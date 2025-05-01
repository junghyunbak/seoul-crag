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
import { GymOpeningHour } from 'src/gym-opening-hours/gym-opening-hours.entity';
import { Comment } from 'src/comments/comments.entity';

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

  @Column({ type: 'text', nullable: true })
  website_url: string;

  @Column({ type: 'date', nullable: true })
  opened_at: string;

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

  @OneToMany(() => GymOpeningHour, (openingHour) => openingHour.gym)
  openingHours: GymOpeningHour[];

  @OneToMany(() => Comment, (comment) => comment.gym)
  comments: Comment[];
}
