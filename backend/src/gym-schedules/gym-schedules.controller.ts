import {
  Controller,
  Delete,
  Patch,
  Post,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { GymScheduleService } from './gym-schedules.service';
import { CreateGymScheduleDto } from './dto/create-gym-schedules.dto';
import { UpdateGymScheduleDto } from 'src/gym-schedules/dto/update-gym-schedules.dto';

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

  @Patch(':scheduleId')
  update(
    @Param('gymId') gymId: string,
    @Param('scheduleId') scheduleId: string,
    @Body() dto: UpdateGymScheduleDto,
  ) {
    return this.service.update(gymId, scheduleId, dto);
  }

  @Delete(':scheduleId')
  remove(
    @Param('gymId') gymId: string,
    @Param('scheduleId') scheduleId: string,
  ) {
    return this.service.remove(gymId, scheduleId);
  }
}
