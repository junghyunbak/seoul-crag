import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWebsiteUrlToGym1745822402772 implements MigrationInterface {
  name = 'AddWebsiteUrlToGym1745822402772';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gyms" ADD "website_url" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gyms" DROP COLUMN "website_url"`);
  }
}
