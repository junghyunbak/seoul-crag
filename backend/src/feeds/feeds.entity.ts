import {
  Column,
  CreateDateColumn,
  Entity,
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
}
