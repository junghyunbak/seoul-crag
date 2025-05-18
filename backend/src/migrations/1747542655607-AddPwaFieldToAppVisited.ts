import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPwaFieldToAppVisited1747542655607
  implements MigrationInterface
{
  name = 'AddPwaFieldToAppVisited1747542655607';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "app_visited" ADD "is_pwa" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "app_visited" DROP COLUMN "is_pwa"`);
  }
}
