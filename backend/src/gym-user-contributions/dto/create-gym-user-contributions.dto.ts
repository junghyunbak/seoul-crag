import { IsString, IsUUID } from 'class-validator';

export class CreateGymUserContributionDto {
  @IsString()
  description: string;

  @IsUUID()
  gymId: string;

  @IsUUID()
  userId: string;

  @IsUUID()
  contributionId: string;
}
