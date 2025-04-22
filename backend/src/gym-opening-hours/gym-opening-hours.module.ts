import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymOpeningHour } from './gym-opening-hours.entity';
import { GymOpeningHoursService } from './gym-opening-hours.service';
import { GymOpeningHoursController } from './gym-opening-hours.controller';
import { Gym } from '../gyms/gyms.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GymOpeningHour, Gym])],
  providers: [GymOpeningHoursService],
  controllers: [GymOpeningHoursController],
})
export class GymOpeningHoursModule {}
