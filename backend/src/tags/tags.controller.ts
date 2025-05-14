import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tags.dto';
import { TagType } from 'src/tags/tags.entity';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @Get('type/:type')
  findByType(@Param('type') type: TagType) {
    return this.tagsService.findByType(type);
  }

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tagsService.delete(id);
  }
}
