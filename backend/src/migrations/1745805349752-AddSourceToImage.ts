import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSourceToImage1745805349752 implements MigrationInterface {
  name = 'AddSourceToImage1745805349752';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gym_images" ADD "source" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gym_images" DROP COLUMN "source"`);
  }
}
