import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetUniqueConditionToGymTagsTable1747394399687
  implements MigrationInterface
{
  name = 'SetUniqueConditionToGymTagsTable1747394399687';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gym_tags" ADD CONSTRAINT "UQ_dc4e28882056195ac2574472281" UNIQUE ("gymId", "tagId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gym_tags" DROP CONSTRAINT "UQ_dc4e28882056195ac2574472281"`,
    );
  }
}
