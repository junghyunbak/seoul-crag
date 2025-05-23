import { Expose, Type } from 'class-transformer';
import { ContributionResponseDto } from 'src/contributions/dto/contribution-response-dto';
import { GymResponseDto } from 'src/gyms/dto/gym-response-dto';

export class GymUserContributionResponseDto {
  @Expose()
  id: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => GymResponseDto)
  gym: GymResponseDto;

  @Expose()
  @Type(() => ContributionResponseDto)
  contribution: ContributionResponseDto;

  constructor(gymUserContribution: GymUserContributionResponseDto) {
    Object.assign(this, gymUserContribution);
  }
}
