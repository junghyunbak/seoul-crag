import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
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

  @IsOptional()
  @IsString()
  shower_url: string;

  @IsOptional()
  @IsBoolean()
  is_outer_wall: boolean;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsBoolean()
  is_shut_down: boolean;
}
