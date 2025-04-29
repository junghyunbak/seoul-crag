import {
  IsOptional,
  IsString,
  IsBoolean,
  IsDateString,
  IsIn,
} from 'class-validator';
import { GYM_SCHEDULE_TYPES } from 'src/gym-schedules/gym-schedules.entity';

export class UpdateGymScheduleDto {
  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsBoolean()
  is_regular?: boolean;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsIn(GYM_SCHEDULE_TYPES)
  type?: string;
}
