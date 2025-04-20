import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Gym } from './gyms.entity';
import { GymImage } from '../gym-images/gym-images.entity';

import { CreateGymDto } from 'src/gyms/dto/create-gym.dto';
import { UpdateGymDto } from 'src/gyms/dto/update-gym.dto';

type GymField = {
  [P in keyof Gym as Gym[P] extends () => any ? never : P]: Gym[P];
};

type ImageType = { imageTypes: string[] };

type GymWithImageTypes = (GymField & ImageType)[];

type JoinGymWithImageType = {
  [P in keyof GymField as `gym_${P}`]: GymField[P];
} & ImageType;

@Injectable()
export class GymsService {
  constructor(
    @InjectRepository(Gym)
    private readonly gymRepo: Repository<Gym>,
    @InjectRepository(GymImage)
    private readonly gymImageRepo: Repository<GymImage>,
  ) {}

  async findAll(): Promise<GymField[]> {
    const gymWithImageTypes: GymField[] = [];

    const rawGyms = await this.gymRepo
      .createQueryBuilder('gym')
      .select('gym')
      .addSelect(
        (qb) =>
          qb
            .subQuery()
            .select(`ARRAY_AGG(DISTINCT i.type)`)
            .from(GymImage, 'i')
            .where('i.gymId = gym.id'),
        'imageTypes',
      )
      .getRawMany<JoinGymWithImageType>();

    rawGyms.forEach((row) => {
      const gymWithImageType: GymWithImageTypes[number] = {
        id: row.gym_id,
        name: row.gym_name,
        description: row.gym_description,
        thumbnail_url: row.gym_thumbnail_url,
        latitude: row.gym_latitude,
        longitude: row.gym_longitude,
        area: row.gym_area,
        created_at: row.gym_created_at,
        updated_at: row.gym_updated_at,
        images: row.gym_images,
        imageTypes: row.imageTypes,
      };

      gymWithImageTypes.push(gymWithImageType);
    });

    return gymWithImageTypes;
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
}
