import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { ContributionService } from './contribution.service';

@Controller('contribution')
export class ContributionController {
  constructor(private readonly contributionService: ContributionService) {}

  @Get()
  findAll() {}

  @Roles('owner')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createContributionDto: CreateContributionDto) {
    return this.contributionService.create(createContributionDto);
  }

  @Roles('owner')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.contributionService.delete(id);
  }
}
