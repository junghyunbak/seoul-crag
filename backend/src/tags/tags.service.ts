import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag, TagType } from './tags.entity';
import { CreateTagDto } from './dto/create-tags.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  async findByType(type: TagType): Promise<Tag[]> {
    return this.tagRepository.find({ where: { type } });
  }

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagRepository.create(createTagDto);
    return this.tagRepository.save(tag);
  }

  async delete(id: string): Promise<void> {
    await this.tagRepository.delete(id);
  }
}
