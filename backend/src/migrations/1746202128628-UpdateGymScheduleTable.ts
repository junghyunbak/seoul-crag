import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGymScheduleTable1746202128628 implements MigrationInterface {
  name = 'UpdateGymScheduleTable1746202128628';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gym_schedules" DROP COLUMN "date"`);
    await queryRunner.query(`ALTER TABLE "gym_schedules" DROP COLUMN "reason"`);
    await queryRunner.query(
      `ALTER TABLE "gym_schedules" DROP COLUMN "is_regular"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gym_schedules" ADD "open_date" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "gym_schedules" ADD "close_date" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gym_schedules" DROP COLUMN "close_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gym_schedules" DROP COLUMN "open_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gym_schedules" ADD "is_regular" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "gym_schedules" ADD "reason" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "gym_schedules" ADD "date" date NOT NULL`,
    );
  }
}
