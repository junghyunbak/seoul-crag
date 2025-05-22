import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CreateGymUserContributionDto } from './dto/create-gym-user-contributions.dto';
import { GymUserContributionService } from './gym-user-contributions.service';
import { Roles } from 'src/auth/roles/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';

@Roles('owner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('gym-user-contribution')
export class GymUserContributionController {
  constructor(
    private readonly gymUserContributionService: GymUserContributionService,
  ) {}

  @Get()
  async findAll() {
    return this.gymUserContributionService.findAll();
  }

  @Post()
  async create(
    @Body() createGymUserContributionDto: CreateGymUserContributionDto,
  ) {
    return this.gymUserContributionService.create(createGymUserContributionDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.gymUserContributionService.delete(id);
  }
}
