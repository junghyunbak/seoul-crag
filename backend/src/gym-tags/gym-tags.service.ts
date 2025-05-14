import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GymTag } from 'src/gym-tags/gym-tags.entity';
import { CreateGymTagDto } from 'src/gym-tags/dto/create-gym-tags.dto';

@Injectable()
export class GymTagsService {
  constructor(
    @InjectRepository(GymTag)
    private readonly gymTagRepository: Repository<GymTag>,
  ) {}

  async findAll(): Promise<GymTag[]> {
    return this.gymTagRepository.find({ relations: ['gym', 'tag'] });
  }

  async create({ gymId, tagId }: CreateGymTagDto): Promise<GymTag> {
    const gymTag = this.gymTagRepository.create({
      gym: { id: gymId },
      tag: { id: tagId },
    });
    return this.gymTagRepository.save(gymTag);
  }

  async delete(id: string): Promise<void> {
    await this.gymTagRepository.delete(id);
  }
}
