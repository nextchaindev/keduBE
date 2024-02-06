import { MigrationInterface, QueryRunner } from "typeorm";

export class Kedu1707231536362 implements MigrationInterface {
    name = 'Kedu1707231536362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "kedu"."message_role_enum" AS ENUM('admin', 'user', 'bot')`);
        await queryRunner.query(`ALTER TABLE "kedu"."message" ADD "role" "kedu"."message_role_enum" DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kedu"."message" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "kedu"."message_role_enum"`);
    }

}
