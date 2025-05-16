import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Gym } from 'src/gyms/gyms.entity';
import { Tag } from 'src/tags/tags.entity';

@Unique(['gym', 'tag'])
@Entity('gym_tags')
export class GymTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Gym, { onDelete: 'CASCADE' })
  gym: Gym;

  @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
  tag: Tag;

  @CreateDateColumn()
  created_at: Date;
}
