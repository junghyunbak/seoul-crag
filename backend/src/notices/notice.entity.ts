import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('notices')
export class Notice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  category: 'general' | 'update'; // '공지' 또는 '업데이트'

  @Column({ default: false })
  isPinned: boolean;

  @Column({ default: true })
  visible: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
