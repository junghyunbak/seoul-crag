import {
  IsUUID,
  IsString,
  MaxLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateCommentDto {
  @IsUUID()
  gymId: string;

  @IsString()
  @MaxLength(1000)
  content: string;

  @IsOptional()
  @IsBoolean()
  isAdminOnly?: boolean;
}
