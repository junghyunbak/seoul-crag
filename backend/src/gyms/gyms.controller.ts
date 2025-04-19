import {
  Patch,
  UseGuards,
  Controller,
  Get,
  Param,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';

import { GymsService } from './gyms.service';

import { Roles } from 'src/auth/roles/roles.decorator';

import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';

import { CreateGymDto } from 'src/gyms/dto/create-gym.dto';
import { UpdateGymDto } from 'src/gyms/dto/update-gym.dto';

import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

import { extname } from 'path';

import { UploadImageDto } from '../gym-images/dto/upload-image.dto';

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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('gym_admin', 'partner_admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGymDto) {
    return this.gymsService.update(id, dto);
  }

  @Post(':gymId/images')
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
    }),
  )
  async uploadImage(
    @Param('gymId', ParseIntPipe) gymId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadImageDto,
  ) {
    const imageUrl = `/uploads/${file.filename}`;

    return this.gymsService.saveImage(gymId, imageUrl, dto.type);
  }
}
