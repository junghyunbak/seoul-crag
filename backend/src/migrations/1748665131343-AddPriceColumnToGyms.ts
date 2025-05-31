import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPriceColumnToGyms1748665131343 implements MigrationInterface {
  name = 'AddPriceColumnToGyms1748665131343';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gyms" ADD "price" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gyms" DROP COLUMN "price"`);
  }
}
