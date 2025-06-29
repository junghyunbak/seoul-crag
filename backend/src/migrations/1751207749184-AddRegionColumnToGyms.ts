import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRegionColumnToGyms1751207749184 implements MigrationInterface {
  name = 'AddRegionColumnToGyms1751207749184';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."gyms_region_enum" AS ENUM('seoul', 'gyeonggi', 'Chungcheongnam')`,
    );
    await queryRunner.query(
      `ALTER TABLE "gyms" ADD "region" "public"."gyms_region_enum" NOT NULL DEFAULT 'seoul'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gyms" DROP COLUMN "region"`);
    await queryRunner.query(`DROP TYPE "public"."gyms_region_enum"`);
  }
}
