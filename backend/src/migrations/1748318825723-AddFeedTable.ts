import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFeedTable1748318825723 implements MigrationInterface {
  name = 'AddFeedTable1748318825723';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "feeds" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "is_read" boolean NOT NULL, "thumbnail_url" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3dafbf766ecbb1eb2017732153f" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "feeds"`);
  }
}
