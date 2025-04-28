import { Injectable, NotFoundException } from '@nestjs/common';
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
      where: { gym: { id: gymId }, type: 'thumbnail' },
    });
  }

  async save(
    gymId: string,
    url: string,
    type: GymImageType,
    source: string,
  ): Promise<GymImage> {
    const last = await this.imageRepo.findOne({
      where: { gym: { id: gymId }, type },
      order: { order: 'DESC' },
    });

    const order = last ? last.order + 1 : 0;

    const image = this.imageRepo.create({
      gym: { id: gymId },
      url,
      type,
      order,
      source,
    });

    return this.imageRepo.save(image);
  }

  async update(imageId: string, source: string) {
    const image = await this.imageRepo.findOne({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException('이미지를 찾을 수 없습니다.');
    }

    image.source = source;

    return this.imageRepo.save(image);
  }

  async delete(id: string): Promise<void> {
    await this.imageRepo.delete(id);
  }

  async reorderImages(
    gymId: string,
    type: GymImageType,
    orderedIds: string[],
  ): Promise<void> {
    for (let index = 0; index < orderedIds.length; index++) {
      await this.imageRepo.update(
        { id: orderedIds[index], gym: { id: gymId }, type },
        { order: index },
      );
    }
  }
}
