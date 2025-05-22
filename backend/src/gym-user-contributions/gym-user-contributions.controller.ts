import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { CreateGymUserContributionDto } from './dto/create-gym-user-contributions.dto';
import { GymUserContributionService } from './gym-user-contributions.service';
import { Roles } from 'src/auth/roles/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { UpdateGymUserContributionDto } from './dto/update-gym-user-contributions.dto';

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

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGymUserContributionDto: UpdateGymUserContributionDto,
  ) {
    return this.gymUserContributionService.update(
      id,
      updateGymUserContributionDto.description,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.gymUserContributionService.delete(id);
  }
}
