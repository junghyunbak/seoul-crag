import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGymDiscountTable1748694019942 implements MigrationInterface {
  name = 'AddGymDiscountTable1748694019942';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."gym_discounts_type_enum" AS ENUM('group', 'time', 'event')`,
    );
    await queryRunner.query(
      `CREATE TABLE "gym_discounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."gym_discounts_type_enum" NOT NULL, "price" integer NOT NULL, "description" text NOT NULL, "weekday" integer, "min_group_size" integer, "date" date, "time_start" TIME, "time_end" TIME, "gymId" uuid, CONSTRAINT "PK_a49aee482a56466c55bf72c8f1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "gym_discounts" ADD CONSTRAINT "FK_317e891ea5489bde50784082314" FOREIGN KEY ("gymId") REFERENCES "gyms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gym_discounts" DROP CONSTRAINT "FK_317e891ea5489bde50784082314"`,
    );
    await queryRunner.query(`DROP TABLE "gym_discounts"`);
    await queryRunner.query(`DROP TYPE "public"."gym_discounts_type_enum"`);
  }
}
