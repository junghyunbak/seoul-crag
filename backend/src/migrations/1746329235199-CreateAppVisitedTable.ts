import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAppVisitedTable1746329235199 implements MigrationInterface {
  name = 'CreateAppVisitedTable1746329235199';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "app_visited" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid, "ip" character varying NOT NULL, "url" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_61bce195b826f7fa2a61e2b4711" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "app_visited"`);
  }
}
