import { IsString } from 'class-validator';

export class UpdateImageDto {
  @IsString()
  imageId: string;

  @IsString()
  source: string;
}
