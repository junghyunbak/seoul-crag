import { IsBoolean, IsString } from 'class-validator';

export class CreateAppVisitedDto {
  @IsString()
  url: string;

  @IsBoolean()
  is_pwa: boolean;
}
