import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIncheonRegion1751208214627 implements MigrationInterface {
  name = 'AddIncheonRegion1751208214627';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."gyms_region_enum" RENAME TO "gyms_region_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."gyms_region_enum" AS ENUM('seoul', 'gyeonggi', 'chungcheongnam', 'incheon')`,
    );
    await queryRunner.query(
      `ALTER TABLE "gyms" ALTER COLUMN "region" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "gyms" ALTER COLUMN "region" TYPE "public"."gyms_region_enum" USING "region"::"text"::"public"."gyms_region_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gyms" ALTER COLUMN "region" SET DEFAULT 'seoul'`,
    );
    await queryRunner.query(`DROP TYPE "public"."gyms_region_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."gyms_region_enum_old" AS ENUM('seoul', 'gyeonggi', 'Chungcheongnam')`,
    );
    await queryRunner.query(
      `ALTER TABLE "gyms" ALTER COLUMN "region" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "gyms" ALTER COLUMN "region" TYPE "public"."gyms_region_enum_old" USING "region"::"text"::"public"."gyms_region_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gyms" ALTER COLUMN "region" SET DEFAULT 'seoul'`,
    );
    await queryRunner.query(`DROP TYPE "public"."gyms_region_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."gyms_region_enum_old" RENAME TO "gyms_region_enum"`,
    );
  }
}
