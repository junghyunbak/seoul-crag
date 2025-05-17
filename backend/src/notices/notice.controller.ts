import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@Controller('notices')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get()
  getAll(@Query('visible') visible: string) {
    return this.noticeService.findAll(
      typeof visible === 'string' ? visible === 'true' : undefined,
    );
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.noticeService.findOne(id);
  }

  @Roles('owner')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() dto: CreateNoticeDto) {
    return this.noticeService.create(dto);
  }

  @Roles('owner')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNoticeDto) {
    return this.noticeService.update(id, dto);
  }

  @Roles('owner')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.noticeService.remove(id);
  }
}
