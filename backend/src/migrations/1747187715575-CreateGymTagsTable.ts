import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGymTagsTable1747187715575 implements MigrationInterface {
  name = 'CreateGymTagsTable1747187715575';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."tags_type_enum" AS ENUM('climb', 'board', 'location')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."tags_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gym_tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "gymId" uuid, "tagId" uuid, CONSTRAINT "PK_b04000fa6584c3d0f08fcb216b1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "gym_tags" ADD CONSTRAINT "FK_0f6793856553da580d89629fd49" FOREIGN KEY ("gymId") REFERENCES "gyms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gym_tags" ADD CONSTRAINT "FK_0c33e10de7d46fe6cee94557972" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gym_tags" DROP CONSTRAINT "FK_0c33e10de7d46fe6cee94557972"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gym_tags" DROP CONSTRAINT "FK_0f6793856553da580d89629fd49"`,
    );
    await queryRunner.query(`DROP TABLE "gym_tags"`);
    await queryRunner.query(`DROP TABLE "tags"`);
    await queryRunner.query(`DROP TYPE "public"."tags_type_enum"`);
  }
}
