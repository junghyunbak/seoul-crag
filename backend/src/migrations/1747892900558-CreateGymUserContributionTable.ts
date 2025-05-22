import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGymUserContributionTable1747892900558
  implements MigrationInterface
{
  name = 'CreateGymUserContributionTable1747892900558';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "gym_user_contributions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "gymId" uuid, "userId" uuid, "contributionId" uuid, CONSTRAINT "UQ_bdff0c88dd4ec085cede05a8c3c" UNIQUE ("gymId", "userId", "contributionId"), CONSTRAINT "PK_415dc2319a8285a6c437feabdf8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "gym_user_contributions" ADD CONSTRAINT "FK_f6e98d1bcdfe8628aad84b0bd61" FOREIGN KEY ("gymId") REFERENCES "gyms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gym_user_contributions" ADD CONSTRAINT "FK_6c440dbe321d0edf389ff40e7b2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gym_user_contributions" ADD CONSTRAINT "FK_f7018241ceaefd927ce636ae27a" FOREIGN KEY ("contributionId") REFERENCES "contributions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gym_user_contributions" DROP CONSTRAINT "FK_f7018241ceaefd927ce636ae27a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gym_user_contributions" DROP CONSTRAINT "FK_6c440dbe321d0edf389ff40e7b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gym_user_contributions" DROP CONSTRAINT "FK_f6e98d1bcdfe8628aad84b0bd61"`,
    );
    await queryRunner.query(`DROP TABLE "gym_user_contributions"`);
  }
}
