import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsNumber,
} from 'class-validator';

export class CreateGymDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  thumbnail_url?: string;

  @IsOptional()
  area?: number;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
