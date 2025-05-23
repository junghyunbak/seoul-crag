import { Expose } from 'class-transformer';

export class GymResponseDto {
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
