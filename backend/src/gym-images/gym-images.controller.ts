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
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

// [ ]: 업로드 권한 테스트
@Roles('gym_admin', 'partner_admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('gyms/:gymId/images')
export class GymImagesController {
  constructor(private readonly gymImagesService: GymImagesService) {}

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
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
    }),
  )
  async uploadImage(
    @Param('gymId', ParseUUIDPipe) gymId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadImageDto,
  ) {
    const imageUrl = `/uploads/${file.filename}`;
    return this.gymImagesService.save(gymId, imageUrl, dto.type);
  }

  @Get()
  async getAllImages(@Param('gymId', ParseUUIDPipe) gymId: string) {
    return this.gymImagesService.findAllByGym(gymId);
  }

  @Get(':type')
  async getImagesByType(
    @Param('gymId', ParseUUIDPipe) gymId: string,
    @Param('type') type: string,
  ) {
    return this.gymImagesService.findByGymAndType(gymId, type as any);
  }

  @Delete(':imageId')
  async deleteImage(@Param('imageId') imageId: string) {
    await this.gymImagesService.delete(imageId);
    return { success: true };
  }
}
