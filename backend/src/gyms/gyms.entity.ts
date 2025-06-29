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
import { GymTag } from 'src/gym-tags/gym-tags.entity';
import { GymUserContribution } from 'src/gym-user-contributions/gym-user-contributions.entity';
import { Feed } from 'src/feeds/feeds.entity';
import { GymDiscount } from 'src/gym-discounts/gym-discounts.entity';

export enum Region {
  SEOUL = 'seoul',
  GYEONGGI = 'gyeonggi',
  CHUNGCHEONGNAM = 'chungcheongnam',
  INCHEON = 'incheon',
}

@Entity('gyms')
export class Gym {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;

  @Column({ type: 'float', nullable: true })
  area: number;

  @Column({ type: 'text', nullable: true })
  short_name?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  thumbnail_url?: string;

  @Column({ type: 'text', nullable: true })
  website_url: string;

  @Column({ type: 'date', nullable: true })
  opened_at: string;

  @Column({ type: 'boolean', default: false })
  is_outer_wall: boolean;

  @Column({ type: 'boolean', default: false })
  is_shut_down: boolean;

  @Column({ type: 'text', default: '' })
  shower_url: string;

  @Column({ default: 0 })
  price: number;

  @Column({ type: 'enum', enum: Region, default: Region.SEOUL })
  region: Region;

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

  @OneToMany(() => GymTag, (gymTag) => gymTag.gym)
  gymTags: GymTag[];

  @OneToMany(
    () => GymUserContribution,
    (gymUserContribution) => gymUserContribution.gym,
  )
  gymUserContributions: GymUserContribution[];

  @OneToMany(() => Feed, (feed) => feed.gym)
  feeds: Feed[];

  @OneToMany(() => GymDiscount, (gymDiscount) => gymDiscount.gym)
  gymDiscounts: GymDiscount[];
}
