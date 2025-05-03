import { PartialType } from '@nestjs/mapped-types';
import { CreateGymScheduleDto } from 'src/gym-schedules/dto/create-gym-schedules.dto';

export class UpdateGymScheduleDto extends PartialType(CreateGymScheduleDto) {}
