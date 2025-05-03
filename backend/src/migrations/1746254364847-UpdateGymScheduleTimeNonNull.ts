import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGymScheduleTimeNonNull1746254364847
  implements MigrationInterface
{
  name = 'UpdateGymScheduleTimeNonNull1746254364847';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gym_schedules" ALTER COLUMN "open_date" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "gym_schedules" ALTER COLUMN "close_date" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gym_schedules" ALTER COLUMN "close_date" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "gym_schedules" ALTER COLUMN "open_date" DROP NOT NULL`,
    );
  }
}
