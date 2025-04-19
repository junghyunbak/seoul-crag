import { IsIn } from 'class-validator';

import { GYM_IMAGE_TYPES, GymImageType } from 'src/gym-images/gym-images.type';

export class UploadImageDto {
  @IsIn(GYM_IMAGE_TYPES)
  type: GymImageType;
}
