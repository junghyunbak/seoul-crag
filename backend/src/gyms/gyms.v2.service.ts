import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gym } from './gyms.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GymsV2Service {
  constructor(
    @InjectRepository(Gym) private readonly gymRepo: Repository<Gym>,
  ) {}

  async findAll() {
    return await this.gymRepo.find({
      relations: [
        'images',
        'schedules',
        'openingHours',
        'comments',
        'gymTags.tag',
        'gymUserContributions',
      ],
    });
  }
}
