import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGymOpeningHoursTimeField1746257173014
  implements MigrationInterface
{
  name = 'UpdateGymOpeningHoursTimeField1746257173014';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gym_opening_hours" ALTER COLUMN "open_time" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "gym_opening_hours" ALTER COLUMN "close_time" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gym_opening_hours" ALTER COLUMN "close_time" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "gym_opening_hours" ALTER COLUMN "open_time" DROP NOT NULL`,
    );
  }
}
