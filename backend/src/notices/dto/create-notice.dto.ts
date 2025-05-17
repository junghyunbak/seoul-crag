import { IsBoolean, IsEnum, IsString } from 'class-validator';

export class CreateNoticeDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(['general', 'update'])
  category: 'general' | 'update';

  @IsBoolean()
  isPinned: boolean;

  @IsBoolean()
  visible: boolean;
}
