import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymUserContribution } from './gym-user-contributions.entity';
import { GymUserContributionController } from './gym-user-contributions.controller';
import { GymUserContributionService } from './gym-user-contributions.service';

@Module({
  imports: [TypeOrmModule.forFeature([GymUserContribution])],
  controllers: [GymUserContributionController],
  providers: [GymUserContributionService],
})
export class GymUserContributionModule {}
