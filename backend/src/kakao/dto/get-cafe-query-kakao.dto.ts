import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetCafeQueryKakaoDto {
  @Type(() => Number)
  @IsNumber()
  radius: number;

  @Type(() => Number)
  @IsNumber()
  lat: number;

  @Type(() => Number)
  @IsNumber()
  lng: number;
}
