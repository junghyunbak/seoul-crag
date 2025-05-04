import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { CreateGymDto } from 'src/gyms/dto/create-gym.dto';

export class UpdateGymDto extends PartialType(CreateGymDto) {
  @IsOptional()
  @IsString()
  website_url: string;

  @IsOptional()
  @IsString()
  thumbnail_url: string;

  @IsOptional()
  @IsDateString()
  opened_at: string;

  @IsOptional()
  @IsString()
  short_name: string;
}
