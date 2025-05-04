import { MigrationInterface, QueryRunner } from "typeorm";

export class AppendGymShortNameColumn1746371281996 implements MigrationInterface {
    name = 'AppendGymShortNameColumn1746371281996'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gyms" ADD "short_name" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gyms" DROP COLUMN "short_name"`);
    }

}
