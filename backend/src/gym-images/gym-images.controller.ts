import {
  Controller,
  Post,
  Param,
  Body,
  ParseUUIDPipe,
  Get,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';

import { UploadImageDto } from './dto/upload-image.dto';

import { GymImagesService } from './gym-images.service';
import { GymImageType } from './gym-images.type';

import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

import { UpdateImageDto } from 'src/gym-images/dto/update-image.dto';

@Controller('gym-images/:gymId/images')
export class GymImagesController {
  constructor(private readonly gymImagesService: GymImagesService) {}

  @Roles('gym_admin', 'partner_admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async uploadImage(
    @Param('gymId', ParseUUIDPipe) gymId: string,
    @Body() dto: UploadImageDto,
  ) {
    return this.gymImagesService.save(gymId, dto.url, dto.type, dto.source);
  }

  @Roles('gym_admin', 'partner_admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch()
  async updateImage(@Body() body: UpdateImageDto) {
    const { imageId, source } = body;

    return await this.gymImagesService.update(imageId, source);
  }

  @Get()
  async getAllImages(@Param('gymId', ParseUUIDPipe) gymId: string) {
    return this.gymImagesService.findAllByGym(gymId);
  }

  @Get(':type')
  async getImagesByType(
    @Param('gymId', ParseUUIDPipe) gymId: string,
    @Param('type') type: GymImageType,
  ) {
    return this.gymImagesService.findByGymAndType(gymId, type);
  }

  @Roles('gym_admin', 'partner_admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':imageId')
  async deleteImage(@Param('imageId') imageId: string) {
    await this.gymImagesService.delete(imageId);
    return { success: true };
  }

  @Roles('gym_admin', 'partner_admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('reorder')
  async reorderImages(
    @Param('gymId', ParseUUIDPipe) gymId: string,
    @Body() dto: { type: GymImageType; orderedIds: string[] },
  ) {
    await this.gymImagesService.reorderImages(gymId, dto.type, dto.orderedIds);
    return { success: true };
  }
}
