import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContributionTable1747890837387
  implements MigrationInterface
{
  name = 'CreateContributionTable1747890837387';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "contributions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_013013dc3695d7c8ca80cb3ef7e" UNIQUE ("name"), CONSTRAINT "PK_ca2b4f39eb9e32a61278c711f79" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "contributions"`);
  }
}
