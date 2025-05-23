import { Controller, Get } from '@nestjs/common';
import { GymsV2Service } from './gyms.v2.service';

@Controller('v2/gyms')
export class GymsV2Controller {
  constructor(private readonly gymsService: GymsV2Service) {}

  @Get()
  async findAll() {
    return await this.gymsService.findAll();
  }
}
