import {
  Patch,
  UseGuards,
  Controller,
  Get,
  Param,
  Post,
  Body,
} from '@nestjs/common';

import { GymsService } from './gyms.service';

import { Roles } from 'src/auth/roles/roles.decorator';

import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';

import { CreateGymDto } from 'src/gyms/dto/create-gym.dto';
import { UpdateGymDto } from 'src/gyms/dto/update-gym.dto';

@Controller('gyms')
export class GymsController {
  constructor(private readonly gymsService: GymsService) {}

  @Get()
  findAll() {
    return this.gymsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gymsService.findOne(id);
  }

  @Roles('owner')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() dto: CreateGymDto) {
    return this.gymsService.create(dto);
  }

  @Roles('gym_admin', 'partner_admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGymDto) {
    return this.gymsService.update(id, dto);
  }
}
