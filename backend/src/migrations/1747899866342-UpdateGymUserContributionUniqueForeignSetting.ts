import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGymUserContributionUniqueForeignSetting1747899866342
  implements MigrationInterface
{
  name = 'UpdateGymUserContributionUniqueForeignSetting1747899866342';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gym_user_contributions" DROP CONSTRAINT "UQ_bdff0c88dd4ec085cede05a8c3c"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gym_user_contributions" ADD CONSTRAINT "UQ_bdff0c88dd4ec085cede05a8c3c" UNIQUE ("contributionId", "gymId", "userId")`,
    );
  }
}
