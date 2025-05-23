import { Exclude, Expose } from 'class-transformer';
import { GymUserContributionResponseDto } from 'src/gym-user-contributions/dto/gym-user-contributions-response.dto';

export class ContributionResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Exclude()
  gymUserContributions: GymUserContributionResponseDto;

  @Expose()
  created_at: Date;

  constructor(contribution: ContributionResponseDto) {
    Object.assign(this, contribution);
  }
}
