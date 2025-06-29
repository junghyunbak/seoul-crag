import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Gym } from './gyms.entity';
import { GymImage } from '../gym-images/gym-images.entity';

import { CreateGymDto } from 'src/gyms/dto/create-gym.dto';
import { UpdateGymDto } from 'src/gyms/dto/update-gym.dto';

import { GymSchedule } from 'src/gym-schedules/gym-schedules.entity';
import { GymOpeningHour } from 'src/gym-opening-hours/gym-opening-hours.entity';
import { GymTag } from 'src/gym-tags/gym-tags.entity';
import { GymUserContribution } from 'src/gym-user-contributions/gym-user-contributions.entity';
import { Tag } from 'src/tags/tags.entity';
import { Feed } from 'src/feeds/feeds.entity';
import { GymDiscount } from 'src/gym-discounts/gym-discounts.entity';

type GymColumn = {
  [P in keyof Gym as Gym[P] extends () => any ? never : P]: Gym[P];
};

type QueriedGymColumn = {
  [P in keyof Gym as `gym_${P}`]: Gym[P];
};

type GymRelation = Partial<{
  images: GymImage[];
  schedules: GymSchedule[];
  openingHours: GymOpeningHour[];
  gymTags: GymTag[];
  gymUserContributions: GymUserContribution[];
  gymDiscounts: GymDiscount[];
  feeds: Feed[];
}>;

type GymJoined = GymColumn & Required<GymRelation>;

@Injectable()
export class GymsService {
  constructor(
    @InjectRepository(Gym)
    private readonly gymRepo: Repository<Gym>,
    @InjectRepository(GymImage)
    private readonly gymImageRepo: Repository<GymImage>,
  ) {}

  getJoinedGymQueryBuilder() {
    return this.gymRepo
      .createQueryBuilder('gym')
      .select('gym')
      .addSelect(
        (qb) =>
          qb
            .subQuery()
            .select(`JSON_AGG(i)`)
            .from(GymImage, 'i')
            .where('i.gymId = gym.id'),
        'images',
      )
      .addSelect(
        (qb) =>
          qb
            .subQuery()
            .select(`JSON_AGG(s)`)
            .from(GymSchedule, 's')
            .where('s.gymId = gym.id'),
        'schedules',
      )
      .addSelect(
        (qb) =>
          qb
            .subQuery()
            .select(`JSON_AGG(o)`)
            .from(GymOpeningHour, 'o')
            .where('o.gymId = gym.id'),
        'openingHours',
      )
      .addSelect(
        (qb) =>
          qb
            .subQuery()
            .select(
              `JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', gt.id,
                  'tag', TO_JSON(t),
                  'created_at', gt.created_at
                )
              )`,
            )
            .from(GymTag, 'gt')
            .leftJoin(Tag, 't', 't.id = gt.tagId')
            .where('gt.gymId = gym.id'),
        'gymTags',
      )
      .addSelect(
        (qb) =>
          qb
            .subQuery()
            .select(
              `
              JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', uc.id,
                  'description', uc.description,
                  'created_at', uc.created_at,
                  'user', TO_JSON(gym_user),
                  'contribution', TO_JSON(gym_contribution)
                )
              )
            `,
            )
            .from(GymUserContribution, 'uc')
            .leftJoin('uc.user', 'gym_user')
            .leftJoin('uc.contribution', 'gym_contribution')
            .where('uc.gymId = gym.id'),
        'gymUserContributions',
      )
      .addSelect(
        (qb) =>
          qb
            .subQuery()
            .select(`JSON_AGG(d)`)
            .from(GymDiscount, 'd')
            .where('d.gymId = gym.id'),
        'gymDiscounts',
      )
      .addSelect(
        (qb) =>
          qb
            .subQuery()
            .select(`JSON_AGG(f)`)
            .from(Feed, 'f')
            .where('f.gymId = gym.id'),
        'feeds',
      );
  }

  async findAll(): Promise<GymJoined[]> {
    const gymWithImages: GymJoined[] = [];

    const rawGyms = await this.getJoinedGymQueryBuilder().getRawMany<
      QueriedGymColumn & GymRelation
    >();

    rawGyms.forEach((raw) => {
      const gymWithImage: GymJoined = {
        id: raw.gym_id,
        name: raw.gym_name,
        description: raw.gym_description,
        latitude: raw.gym_latitude,
        longitude: raw.gym_longitude,
        thumbnail_url: raw.gym_thumbnail_url,
        website_url: raw.gym_website_url,
        shower_url: raw.gym_shower_url,
        area: raw.gym_area,
        short_name: raw.gym_short_name,
        is_outer_wall: raw.gym_is_outer_wall,
        opened_at: raw.gym_opened_at,
        price: raw.gym_price,
        is_shut_down: raw.gym_is_shut_down,
        region: raw.gym_region,

        created_at: raw.gym_created_at,
        updated_at: raw.gym_updated_at,

        images: raw.images || [],
        schedules: raw.schedules || [],
        openingHours: raw.openingHours || [],
        gymTags: raw.gymTags || [],
        gymUserContributions: raw.gymUserContributions || [],
        gymDiscounts: raw.gymDiscounts || [],
        feeds: raw.feeds || [],

        comments: raw.gym_comments,
      };

      gymWithImages.push(gymWithImage);
    });

    return gymWithImages;
  }

  async findOne(id: string): Promise<GymJoined> {
    const rawGym = await this.getJoinedGymQueryBuilder()
      .where(`gym.id = :id`, { id })
      .getRawOne<QueriedGymColumn & GymRelation>();

    if (!rawGym) {
      throw new NotFoundException('해당 암장을 찾을 수 없습니다.');
    }

    const gymWithImage: GymJoined = {
      id: rawGym.gym_id,
      name: rawGym.gym_name,
      description: rawGym.gym_description,
      latitude: rawGym.gym_latitude,
      longitude: rawGym.gym_longitude,
      thumbnail_url: rawGym.gym_thumbnail_url,
      website_url: rawGym.gym_website_url,
      shower_url: rawGym.gym_shower_url,
      area: rawGym.gym_area,
      opened_at: rawGym.gym_opened_at,
      short_name: rawGym.gym_short_name,
      is_outer_wall: rawGym.gym_is_outer_wall,
      created_at: rawGym.gym_created_at,
      updated_at: rawGym.gym_updated_at,
      price: rawGym.gym_price,
      is_shut_down: rawGym.gym_is_shut_down,
      region: rawGym.gym_region,

      images: rawGym.images || [],
      schedules: rawGym.schedules || [],
      openingHours: rawGym.openingHours || [],
      gymTags: rawGym.gymTags || [],
      gymUserContributions: rawGym.gymUserContributions || [],
      gymDiscounts: rawGym.gymDiscounts || [],
      feeds: rawGym.feeds || [],

      comments: rawGym.gym_comments,
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
