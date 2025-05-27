import { IsBoolean } from 'class-validator';

export class UpdateFeedDto {
  @IsBoolean()
  is_read: boolean;
}
