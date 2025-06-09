import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddShutDownColumnToGymTable1749453965185
  implements MigrationInterface
{
  name = 'AddShutDownColumnToGymTable1749453965185';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gyms" ADD "is_shut_down" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gyms" DROP COLUMN "is_shut_down"`);
  }
}
