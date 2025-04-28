import { IsIn, IsString } from 'class-validator';

import { GYM_IMAGE_TYPES, GymImageType } from '../gym-images.type';

export class UploadImageDto {
  @IsIn(GYM_IMAGE_TYPES)
  type: GymImageType;

  @IsString()
  url: string;

  @IsString()
  source: string;
}
