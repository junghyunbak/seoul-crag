import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateGymDto } from 'src/gyms/dto/create-gym.dto';

export class UpdateGymDto extends PartialType(CreateGymDto) {
  @IsOptional()
  @IsString()
  website_url: string;

  @IsOptional()
  @IsString()
  thumbnail_url: string;
}
