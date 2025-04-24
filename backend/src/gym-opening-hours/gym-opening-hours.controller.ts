import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { GymOpeningHoursService } from './gym-opening-hours.service';
import { CreateOpeningHourDto } from './dto/create-opening-hour.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';

@Controller('gyms/:gymId/opening-hours')
export class GymOpeningHoursController {
  constructor(private readonly service: GymOpeningHoursService) {}

  @Get()
  async getAll(@Param('gymId') gymId: string) {
    return this.service.getOpeningHours(gymId);
  }

  @Roles('gym_admin', 'partner_admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch()
  async upsert(
    @Param('gymId') gymId: string,
    @Body() dto: CreateOpeningHourDto,
  ) {
    return this.service.upsertOpeningHour(gymId, dto);
  }
}
