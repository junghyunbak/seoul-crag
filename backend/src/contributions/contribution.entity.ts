import { GymUserContribution } from 'src/gym-user-contributions/gym-user-contributions.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('contributions')
export class Contribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  name: string;

  @OneToMany(
    () => GymUserContribution,
    (gymUserContribution) => gymUserContribution.contribution,
  )
  gymUserContributions: GymUserContribution[];

  @CreateDateColumn()
  created_at: Date;
}
