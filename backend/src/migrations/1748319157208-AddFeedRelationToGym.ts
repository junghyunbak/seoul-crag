import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFeedRelationToGym1748319157208 implements MigrationInterface {
  name = 'AddFeedRelationToGym1748319157208';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "feeds" ADD "gymId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "feeds" ADD CONSTRAINT "FK_17404ff72c84589918d9dcc8e90" FOREIGN KEY ("gymId") REFERENCES "gyms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "feeds" DROP CONSTRAINT "FK_17404ff72c84589918d9dcc8e90"`,
    );
    await queryRunner.query(`ALTER TABLE "feeds" DROP COLUMN "gymId"`);
  }
}
