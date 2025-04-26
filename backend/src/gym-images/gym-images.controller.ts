import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  Body,
  ParseUUIDPipe,
  Get,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { UploadImageDto } from './dto/upload-image.dto';

import { GymImagesService } from './gym-images.service';
import { GymImageType } from 'src/gym-images/gym-images.type';

import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

import * as sharp from 'sharp';

@Controller('gym-images/:gymId/images')
export class GymImagesController {
  constructor(private readonly gymImagesService: GymImagesService) {}

  @Roles('gym_admin', 'partner_admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${unique}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowed.includes(file.mimetype)) {
          return cb(
            new Error('Only JPEG, PNG, and GIF files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  async uploadImage(
    @Param('gymId', ParseUUIDPipe) gymId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadImageDto,
  ) {
    const imageUrl = `/uploads/${file.filename}`;
    const resizedImageUrl = `/uploads/resized-${file.filename}`;

    /**
     * nest.js의 루트 폴더를 기준으로 계산하기 때문에 '.' 상대경로를 표시
     */
    await sharp(`.${imageUrl}`)
      .rotate()
      .resize({ width: 1024 })
      .jpeg({ quality: 80 })
      .toFile(`.${resizedImageUrl}`);

    return this.gymImagesService.save(gymId, resizedImageUrl, dto.type);
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
