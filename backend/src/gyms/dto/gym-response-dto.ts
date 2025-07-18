import { Expose, Exclude } from 'class-transformer';
import { Feed } from 'src/feeds/feeds.entity';

export class InternalGymResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  short_name?: string;

  @Expose()
  latitude: number;

  @Expose()
  longitude: number;

  @Expose()
  area: number;

  @Expose()
  thumbnail_url?: string;

  @Expose()
  website_url: string;

  @Expose()
  shower_url: string;

  @Expose()
  is_outer_wall: boolean;

  @Expose()
  opened_at: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}

export class GymResponseDto extends InternalGymResponseDto {
  @Exclude()
  feeds: Feed[];

  constructor(gym: Partial<GymResponseDto>) {
    super();
    Object.assign(this, gym);
  }
}

export class GymResponseWithFeedsDto extends InternalGymResponseDto {
  @Expose()
  feeds: Feed[];

  constructor(gym: Partial<GymResponseWithFeedsDto>) {
    super();
    Object.assign(this, gym);
  }
}
