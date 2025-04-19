import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Gym } from '../gyms/gyms.entity';
import { GymImageType } from 'src/gym-images/gym-images.type';

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

  @CreateDateColumn()
  createdAt: Date;
}
