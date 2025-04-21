import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymSchedule } from './gym-schedules.entity';
import { GymScheduleService } from './gym-schedules.service';
import { GymScheduleController } from './gym-schedules.controller';
import { Gym } from '../gyms/gyms.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GymSchedule, Gym])],
  providers: [GymScheduleService],
  controllers: [GymScheduleController],
})
export class GymScheduleModule {}
