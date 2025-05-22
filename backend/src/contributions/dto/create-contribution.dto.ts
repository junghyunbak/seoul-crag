import { IsString } from 'class-validator';

export class CreateContributionDto {
  @IsString()
  name: string;
}
