import { IsString } from 'class-validator';

export class UpdateGymUserContributionDto {
  @IsString()
  description: string;
}
