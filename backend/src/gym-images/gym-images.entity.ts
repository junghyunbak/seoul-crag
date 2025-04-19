// src/gym-images/gym-image.entity.ts (order 컬럼 추가)
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Gym } from '../gyms/gyms.entity';
import { GymImageType } from './gym-images.type';

@Entity('gym_images')
export class GymImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Gym, (gym) => gym.images, { onDelete: 'CASCADE' })
  gym: Gym;

  @Column()
  url: string;

  @Column({ type: 'varchar' })
  type: GymImageType;

  @Column({ type: 'int', default: 0 })
  order: number;

  @CreateDateColumn()
  created_at: Date;
}
