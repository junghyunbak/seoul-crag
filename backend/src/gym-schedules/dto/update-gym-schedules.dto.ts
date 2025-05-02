import { PartialType } from '@nestjs/mapped-types';
import { CreateGymDto } from 'src/gyms/dto/create-gym.dto';

export class UpdateGymScheduleDto extends PartialType(CreateGymDto) {}
