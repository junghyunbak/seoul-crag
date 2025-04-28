import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

import * as sharp from 'sharp';

@Controller('image')
export class ImageController {
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
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
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

    return resizedImageUrl;
  }
}
