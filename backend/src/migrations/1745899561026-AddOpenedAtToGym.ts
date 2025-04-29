import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOpenedAtToGym1745899561026 implements MigrationInterface {
  name = 'AddOpenedAtToGym1745899561026';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gyms" ADD "opened_at" date`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gyms" DROP COLUMN "opened_at"`);
  }
}
