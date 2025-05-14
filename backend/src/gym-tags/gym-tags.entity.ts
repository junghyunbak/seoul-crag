import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Gym } from 'src/gyms/gyms.entity';
import { Tag } from 'src/tags/tags.entity';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { UseGuards } from '@nestjs/common';

@Roles('owner')
@UseGuards(JwtAuthGuard, RolesGuard)
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
