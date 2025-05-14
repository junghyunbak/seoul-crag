import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { GymTagsService } from './gym-tags.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { UseGuards } from '@nestjs/common';
import { CreateGymTagDto } from './dto/create-gym-tags.dto';

@Roles('owner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('gym-tags')
export class GymTagsController {
  constructor(private readonly gymTagsService: GymTagsService) {}

  @Get()
  findAll() {
    return this.gymTagsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateGymTagDto) {
    return this.gymTagsService.create(dto);
  }

  @Delete(':gymId/:tagId')
  delete(@Param('gymId') gymId: string, @Param('tagId') tagId: string) {
    return this.gymTagsService.delete(gymId, tagId);
  }
}
