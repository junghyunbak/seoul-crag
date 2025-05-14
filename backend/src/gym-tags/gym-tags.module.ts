import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymTagsService } from './gym-tags.service';
import { GymTagsController } from './gym-tags.controller';
import { GymTag } from 'src/gym-tags/gym-tags.entity';
import { Gym } from 'src/gyms/gyms.entity';
import { Tag } from 'src/tags/tags.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GymTag, Gym, Tag])],
  controllers: [GymTagsController],
  providers: [GymTagsService],
  exports: [GymTagsService],
})
export class GymTagsModule {}
