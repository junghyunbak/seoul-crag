import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppendGymShowerUrlAndOuterWall1746946308623
  implements MigrationInterface
{
  name = 'AppendGymShowerUrlAndOuterWall1746946308623';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gyms" ADD "is_outer_wall" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "gyms" ADD "shower_url" text NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gyms" DROP COLUMN "shower_url"`);
    await queryRunner.query(`ALTER TABLE "gyms" DROP COLUMN "is_outer_wall"`);
  }
}
