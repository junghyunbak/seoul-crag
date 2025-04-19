import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Gym } from './gyms.entity';
import { GymImage } from '../gym-images/gym-images.entity';
import { GymImageType } from '../gym-images/gym-images.type';

import { CreateGymDto } from 'src/gyms/dto/create-gym.dto';
import { UpdateGymDto } from 'src/gyms/dto/update-gym.dto';

@Injectable()
export class GymsService {
  constructor(
    @InjectRepository(Gym)
    private readonly gymRepo: Repository<Gym>,
    @InjectRepository(GymImage)
    private readonly imageRepo: Repository<GymImage>,
  ) {}

  async findAll(): Promise<Gym[]> {
    return this.gymRepo.find();
  }

  async findOne(id: string): Promise<Gym> {
    const gym = await this.gymRepo.findOneBy({ id });

    if (!gym) {
      throw new NotFoundException('해당 암장을 찾을 수 없습니다.');
    }

    return gym;
  }

  async create(dto: CreateGymDto): Promise<Gym> {
    const gym = this.gymRepo.create(dto);

    return this.gymRepo.save(gym);
  }

  async update(id: string, dto: UpdateGymDto): Promise<Gym> {
    const gym = await this.findOne(id);

    Object.assign(gym, dto);

    return this.gymRepo.save(gym);
  }

  async saveImage(gymId: string, url: string, type: GymImageType) {
    const gym = await this.gymRepo.findOneByOrFail({ id: gymId });

    const image = this.imageRepo.create({ gym, url, type });

    return this.imageRepo.save(image);
  }
}
