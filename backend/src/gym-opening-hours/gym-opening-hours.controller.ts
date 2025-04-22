import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { GymOpeningHoursService } from './gym-opening-hours.service';
import { CreateOpeningHourDto } from './dto/create-opening-hour.dto';

@Controller('gyms/:gymId/opening-hours')
export class GymOpeningHoursController {
  constructor(private readonly service: GymOpeningHoursService) {}

  @Get()
  async getAll(@Param('gymId') gymId: string) {
    return this.service.getOpeningHours(gymId);
  }

  @Patch()
  async upsert(
    @Param('gymId') gymId: string,
    @Body() dto: CreateOpeningHourDto,
  ) {
    return this.service.upsertOpeningHour(gymId, dto);
  }
}
