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
    const gymWithImages: GymField[] = [];

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

    rawGyms.forEach((raw) => {
      const gymWithImage: GymWithImageTypes[number] = {
        id: raw.gym_id,
        name: raw.gym_name,
        description: raw.gym_description,
        thumbnail_url: raw.gym_thumbnail_url,
        latitude: raw.gym_latitude,
        longitude: raw.gym_longitude,
        area: raw.gym_area,
        created_at: raw.gym_created_at,
        updated_at: raw.gym_updated_at,
        images: raw.gym_images,
        schedules: raw.gym_schedules,
        imageTypes: raw.imageTypes,
      };

      gymWithImages.push(gymWithImage);
    });

    return gymWithImages;
  }

  async findOne(id: string): Promise<GymField> {
    const rawGym = await this.gymRepo
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
      .where(`gym.id = :id`, { id })
      .getRawOne<JoinGymWithImageType>();

    if (!rawGym) {
      throw new NotFoundException('해당 암장을 찾을 수 없습니다.');
    }

    const gymWithImage: GymWithImageTypes[number] = {
      id: rawGym.gym_id,
      name: rawGym.gym_name,
      description: rawGym.gym_description,
      thumbnail_url: rawGym.gym_thumbnail_url,
      latitude: rawGym.gym_latitude,
      longitude: rawGym.gym_longitude,
      area: rawGym.gym_area,
      created_at: rawGym.gym_created_at,
      updated_at: rawGym.gym_updated_at,
      images: rawGym.gym_images,
      schedules: rawGym.gym_schedules,
      imageTypes: rawGym.imageTypes,
    };

    return gymWithImage;
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
