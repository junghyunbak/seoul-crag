import { Contribution } from 'src/contributions/contribution.entity';
import { Gym } from 'src/gyms/gyms.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('gym_user_contributions')
export class GymUserContribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Gym, { onDelete: 'CASCADE' })
  gym: Gym;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Contribution, { onDelete: 'CASCADE' })
  contribution: Contribution;

  @CreateDateColumn()
  created_at: Date;
}
