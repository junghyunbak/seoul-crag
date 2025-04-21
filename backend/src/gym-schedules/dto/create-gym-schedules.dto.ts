import { GymScheduleType } from '../gym-schedules.entity';

export class CreateGymScheduleDto {
  gymId: string;
  date: string;
  type: GymScheduleType;
  reason?: string;
  is_regular?: boolean;
}
