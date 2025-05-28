import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsAllDayColumnToGymSchedule1748426072829
  implements MigrationInterface
{
  name = 'AddIsAllDayColumnToGymSchedule1748426072829';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gym_schedules" ADD "is_all_day" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gym_schedules" DROP COLUMN "is_all_day"`,
    );
  }
}
