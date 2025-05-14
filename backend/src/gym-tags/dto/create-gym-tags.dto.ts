import { IsUUID } from 'class-validator';

export class CreateGymTagDto {
  @IsUUID()
  gymId: string;

  @IsUUID()
  tagId: string;
}
