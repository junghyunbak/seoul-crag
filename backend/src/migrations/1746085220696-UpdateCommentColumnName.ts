import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCommentColumnName1746085220696
  implements MigrationInterface
{
  name = 'UpdateCommentColumnName1746085220696';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "comments" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD "deleted_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "comments" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "comments" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }
}
