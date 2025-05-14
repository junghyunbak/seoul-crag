import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { OneToMany } from 'typeorm';
import { GymTag } from 'src/gym-tags/gym-tags.entity';

export enum TagType {
  CLIMB = 'climb',
  BOARD = 'board',
  LOCATION = 'location',
}

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'enum', enum: TagType })
  type: TagType;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => GymTag, (gymTag) => gymTag.tag)
  gymTags: GymTag[];
}
