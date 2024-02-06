import { MigrationInterface, QueryRunner } from "typeorm";

export class Kedu1707213570010 implements MigrationInterface {
    name = 'Kedu1707213570010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kedu"."ai_tool" DROP CONSTRAINT "FK_8192da2267127f1b2ada65354e4"`);
        await queryRunner.query(`CREATE TABLE "kedu"."message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "reply_id" uuid, "text" character varying, "attach_url" character varying, "language_code" character varying, "sentence1" character varying, "sentence2" character varying, "config" character varying, "room_id" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "kedu"."room" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "title" character varying NOT NULL, "document_id" character varying, "document_url" character varying, "is_active" boolean NOT NULL DEFAULT true, "aiToolId" uuid NOT NULL, CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "kedu"."ai_tool" DROP CONSTRAINT "REL_8192da2267127f1b2ada65354e"`);
        await queryRunner.query(`ALTER TABLE "kedu"."ai_tool" DROP COLUMN "ai_tool_id"`);
        await queryRunner.query(`ALTER TABLE "kedu"."message" ADD CONSTRAINT "FK_a9edf3bbd4fc17c42ee8677b9ce" FOREIGN KEY ("room_id") REFERENCES "kedu"."room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "kedu"."room" ADD CONSTRAINT "FK_9cb7b0a171978e56982ae5a7844" FOREIGN KEY ("aiToolId") REFERENCES "kedu"."ai_tool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kedu"."room" DROP CONSTRAINT "FK_9cb7b0a171978e56982ae5a7844"`);
        await queryRunner.query(`ALTER TABLE "kedu"."message" DROP CONSTRAINT "FK_a9edf3bbd4fc17c42ee8677b9ce"`);
        await queryRunner.query(`ALTER TABLE "kedu"."ai_tool" ADD "ai_tool_id" uuid`);
        await queryRunner.query(`ALTER TABLE "kedu"."ai_tool" ADD CONSTRAINT "REL_8192da2267127f1b2ada65354e" UNIQUE ("ai_tool_id")`);
        await queryRunner.query(`DROP TABLE "kedu"."room"`);
        await queryRunner.query(`DROP TABLE "kedu"."message"`);
        await queryRunner.query(`ALTER TABLE "kedu"."ai_tool" ADD CONSTRAINT "FK_8192da2267127f1b2ada65354e4" FOREIGN KEY ("ai_tool_id") REFERENCES "kedu"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
