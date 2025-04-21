import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { GymScheduleService } from './gym-schedules.service';
import { CreateGymScheduleDto } from './dto/create-gym-schedules.dto';

@Controller('gyms/:gymId/schedules')
export class GymScheduleController {
  constructor(private readonly service: GymScheduleService) {}

  @Post()
  create(
    @Param('gymId') gymId: string,
    @Body() dto: Omit<CreateGymScheduleDto, 'gymId'>,
  ) {
    return this.service.create({ ...dto, gymId });
  }

  @Get()
  findByGym(@Param('gymId') gymId: string) {
    return this.service.findByGymId(gymId);
  }
}
