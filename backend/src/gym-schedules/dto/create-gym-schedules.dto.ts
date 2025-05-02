import { IsDateString, IsString, IsIn } from 'class-validator';
import { GymScheduleType } from '../gym-schedules.entity';
import { GYM_SCHEDULE_TYPES } from '../gym-schedules.entity';

export class CreateGymScheduleDto {
  @IsString()
  gymId: string;

  @IsDateString()
  open_date: string;

  @IsDateString()
  close_date: string;

  @IsIn(GYM_SCHEDULE_TYPES)
  type: GymScheduleType;
}
