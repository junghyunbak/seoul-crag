import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GymImage } from './gym-images.entity';
import { GymImageType } from './gym-images.type';

@Injectable()
export class GymImagesService {
  constructor(
    @InjectRepository(GymImage)
    private readonly imageRepo: Repository<GymImage>,
  ) {}

  async findAllByGym(gymId: string): Promise<GymImage[]> {
    return this.imageRepo.find({ where: { gym: { id: gymId } } });
  }

  async findByGymAndType(
    gymId: string,
    type: GymImageType,
  ): Promise<GymImage[]> {
    return this.imageRepo.find({ where: { gym: { id: gymId }, type } });
  }

  async findThumbnail(gymId: string): Promise<GymImage | null> {
    return this.imageRepo.findOne({
      where: { gym: { id: gymId }, type: 'THUMBNAIL' },
    });
  }

  async save(
    gymId: string,
    url: string,
    type: GymImageType,
  ): Promise<GymImage> {
    const image = this.imageRepo.create({
      gym: { id: gymId },
      url,
      type,
    });
    return this.imageRepo.save(image);
  }

  async delete(id: number): Promise<void> {
    await this.imageRepo.delete(id);
  }
}
