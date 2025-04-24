import {
  Controller,
  Delete,
  Patch,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { GymScheduleService } from './gym-schedules.service';
import { CreateGymScheduleDto } from './dto/create-gym-schedules.dto';
import { UpdateGymScheduleDto } from 'src/gym-schedules/dto/update-gym-schedules.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';

@Controller('gyms/:gymId/schedules')
export class GymScheduleController {
  constructor(private readonly service: GymScheduleService) {}

  @Roles('gym_admin', 'partner_admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @Roles('gym_admin', 'partner_admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':scheduleId')
  update(
    @Param('gymId') gymId: string,
    @Param('scheduleId') scheduleId: string,
    @Body() dto: UpdateGymScheduleDto,
  ) {
    return this.service.update(gymId, scheduleId, dto);
  }

  @Roles('gym_admin', 'partner_admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':scheduleId')
  remove(
    @Param('gymId') gymId: string,
    @Param('scheduleId') scheduleId: string,
  ) {
    return this.service.remove(gymId, scheduleId);
  }
}
