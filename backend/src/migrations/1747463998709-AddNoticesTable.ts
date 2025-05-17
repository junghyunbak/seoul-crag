import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNoticesTable1747463998709 implements MigrationInterface {
  name = 'AddNoticesTable1747463998709';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "content" text NOT NULL, "category" character varying NOT NULL, "isPinned" boolean NOT NULL DEFAULT false, "visible" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3eb18c29da25d6935fcbe584237" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "notices"`);
  }
}
