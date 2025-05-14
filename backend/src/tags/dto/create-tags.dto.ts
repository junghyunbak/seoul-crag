import { IsEnum, IsString } from 'class-validator';
import { TagType } from 'src/tags/tags.entity';

export class CreateTagDto {
  @IsString()
  name: string;

  @IsEnum(TagType)
  type: TagType;
}
