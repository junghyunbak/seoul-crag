import { IsOptional, IsString, IsBoolean, Matches } from 'class-validator';
import { WeekDay } from '../gym-opening-hours.entity';

export class CreateOpeningHourDto {
  @IsString()
  day: WeekDay;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
  open_time?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
  close_time?: string;

  @IsOptional()
  @IsBoolean()
  is_closed?: boolean;
}
